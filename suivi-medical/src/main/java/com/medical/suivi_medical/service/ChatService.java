package com.medical.suivi_medical.service;

import com.medical.suivi_medical.document.Message;
import com.medical.suivi_medical.dto.MessageDTO;
import com.medical.suivi_medical.dto.SendMessageRequest;
import com.medical.suivi_medical.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;

    public String buildConversationId(Long id1, Long id2) {
        return Math.min(id1, id2) + "_" + Math.max(id1, id2);
    }

    // Save a text message
    public MessageDTO saveMessage(SendMessageRequest req) {
        String conversationId = buildConversationId(req.getSenderId(), req.getReceiverId());

        Message message = Message.builder()
                .senderId(req.getSenderId())
                .senderName(req.getSenderName())
                .senderRole(req.getSenderRole())
                .receiverId(req.getReceiverId())
                .receiverName(req.getReceiverName())
                .conversationId(conversationId)
                .content(req.getContent())
                .messageType("TEXT")
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        return toDTO(messageRepository.save(message));
    }

    // Save a file message
    public MessageDTO saveFileMessage(
            Long senderId, String senderName, String senderRole,
            Long receiverId, String receiverName,
            String fileUrl, String fileName, String fileType, Long fileSize) {

        String conversationId = buildConversationId(senderId, receiverId);

        Message message = Message.builder()
                .senderId(senderId)
                .senderName(senderName)
                .senderRole(senderRole)
                .receiverId(receiverId)
                .receiverName(receiverName)
                .conversationId(conversationId)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .fileSize(fileSize)
                .messageType("FILE")
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        return toDTO(messageRepository.save(message));
    }

    // Get conversation history
    public List<MessageDTO> getConversation(Long userId1, Long userId2) {
        String conversationId = buildConversationId(userId1, userId2);
        return messageRepository
                .findByConversationIdOrderByTimestampAsc(conversationId)
                .stream()
                .filter(m -> m != null)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Mark messages as read
    public void markAsRead(Long receiverId, Long senderId) {
        String conversationId = buildConversationId(receiverId, senderId);
        List<Message> messages = messageRepository
                .findByConversationIdOrderByTimestampAsc(conversationId);
        messages.stream()
                .filter(m -> m.getReceiverId().equals(receiverId) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    messageRepository.save(m);
                });
    }

    // Count unread
    public long countUnread(Long userId) {
        return messageRepository.countByReceiverIdAndReadFalse(userId);
    }

    private MessageDTO toDTO(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setSenderId(m.getSenderId());
        dto.setSenderName(m.getSenderName());
        dto.setSenderRole(m.getSenderRole());
        dto.setReceiverId(m.getReceiverId());
        dto.setReceiverName(m.getReceiverName());
        dto.setConversationId(m.getConversationId());
        dto.setContent(m.getContent());
        dto.setFileUrl(m.getFileUrl());
        dto.setFileName(m.getFileName());
        dto.setFileType(m.getFileType());
        dto.setFileSize(m.getFileSize());
        dto.setMessageType(m.getMessageType() != null ? m.getMessageType() : "TEXT");
        dto.setRead(m.isRead());
        dto.setTimestamp(m.getTimestamp());
        return dto;
    }
}