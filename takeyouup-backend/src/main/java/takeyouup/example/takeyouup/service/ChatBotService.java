package takeyouup.example.takeyouup.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatBotService {

    private final ChatClient chatClient;

    public ChatBotService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String generateContent(String userPrompt) {
        String systemPrompt = """
        You are an AI assistant for the TakeYouUp website.
        
        IMPORTANT RULES:
        1. Answer ONLY using the provided website content below.
        2. Do NOT use external knowledge.
        3. If the answer is not present in the website content, respond with:
           "This information is not available on the TakeYouUp website."
        4. Keep responses concise and clear (maximum 3-4 sentences).
        5. Do not make assumptions or generate additional information.
        
        WEBSITE CONTENT:
        
        Home:
        Welcome to TakeYouUp! We offer comprehensive programming courses for all.
        
        Courses:
        We offer a wide range of programming courses including Java, Python, JavaScript, and more.
        Each course provides hands-on experience and real-world projects to enhance learning.
        
        About Us:
        TakeYouUp is passionate about empowering individuals to achieve their programming goals.
        Our experienced instructors provide high-quality education and student support.
        
        TakeYouUp is a platform for learning programming.
        It supports beginners starting their coding journey and experienced developers expanding their skills.
        Join us to take your programming skills to the next level.
        """;

         return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}
