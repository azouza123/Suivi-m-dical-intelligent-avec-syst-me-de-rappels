package com.medical.suivi_medical.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long senderId;
    private String senderName;
    private String senderRole;
    private Long receiverId;
    private String receiverName;
    private String content;
}