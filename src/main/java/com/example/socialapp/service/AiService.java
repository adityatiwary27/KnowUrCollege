package com.example.socialapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AiService {

    private final String apiKey;
    private final RestTemplate restTemplate;

    public AiService(@Value("${gemini.api.key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
    }

    public Map<String, String> generateCaption(MultipartFile image) throws Exception {
        if (apiKey == null || apiKey.isBlank()) {
            throw new Exception("Gemini API key is not configured. Please add gemini.api.key to your application.properties.");
        }
        if (image == null || image.isEmpty()) {
            throw new Exception("Image is required to generate a caption.");
        }

        String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
        String mimeType = image.getContentType();
        if (mimeType == null || !mimeType.startsWith("image/")) {
            mimeType = "image/jpeg";
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey;

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mimeType", mimeType);
        inlineData.put("data", base64Image);

        Map<String, Object> imagePart = new HashMap<>();
        imagePart.put("inlineData", inlineData);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", "You are a social media expert analyzing a photo taken on a college campus. Generate a catchy social media caption, up to 5 relevant hashtags, and guess the specific campus location (e.g., 'Library', 'Cafeteria', 'Quad', 'Classroom'). Return ONLY a raw JSON object with three keys: 'caption' (string), 'hashtags' (string), and 'location' (string). Do not wrap the response in markdown blocks.");

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Arrays.asList(textPart, imagePart));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", Arrays.asList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new Exception("Failed to call Gemini API");
        }

        try {
            Map body = response.getBody();
            List candidates = (List) body.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map contentResp = (Map) firstCandidate.get("content");
            List parts = (List) contentResp.get("parts");
            Map firstPart = (Map) parts.get(0);
            String text = (String) firstPart.get("text");

            text = text.trim();
            if (text.startsWith("```json")) text = text.substring(7);
            if (text.startsWith("```")) text = text.substring(3);
            if (text.endsWith("```")) text = text.substring(0, text.length() - 3);
            text = text.trim();

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(text, Map.class);
        } catch (Exception e) {
            throw new Exception("Failed to parse Gemini API response: " + e.getMessage());
        }
    }
}
