package takeyouup.example.takeyouup.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatBotService {

    private final ChatClient chatClient;
    private final SiteKnowledgeService siteKnowledgeService;

    public ChatBotService(ChatClient chatClient, SiteKnowledgeService siteKnowledgeService) {
        this.chatClient = chatClient;
        this.siteKnowledgeService = siteKnowledgeService;
    }

    public String generateContent(String userPrompt) {
        String systemPrompt = """
        You are the AI assistant for the TakeYouUp website — a friendly guide that
        helps visitors and students understand the site and use its features.

        HOW TO ANSWER:
        1. Answer using the KNOWLEDGE below, which describes what TakeYouUp offers
           and how the site works. It reflects the current, live site.
        2. Cover anything about TakeYouUp: its courses, coding practice, quizzes,
           certificates, blog, resources, team, accounts, and how to do things on
           the site. Use the live lists to give real, specific answers (e.g. name
           actual courses or topics when asked).
        3. If someone asks something NOT related to TakeYouUp (for example a general
           programming question, homework, or an unrelated topic), politely say you
           can only help with questions about the TakeYouUp website, and point them
           to the most relevant page or feature if there is one.
        4. If the specific detail they want is not in the knowledge below, say you
           do not have that information yet and suggest where on the site they might
           find it (e.g. the Courses page or the Contact page) — do not invent it.
        5. Be warm, concise and clear. Use a short list when it helps. Do not make up
           courses, prices, features, dates, or people that are not in the knowledge.

        KNOWLEDGE:
        %s
        """.formatted(siteKnowledgeService.getKnowledge());

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}
