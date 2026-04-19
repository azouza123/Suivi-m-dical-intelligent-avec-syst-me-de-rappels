package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.MessageDTO;
import com.medical.suivi_medical.dto.SendMessageRequest;
import com.medical.suivi_medical.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request) {
        // Save to MongoDB
        MessageDTO saved = chatService.saveMessage(request);

        // Build a unique conversation topic that both users subscribe to
        // Use sorted IDs so both sides use the same topic
        Long id1 = Math.min(request.getSenderId(), request.getReceiverId());
        Long id2 = Math.max(request.getSenderId(), request.getReceiverId());
        String topic = "/topic/chat." + id1 + "." + id2;

        System.out.println(">>> Broadcasting message to topic: " + topic);

        // Broadcast to the shared conversation topic
        // Both doctor and patient subscribe to this same topic
        messagingTemplate.convertAndSend(topic, saved);
    }
}