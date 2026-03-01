package takeyouup.example.takeyouup.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static javax.swing.UIManager.get;

@Service
public class ChatBotService {

    private static final String API_KEY = "AIzaSyANL8sqF5bCHMB1nTiTTxhwXsmqf_3j910";

    public String callGemini(String prompt) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + API_KEY;

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, requestBody, Map.class);

        return extractText(response.getBody());
    }

    private String extractText(Map<String, Object> body) {

        if (body == null) return "No response from AI";

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) body.get("candidates");

        if (candidates == null || candidates.isEmpty())
            return "No candidates returned";

        Map<String, Object> firstCandidate = candidates.get(0);

        Map<String, Object> content =
                (Map<String, Object>) firstCandidate.get("content");

        if (content == null) return "No content returned";

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        if (parts == null || parts.isEmpty())
            return "No parts returned";

        return parts.get(0).get("text").toString();
    }
}
