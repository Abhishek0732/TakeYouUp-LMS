package takeyouup.example.takeyouup.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.dsa.Question;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;

/**
 * Gemini-backed study helper for the DSA practice problems.
 *
 * A practice {@link Question} is only a link to an external problem — it has no
 * stored statement, so the model works from the problem's title, topic and
 * difficulty. That is enough for the well-known LeetCode/GFG problems the
 * catalogue points at; for an obscure title the prompts tell the model to say
 * so rather than invent a different problem.
 *
 * Reuses the shared {@link ChatClient} bean (Google Gemini via Spring AI, keyed
 * by GEMINI_API_KEY) — the same one the site chatbot uses. Two entry points:
 * {@link #hint} deliberately withholds a full solution so it stays a learning
 * aid, and {@link #solution} gives the complete worked answer.
 */
@Service
public class ProblemAiService {

    private final ChatClient chatClient;
    private final QuestionRepository questionRepository;

    public ProblemAiService(ChatClient chatClient, QuestionRepository questionRepository) {
        this.chatClient = chatClient;
        this.questionRepository = questionRepository;
    }

    private static final String HINT_SYSTEM = """
        You are a friendly coding-interview tutor on the TakeYouUp learning platform.
        A learner is stuck on a well-known coding practice problem and wants a HINT —
        not the answer. You are given only the problem's title, topic and difficulty.

        Produce Markdown with short sections and bullet points:
        1. Restate what the problem asks in one or two sentences, so they can confirm
           they understood it correctly.
        2. Name the key concept or pattern that unlocks it (e.g. hash map, two pointers,
           sliding window, DFS) and why it fits.
        3. Give 2-4 progressive hints as separate bullets, from a gentle nudge to a
           stronger steer.
        4. State the time and space complexity they should aim for.

        Hard rules:
        - DO NOT write the full solution or complete code. At most one tiny illustrative
          snippet of a single idea (like which data structure to reach for) is allowed.
        - Be encouraging and concise.
        - If the title is too ambiguous to identify the exact problem, say so briefly and
          give the most likely interpretation instead of guessing wildly.
        """;

    private static final String SOLUTION_SYSTEM = """
        You are a clear, patient coding tutor on the TakeYouUp learning platform.
        Provide a complete worked solution to a well-known coding practice problem,
        identified only by its title, topic and difficulty.

        Produce Markdown in this order:
        1. A one-line summary of the problem.
        2. The core idea / approach in plain language.
        3. A short step-by-step walkthrough.
        4. A complete, correct, idiomatic solution inside a fenced ```java code block
           (Java is the platform's primary language) with brief comments.
        5. The time and space complexity.

        Keep explanations tight and educational. If the title is ambiguous or you cannot
        confidently identify the exact problem, say so and solve the most likely
        interpretation rather than inventing an unrelated problem.
        """;

    /** Concepts + progressive hints, no full solution. */
    public String hint(Long questionId) {
        return generate(HINT_SYSTEM, questionId, "Give me a hint for this problem.");
    }

    /** Full worked solution with code. */
    public String solution(Long questionId) {
        return generate(SOLUTION_SYSTEM, questionId, "Explain and solve this problem.");
    }

    private String generate(String systemPrompt, Long questionId, String ask) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + questionId));

        // topic is NOT NULL on the entity; platform and difficulty are optional.
        String topic = q.getTopic() != null ? q.getTopic().getName() : "General";
        String difficulty = q.getDifficulty() != null ? q.getDifficulty().getLevel() : "Unspecified";
        String platform = q.getPlatform() != null ? q.getPlatform().getName() : "a coding platform";

        String userPrompt = """
            Problem title: %s
            Topic: %s
            Difficulty: %s
            Source platform: %s

            %s
            """.formatted(q.getTitle(), topic, difficulty, platform, ask);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}
