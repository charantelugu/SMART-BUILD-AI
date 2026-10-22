package com.smartbuild.controller;

import com.smartbuild.dto.ChatMessageRequest;
import com.smartbuild.dto.ChatMessageResponse;
import com.smartbuild.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIChatController {

    private final AIService aiService;

    public AIChatController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatMessageResponse> chatWithAI(@RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = aiService.processChat(request);
        return ResponseEntity.ok(response);
    }
}
