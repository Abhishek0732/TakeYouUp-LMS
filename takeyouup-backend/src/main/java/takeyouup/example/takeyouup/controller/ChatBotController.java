package takeyouup.example.takeyouup.controller;

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

    @PostMapping("/generate")
    public String generate(@RequestBody Map<String, String> request) {
        return chatBotService.generateContent(request.get("prompt"));
    }
}
