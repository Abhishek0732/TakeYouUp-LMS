package takeyouup.example.takeyouup.seed;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import takeyouup.example.takeyouup.enums.Role;
import takeyouup.example.takeyouup.model.*;
import takeyouup.example.takeyouup.model.dsa.Difficulty;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.model.dsa.Question;
import takeyouup.example.takeyouup.model.dsa.Topic;
import takeyouup.example.takeyouup.model.quiz.Quiz;
import takeyouup.example.takeyouup.model.resources.*;
import takeyouup.example.takeyouup.repository.*;
import takeyouup.example.takeyouup.repository.dsa.DifficultyRepository;
import takeyouup.example.takeyouup.repository.dsa.PlatformRepository;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;
import takeyouup.example.takeyouup.repository.dsa.TopicRepository;
import takeyouup.example.takeyouup.repository.quiz.QuizRepository;
import takeyouup.example.takeyouup.repository.resources.ResourceCategoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Populates the database with a coherent set of starter content so the portal is
 * usable immediately after a fresh boot. Every section is idempotent — it only
 * inserts when the target table is empty — so it is safe to run on every startup.
 *
 * Disable with {@code app.seed.enabled=false}.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final TopicRepository topicRepository;
    private final PlatformRepository platformRepository;
    private final DifficultyRepository difficultyRepository;
    private final QuestionRepository questionRepository;
    private final ResourceCategoryRepository resourceCategoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        seedDsaBank();
        List<Course> courses = seedCourses();
        seedQuizzes(courses);
        seedResources();
        log.info("Data seeding complete.");
    }

    // ------------------------------------------------------------------ users
    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }
        userRepository.save(User.builder()
                .name("Admin")
                .email("admin@takeyouup.com")
                .password(passwordEncoder.encode("admin1234"))
                .role(Role.ADMIN)
                .emailVerified(true)
                .build());

        userRepository.save(User.builder()
                .name("Demo Student")
                .email("student@takeyouup.com")
                .password(passwordEncoder.encode("student1234"))
                .role(Role.USER)
                .emailVerified(true)
                .build());

        log.info("Seeded users: admin@takeyouup.com / student@takeyouup.com");
    }

    // -------------------------------------------------------------- DSA bank
    private void seedDsaBank() {
        if (questionRepository.count() > 0) {
            return;
        }

        Topic arrays = topicRepository.save(topic("Arrays"));
        Topic strings = topicRepository.save(topic("Strings"));
        Topic linkedList = topicRepository.save(topic("Linked List"));
        Topic trees = topicRepository.save(topic("Trees"));
        Topic dp = topicRepository.save(topic("Dynamic Programming"));
        Topic graphs = topicRepository.save(topic("Graphs"));

        Platform leetcode = platformRepository.save(platform("LeetCode"));
        Platform gfg = platformRepository.save(platform("GeeksforGeeks"));
        Platform hackerrank = platformRepository.save(platform("HackerRank"));

        Difficulty easy = difficultyRepository.save(difficulty("Easy"));
        Difficulty medium = difficultyRepository.save(difficulty("Medium"));
        Difficulty hard = difficultyRepository.save(difficulty("Hard"));

        List<Question> questions = List.of(
                question("Two Sum", "https://leetcode.com/problems/two-sum/", arrays, leetcode, easy),
                question("Best Time to Buy and Sell Stock", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", arrays, leetcode, easy),
                question("Maximum Subarray", "https://leetcode.com/problems/maximum-subarray/", arrays, leetcode, medium),
                question("Product of Array Except Self", "https://leetcode.com/problems/product-of-array-except-self/", arrays, leetcode, medium),
                question("Valid Anagram", "https://leetcode.com/problems/valid-anagram/", strings, leetcode, easy),
                question("Longest Substring Without Repeating Characters", "https://leetcode.com/problems/longest-substring-without-repeating-characters/", strings, leetcode, medium),
                question("Reverse Linked List", "https://leetcode.com/problems/reverse-linked-list/", linkedList, leetcode, easy),
                question("Merge Two Sorted Lists", "https://leetcode.com/problems/merge-two-sorted-lists/", linkedList, leetcode, easy),
                question("Detect Cycle in a Linked List", "https://leetcode.com/problems/linked-list-cycle/", linkedList, leetcode, medium),
                question("Maximum Depth of Binary Tree", "https://leetcode.com/problems/maximum-depth-of-binary-tree/", trees, leetcode, easy),
                question("Validate Binary Search Tree", "https://leetcode.com/problems/validate-binary-search-tree/", trees, leetcode, medium),
                question("Lowest Common Ancestor of a BST", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", trees, gfg, medium),
                question("Climbing Stairs", "https://leetcode.com/problems/climbing-stairs/", dp, leetcode, easy),
                question("House Robber", "https://leetcode.com/problems/house-robber/", dp, leetcode, medium),
                question("Longest Increasing Subsequence", "https://leetcode.com/problems/longest-increasing-subsequence/", dp, leetcode, hard),
                question("Number of Islands", "https://leetcode.com/problems/number-of-islands/", graphs, leetcode, medium),
                question("Course Schedule", "https://leetcode.com/problems/course-schedule/", graphs, leetcode, medium),
                question("Word Ladder", "https://leetcode.com/problems/word-ladder/", graphs, hackerrank, hard)
        );
        questionRepository.saveAll(questions);
        log.info("Seeded {} DSA questions across {} topics.", questions.size(), 6);
    }

    // --------------------------------------------------------------- courses
    private List<Course> seedCourses() {
        if (courseRepository.count() > 0) {
            return courseRepository.findAll();
        }

        List<Course> saved = new ArrayList<>();

        // ---- Course 1: DSA ------------------------------------------------
        Course dsa = course("dsa-101", "data-structures-and-algorithms",
                "Data Structures & Algorithms",
                "Master the core data structures and algorithmic patterns that power technical interviews and real-world systems.",
                "Programming", "Beginner", "10 weeks", 4820, 4.8,
                cover("data-structures-and-algorithms", "#ff4d1c"),
                "Abhishek Verma", "Free");
        CourseModule dsaM1 = module(dsa, "Getting Started");
        lesson(dsaM1, "Introduction to DSA", "introduction-to-dsa", "8 min",
                "Data Structures and Algorithms (DSA) are the foundation of efficient software. A data structure organises data; an algorithm is a step-by-step procedure to solve a problem.",
                keyPoint("Why DSA matters", "Efficient DSA turns a slow, unscalable solution into one that handles millions of records."),
                keyPoint("Time vs Space", "Almost every design decision is a trade-off between how fast a program runs and how much memory it uses."));
        lesson(dsaM1, "Big-O Notation", "big-o-notation", "12 min",
                "Big-O describes how the running time or space of an algorithm grows as the input size grows. It focuses on the dominant term and ignores constants.",
                keyPoint("Common complexities", "O(1), O(log n), O(n), O(n log n), O(n^2) — learn to recognise each from the code shape."),
                keyPoint("Worst case", "Big-O typically expresses the worst-case upper bound so you can reason about guarantees."));
        CourseModule dsaM2 = module(dsa, "Linear Structures");
        lesson(dsaM2, "Arrays & Strings", "arrays-and-strings", "15 min",
                "Arrays store elements contiguously in memory giving O(1) random access. Strings are arrays of characters and share the same traversal patterns.",
                keyPoint("Two pointers", "A pair of indices moving through an array solves many subarray and palindrome problems in O(n)."),
                keyPoint("Sliding window", "Maintain a moving range to answer 'best window' questions without re-scanning."));
        lesson(dsaM2, "Linked Lists", "linked-lists", "14 min",
                "A linked list chains nodes together with pointers, trading O(1) random access for O(1) insertion and deletion at known positions.",
                keyPoint("Fast & slow pointers", "Detect cycles and find the middle node in a single pass."));
        saved.add(courseRepository.save(dsa));

        // ---- Course 2: Java ----------------------------------------------
        Course java = course("java-101", "java-programming",
                "Java Programming Masterclass",
                "Go from Java syntax to object-oriented design, collections, and building real backend applications.",
                "Programming", "Beginner", "8 weeks", 3960, 4.7,
                cover("java-programming", "#f89820"),
                "Abhishek Verma", "Free");
        CourseModule javaM1 = module(java, "Java Fundamentals");
        lesson(javaM1, "Variables & Data Types", "variables-and-data-types", "10 min",
                "Java is statically typed: every variable has a declared type. Primitives (int, double, boolean) hold values directly; objects hold references.",
                keyPoint("Primitives vs objects", "Primitives live on the stack; objects live on the heap and are accessed by reference."));
        lesson(javaM1, "Control Flow", "control-flow", "11 min",
                "Control-flow statements decide which code runs: if/else, switch, for, while, and enhanced for-each loops.",
                keyPoint("Enhanced for", "Use for-each to iterate collections cleanly when you do not need the index."));
        CourseModule javaM2 = module(java, "Object-Oriented Java");
        lesson(javaM2, "Classes & Objects", "classes-and-objects", "13 min",
                "A class is a blueprint; an object is an instance. Encapsulation keeps fields private and exposes behaviour through methods.",
                keyPoint("Four pillars", "Encapsulation, Inheritance, Polymorphism and Abstraction underpin all OOP design."));
        saved.add(courseRepository.save(java));

        // ---- Course 3: Python --------------------------------------------
        Course python = course("python-101", "python-programming",
                "Python for Everybody",
                "Learn Python from scratch — syntax, data structures, functions, and a first taste of automation.",
                "Programming", "Beginner", "6 weeks", 5210, 4.9,
                cover("python-programming", "#4b8bbe"),
                "Abhishek Verma", "Free");
        CourseModule pyM1 = module(python, "Python Basics");
        lesson(pyM1, "Getting Started with Python", "getting-started-with-python", "9 min",
                "Python is a high-level, dynamically typed language famed for its readable syntax. Indentation defines code blocks instead of braces.",
                keyPoint("Readable by design", "Python code often reads like pseudo-code, which shortens the path from idea to prototype."));
        lesson(pyM1, "Lists, Dicts & Sets", "lists-dicts-and-sets", "12 min",
                "Python ships with powerful built-in collections: lists (ordered), dicts (key-value), and sets (unique elements).",
                keyPoint("Comprehensions", "List and dict comprehensions build collections in a single expressive line."));
        saved.add(courseRepository.save(python));

        // ---- Course 4: Web Development ------------------------------------
        Course web = course("web-101", "web-development",
                "Full-Stack Web Development",
                "Build modern web apps with HTML, CSS, JavaScript, React on the front end and REST APIs on the back end.",
                "Development", "Intermediate", "12 weeks", 2870, 4.6,
                cover("web-development", "#38bdf8"),
                "Abhishek Verma", "Free");
        CourseModule webM1 = module(web, "Frontend Foundations");
        lesson(webM1, "HTML & CSS Essentials", "html-and-css-essentials", "14 min",
                "HTML structures content; CSS styles it. Together with the box model and flexbox they form the layout backbone of every website.",
                keyPoint("Semantic HTML", "Use header, nav, main and footer so pages are accessible and SEO-friendly."));
        lesson(webM1, "JavaScript & the DOM", "javascript-and-the-dom", "16 min",
                "JavaScript makes pages interactive by manipulating the DOM and responding to events.",
                keyPoint("Event loop", "Async callbacks, promises and async/await let the UI stay responsive during I/O."));
        saved.add(courseRepository.save(web));

        // ---- Course 5: Machine Learning ----------------------------------
        Course ml = course("ml-101", "machine-learning",
                "Machine Learning Foundations",
                "Understand the maths and intuition behind regression, classification, and model evaluation.",
                "AI/ML", "Intermediate", "10 weeks", 1940, 4.7,
                cover("machine-learning", "#a855f7"),
                "Abhishek Verma", "Free");
        CourseModule mlM1 = module(ml, "Core Concepts");
        lesson(mlM1, "What is Machine Learning?", "what-is-machine-learning", "10 min",
                "Machine learning builds models that learn patterns from data instead of being explicitly programmed with rules.",
                keyPoint("Supervised vs unsupervised", "Supervised learning uses labelled data; unsupervised finds structure in unlabelled data."));
        lesson(mlM1, "Linear Regression", "linear-regression", "15 min",
                "Linear regression fits a straight line that minimises the squared error between predictions and actual values.",
                keyPoint("Gradient descent", "An iterative optimiser that nudges parameters downhill along the loss surface."));
        saved.add(courseRepository.save(ml));

        // ---- Course 6: System Design -------------------------------------
        Course sysd = course("sysd-101", "system-design",
                "System Design Fundamentals",
                "Learn to design scalable systems — load balancing, caching, databases, and the trade-offs behind them.",
                "Development", "Advanced", "8 weeks", 1520, 4.8,
                cover("system-design", "#22c55e"),
                "Abhishek Verma", "Free");
        CourseModule sdM1 = module(sysd, "Scalability Basics");
        lesson(sdM1, "Scaling & Load Balancing", "scaling-and-load-balancing", "13 min",
                "Vertical scaling adds power to one machine; horizontal scaling adds more machines behind a load balancer.",
                keyPoint("Statelessness", "Stateless services scale horizontally because any node can serve any request."));
        lesson(sdM1, "Caching Strategies", "caching-strategies", "12 min",
                "Caching stores frequently accessed data closer to the consumer to cut latency and database load.",
                keyPoint("Cache invalidation", "Deciding when cached data is stale is one of the genuinely hard problems in computing."));
        saved.add(courseRepository.save(sysd));

        log.info("Seeded {} courses with modules, lessons and key points.", saved.size());
        return saved;
    }

    // --------------------------------------------------------------- quizzes
    private void seedQuizzes(List<Course> courses) {
        if (quizRepository.count() > 0 || courses.isEmpty()) {
            return;
        }
        Long dsaId = courseIdBySlug(courses, "data-structures-and-algorithms");
        Long javaId = courseIdBySlug(courses, "java-programming");
        Long pythonId = courseIdBySlug(courses, "python-programming");

        if (dsaId != null) {
            quizRepository.save(quiz("DSA Fundamentals Quiz", dsaId, List.of(
                    mcq("What is the time complexity of accessing an element by index in an array?",
                            List.of("O(1)", "O(n)", "O(log n)", "O(n^2)"), 0),
                    mcq("Which data structure uses FIFO ordering?",
                            List.of("Stack", "Queue", "Tree", "Graph"), 1),
                    mcq("A binary search runs in what time complexity on a sorted array?",
                            List.of("O(n)", "O(n log n)", "O(log n)", "O(1)"), 2),
                    mcq("Which technique detects a cycle in a linked list in O(1) space?",
                            List.of("Hashing", "Fast & slow pointers", "Recursion", "Sorting"), 1)
            )));
        }
        if (javaId != null) {
            quizRepository.save(quiz("Java Basics Quiz", javaId, List.of(
                    mcq("Which keyword is used to inherit a class in Java?",
                            List.of("implements", "extends", "inherits", "super"), 1),
                    mcq("What is the default value of an int field in Java?",
                            List.of("null", "0", "undefined", "-1"), 1),
                    mcq("Which collection does NOT allow duplicate elements?",
                            List.of("List", "Set", "ArrayList", "LinkedList"), 1)
            )));
        }
        if (pythonId != null) {
            quizRepository.save(quiz("Python Basics Quiz", pythonId, List.of(
                    mcq("Which of these is an immutable type in Python?",
                            List.of("list", "dict", "tuple", "set"), 2),
                    mcq("What does the len() function return for a string?",
                            List.of("The number of characters", "The memory size", "The last index", "The ASCII sum"), 0),
                    mcq("How do you start a single-line comment in Python?",
                            List.of("//", "#", "--", "/*"), 1)
            )));
        }
        log.info("Seeded quizzes for DSA, Java and Python courses.");
    }

    // ------------------------------------------------------------- resources
    private void seedResources() {
        if (resourceCategoryRepository.count() > 0) {
            return;
        }
        try {
            var resource = new org.springframework.core.io.ClassPathResource("seed/aptitude-resources.json");
            com.fasterxml.jackson.databind.JsonNode root;
            try (var in = resource.getInputStream()) {
                root = objectMapper.readTree(in);
            }

            int count = 0;
            for (var catNode : root) {
                ResourceCategory category = ResourceCategory.builder()
                        .slug(catNode.path("slug").asText())
                        .title(catNode.path("title").asText())
                        .shortTitle(catNode.path("shortTitle").asText(null))
                        .description(catNode.path("description").asText(null))
                        .heroText(catNode.path("heroText").asText(null))
                        .accent(catNode.path("accent").asText(null))
                        .topics(new ArrayList<>())
                        .build();

                int topicOrder = 0;
                for (var topicNode : catNode.path("topics")) {
                    ResourceTopic topic = ResourceTopic.builder()
                            .slug(topicNode.path("slug").asText())
                            .title(topicNode.path("title").asText())
                            .summary(topicNode.path("summary").asText(null))
                            .difficulty(topicNode.path("difficulty").asText(null))
                            .duration(topicNode.path("duration").asText(null))
                            .sortOrder(topicOrder++)
                            .category(category)
                            .concepts(new ArrayList<>())
                            .questions(new ArrayList<>())
                            .build();

                    int conceptOrder = 0;
                    for (var conceptNode : topicNode.path("concepts")) {
                        topic.getConcepts().add(TopicConcept.builder()
                                .name(conceptNode.asText())
                                .sortOrder(conceptOrder++)
                                .topic(topic)
                                .build());
                    }

                    int qOrder = 0;
                    for (var qNode : topicNode.path("questions")) {
                        McqQuestion question = McqQuestion.builder()
                                .questionText(qNode.path("question").asText())
                                .correctAnswerIndex(qNode.path("correctAnswer").asInt())
                                .explanation(qNode.path("explanation").asText(null))
                                .sortOrder(qOrder++)
                                .topic(topic)
                                .options(new ArrayList<>())
                                .build();
                        int optIndex = 0;
                        for (var optNode : qNode.path("options")) {
                            question.getOptions().add(QuestionOption.builder()
                                    .optionText(optNode.asText())
                                    .optionIndex(optIndex++)
                                    .question(question)
                                    .build());
                        }
                        topic.getQuestions().add(question);
                    }

                    category.getTopics().add(topic);
                }

                resourceCategoryRepository.save(category);
                count++;
            }
            log.info("Seeded {} aptitude resource categories from seed/aptitude-resources.json.", count);
        } catch (Exception e) {
            log.warn("Could not seed aptitude resources: {}", e.getMessage());
        }
    }

    // =================================================================== helpers

    private Topic topic(String name) {
        Topic t = new Topic();
        t.setName(name);
        return t;
    }

    private Platform platform(String name) {
        Platform p = new Platform();
        p.setName(name);
        return p;
    }

    private Difficulty difficulty(String level) {
        Difficulty d = new Difficulty();
        d.setLevel(level);
        return d;
    }

    private Question question(String title, String url, Topic topic, Platform platform, Difficulty difficulty) {
        Question q = new Question();
        q.setTitle(title);
        q.setUrl(url);
        q.setTopic(topic);
        q.setPlatform(platform);
        q.setDifficulty(difficulty);
        return q;
    }

    private Course course(String courseId, String slug, String title, String description, String category,
                          String level, String duration, int students, double rating, String image,
                          String instructor, String price) {
        Course c = new Course();
        c.setCourseId(courseId);
        c.setSlug(slug);
        c.setTitle(title);
        c.setDescription(description);
        c.setCategory(category);
        c.setLevel(level);
        c.setDuration(duration);
        c.setStudents(students);
        c.setRating(rating);
        c.setImage(image);
        c.setInstructor(instructor);
        c.setPrice(price);
        return c;
    }

    /**
     * Generates a self-contained SVG cover for a course, writes it into the
     * uploads directory, and returns a HOST-RELATIVE URL. Because the path is
     * relative (/uploads/...), the browser resolves it against whatever origin
     * is serving the app — so it works on localhost, a LAN IP or a real domain.
     */
    private String cover(String slug, String accent) {
        String svg = buildCoverSvg(slug, accent);
        try {
            Path dir = Path.of(uploadDir, "courses");
            Files.createDirectories(dir);
            Files.writeString(dir.resolve(slug + ".svg"), svg, StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.warn("Could not write cover image for {}: {}", slug, e.getMessage());
        }
        // Store the path relative to the uploads dir; CourseService turns this
        // into a host-relative /uploads/... URL when serving the course list.
        return "courses/" + slug + ".svg";
    }

    private String buildCoverSvg(String slug, String accent) {
        String label = slug.replace('-', ' ').toUpperCase();
        return """
            <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%%" stop-color="%s"/>
                  <stop offset="100%%" stop-color="#0c0c0e"/>
                </linearGradient>
              </defs>
              <rect width="1200" height="675" fill="#0c0c0e"/>
              <rect width="1200" height="675" fill="url(#g)" opacity="0.85"/>
              <text x="70" y="360" font-family="monospace" font-size="230" fill="#ffffff" opacity="0.12" font-weight="700">&lt;/&gt;</text>
              <text x="70" y="600" font-family="monospace" font-size="30" fill="#ffffff" opacity="0.85" letter-spacing="4">%s</text>
              <circle cx="1050" cy="150" r="90" fill="#ffffff" opacity="0.08"/>
            </svg>
            """.formatted(accent, xmlEscape(label));
    }

    private String xmlEscape(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private CourseModule module(Course course, String title) {
        CourseModule m = new CourseModule();
        m.setTitle(title);
        m.setCourse(course);
        course.getModules().add(m);
        return m;
    }

    private Lesson lesson(CourseModule module, String title, String slug, String duration, String content, KeyPoint... points) {
        Lesson l = new Lesson();
        l.setTitle(title);
        l.setSlug(slug);
        l.setDuration(duration);
        l.setContent(content);
        l.setModule(module);
        for (KeyPoint p : points) {
            p.setLesson(l);
            l.getKeyPoints().add(p);
        }
        module.getLessons().add(l);
        return l;
    }

    private KeyPoint keyPoint(String point, String explanation) {
        KeyPoint kp = new KeyPoint();
        kp.setPoint(point);
        kp.setExplanation(explanation);
        return kp;
    }

    private Long courseIdBySlug(List<Course> courses, String slug) {
        return courses.stream()
                .filter(c -> slug.equals(c.getSlug()))
                .map(Course::getId)
                .findFirst()
                .orElse(null);
    }

    private Quiz quiz(String title, Long courseId, List<Map<String, Object>> questions) {
        Quiz q = new Quiz();
        q.setTitle(title);
        q.setCourseId(courseId);
        try {
            q.setQuestionsJson(objectMapper.writeValueAsString(questions));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialise quiz questions", e);
        }
        return q;
    }

    /** Quiz question shape expected by QuizService: { question, options[], correct }. */
    private Map<String, Object> mcq(String question, List<String> options, int correct) {
        return Map.of("question", question, "options", options, "correct", correct);
    }

    // ---- resources builders ----




    /** Build a resource MCQ with its options wired up. */

}
