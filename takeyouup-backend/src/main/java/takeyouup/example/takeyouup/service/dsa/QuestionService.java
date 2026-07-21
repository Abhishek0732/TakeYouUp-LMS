package takeyouup.example.takeyouup.service.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.dsa.QuestionDTO;
import takeyouup.example.takeyouup.dto.dsa.QuestionRequest;
import takeyouup.example.takeyouup.dto.dsa.QuestionProgressResponse;
import takeyouup.example.takeyouup.dto.dsa.QuestionResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.service.UserService;
import takeyouup.example.takeyouup.model.dsa.Difficulty;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.model.dsa.Question;
import takeyouup.example.takeyouup.model.dsa.Topic;
import takeyouup.example.takeyouup.repository.dsa.DifficultyRepository;
import takeyouup.example.takeyouup.repository.dsa.PlatformRepository;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;
import takeyouup.example.takeyouup.repository.dsa.TopicRepository;
import takeyouup.example.takeyouup.repository.UserProgressRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final PlatformRepository platformRepository;
    private final DifficultyRepository difficultyRepository;
    private final UserService userService;
    private final UserProgressRepository progressRepository;

    /** Canonical ordering so clients always render Easy → Medium → Hard. */
    private static final List<String> DIFFICULTY_ORDER = List.of("easy", "medium", "hard");

    private static int difficultyRank(String level) {
        int index = DIFFICULTY_ORDER.indexOf(level.toLowerCase());
        // Anything the catalogue adds later sorts after the three known levels.
        return index == -1 ? DIFFICULTY_ORDER.size() : index;
    }

    /**
     * Difficulty breakdown for the current topic/search filter, used by the
     * summary cards on the problems page. Returned as a level -> count map with
     * every level the catalogue knows about, so a bucket with no matches shows
     * a real zero instead of disappearing.
     */
    public Map<String, Long> countByDifficulty(String topic, String search) {
        String topicFilter = (topic == null || topic.isBlank()) ? null : topic;
        String searchFilter = (search == null || search.isBlank()) ? null : search;

        Map<String, Long> counts = new LinkedHashMap<>();
        difficultyRepository.findAll().stream()
                .map(Difficulty::getLevel)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(QuestionService::difficultyRank).thenComparing(l -> l))
                .forEach(level -> counts.put(level, 0L));
        // With no filters the OR-null predicates would defeat the difficulty
        // index; the dedicated query is a plain grouped scan.
        List<Object[]> rows = (topicFilter == null && searchFilter == null)
                ? questionRepository.countByDifficultyAll()
                : questionRepository.countByDifficulty(topicFilter, searchFilter);
        for (Object[] row : rows) {
            if (row[0] != null) {
                counts.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        return counts;
    }

    /**
     * Solved-vs-total breakdown for the signed-in user. Two grouped queries, no
     * per-question round trips, so it stays flat as the catalogue grows.
     */
    public QuestionProgressResponse getProgressForCurrentUser() {
        User user = userService.getCurrentUser();

        Map<String, Long> totals = countByDifficulty(null, null);
        Map<String, Long> solvedByLevel = new LinkedHashMap<>();
        for (Object[] row : questionRepository.countSolvedByDifficulty(user.getId())) {
            if (row[0] != null) {
                solvedByLevel.put((String) row[0], ((Number) row[1]).longValue());
            }
        }

        Map<String, QuestionProgressResponse.Bucket> buckets = new LinkedHashMap<>();
        long total = 0;
        long solved = 0;
        for (Map.Entry<String, Long> entry : totals.entrySet()) {
            long levelTotal = entry.getValue();
            long levelSolved = Math.min(solvedByLevel.getOrDefault(entry.getKey(), 0L), levelTotal);
            buckets.put(entry.getKey(), new QuestionProgressResponse.Bucket(levelTotal, levelSolved));
            total += levelTotal;
            solved += levelSolved;
        }

        int percent = total == 0 ? 0 : (int) Math.round((solved * 100.0) / total);
        return new QuestionProgressResponse(total, solved, percent, buckets, buildStreak(user));
    }

    /** Days shown in the little activity strip under the streak number. */
    private static final int STREAK_WINDOW_DAYS = 14;

    /**
     * Walks the distinct solve days newest-first.
     *
     * Today counts, and so does yesterday: the streak is only broken once a day
     * has actually been missed, otherwise it would read zero every morning
     * before the first solve.
     */
    private QuestionProgressResponse.Streak buildStreak(User user) {
        // Dates come back as ISO strings: JPQL's CAST(... AS date) does not
        // convert cleanly to LocalDate through Spring Data's converter.
        List<LocalDate> days = progressRepository.findSolveDates(user.getId(), "QUESTION")
                .stream().map(LocalDate::parse).toList();
        if (days.isEmpty()) {
            return new QuestionProgressResponse.Streak(0, 0, false,
                    Collections.nCopies(STREAK_WINDOW_DAYS, false));
        }

        Set<LocalDate> active = new HashSet<>(days);
        LocalDate today = LocalDate.now();
        boolean solvedToday = active.contains(today);

        int current = 0;
        LocalDate cursor = solvedToday ? today : today.minusDays(1);
        while (active.contains(cursor)) {
            current++;
            cursor = cursor.minusDays(1);
        }

        // days is sorted DESC, so a run is a stretch of consecutive descending dates.
        int longest = 1;
        int run = 1;
        for (int i = 1; i < days.size(); i++) {
            if (days.get(i).plusDays(1).equals(days.get(i - 1))) {
                run++;
            } else {
                run = 1;
            }
            longest = Math.max(longest, run);
        }
        longest = Math.max(longest, current);

        List<Boolean> lastDays = new ArrayList<>(STREAK_WINDOW_DAYS);
        for (int i = STREAK_WINDOW_DAYS - 1; i >= 0; i--) {
            lastDays.add(active.contains(today.minusDays(i)));
        }

        return new QuestionProgressResponse.Streak(current, longest, solvedToday, lastDays);
    }

    public Page<QuestionResponse> getQuestions(
            int page,
            int size,
            String topic,
            String difficulty,
            String search
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        boolean noFilters = (topic == null || topic.isBlank())
                && (difficulty == null || difficulty.isBlank())
                && (search == null || search.isBlank());

        // Fast path for the unfiltered listing: findAll() uses a plain COUNT(*)
        // instead of counting over the LEFT JOINs + LOWER()/OR-null conditions,
        // which is dramatically cheaper on large tables.
        Page<Question> questions = noFilters
                ? questionRepository.findAll(pageable)
                : questionRepository.findQuestions(topic, difficulty, search, pageable);

        return questions.map(this::mapToResponse);
    }

    private QuestionResponse mapToResponse(Question q) {

        QuestionResponse res = new QuestionResponse();

        res.setId(q.getId());
        res.setTitle(q.getTitle());
        res.setUrl(q.getUrl());
        // topic is required; platform/difficulty are optional and may be null
        res.setTopic(q.getTopic() != null ? q.getTopic().getName() : null);
        res.setDifficulty(q.getDifficulty() != null ? q.getDifficulty().getLevel() : null);
        res.setPlatform(q.getPlatform() != null ? q.getPlatform().getName() : null);

        return res;
    }

    public Page<QuestionResponse> getByTopic(String topic, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByTopic_Name(topic, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> getByDifficulty(String difficulty, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByDifficulty_Level(difficulty, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> getByPlatform(String platform, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByPlatform_Name(platform, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> search(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }

    public Question addQuestion(QuestionRequest request) {

        Question question = new Question();

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(resolveTopic(request.getTopic()));
        question.setPlatform(resolvePlatform(request.getPlatform()));
        question.setDifficulty(resolveDifficulty(request.getDifficulty()));

        return questionRepository.save(question);
    }

    // --- get-or-create helpers so admins can add questions with new
    //     topics/platforms/difficulties without a separate setup step ---

    /** Topic is required; created on the fly if it doesn't exist yet. */
    private Topic resolveTopic(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Topic is required");
        }
        Topic topic = topicRepository.findByName(name.trim());
        if (topic == null) {
            Topic created = new Topic();
            created.setName(name.trim());
            topic = topicRepository.save(created);
        }
        return topic;
    }

    /** Platform is optional; created if a new non-blank name is supplied. */
    private Platform resolvePlatform(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        Platform platform = platformRepository.findByName(name.trim());
        if (platform == null) {
            Platform created = new Platform();
            created.setName(name.trim());
            platform = platformRepository.save(created);
        }
        return platform;
    }

    /** Difficulty is optional; created if a new non-blank level is supplied. */
    private Difficulty resolveDifficulty(String level) {
        if (level == null || level.isBlank()) {
            return null;
        }
        Difficulty difficulty = difficultyRepository.findByLevel(level.trim());
        if (difficulty == null) {
            Difficulty created = new Difficulty();
            created.setLevel(level.trim());
            difficulty = difficultyRepository.save(created);
        }
        return difficulty;
    }

    public List<Question> addBulkQuestions(List<QuestionRequest> requests) {

        List<Question> questions = new ArrayList<>();

        for (QuestionRequest request : requests) {

            Question q = new Question();

            q.setTitle(request.getTitle());
            q.setUrl(request.getUrl());
            q.setTopic(resolveTopic(request.getTopic()));
            q.setPlatform(resolvePlatform(request.getPlatform()));
            q.setDifficulty(resolveDifficulty(request.getDifficulty()));

            questions.add(q);
        }

        return questionRepository.saveAll(questions);
    }

    public Question updateQuestion(Long id, QuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(resolveTopic(request.getTopic()));
        question.setPlatform(resolvePlatform(request.getPlatform()));
        question.setDifficulty(resolveDifficulty(request.getDifficulty()));

        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found");
        }
        questionRepository.deleteById(id);
    }
}
