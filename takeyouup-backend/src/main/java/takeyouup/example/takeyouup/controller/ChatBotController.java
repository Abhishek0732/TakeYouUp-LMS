package takeyouup.example.takeyouup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.service.ChatBotService;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin
public class ChatBotController {

    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {
        String userMessage = body.get("message");

        String systemPrompt = """
        You are a chatbot for my website.
        Only answer about Java Programming Mastery course.
        If question is outside scope, politely refuse.
    """;

        String finalPrompt = systemPrompt + "\nUser: " + userMessage;

        System.out.println("Final Prompt: " + finalPrompt);

        String response = chatBotService.callGemini(finalPrompt);

        return ResponseEntity.ok(response);
    }
}
