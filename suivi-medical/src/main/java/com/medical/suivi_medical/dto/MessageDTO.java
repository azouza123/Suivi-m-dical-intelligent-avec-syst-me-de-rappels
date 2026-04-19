package com.medical.suivi_medical.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private String id;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private Long receiverId;
    private String receiverName;
    private String conversationId;
    private String content;

    // File fields
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String messageType; // "TEXT" or "FILE"

    private boolean read;
    private LocalDateTime timestamp;
}