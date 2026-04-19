package com.medical.suivi_medical.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    private String id;

    private Long senderId;
    private String senderName;
    private String senderRole;

    private Long receiverId;
    private String receiverName;

    private String conversationId;

    // Text content (null if file message)
    private String content;

    // File fields (null if text message)
    private String fileUrl;        // URL to download the file
    private String fileName;       // original file name
    private String fileType;       // MIME type e.g. "image/png", "application/pdf"
    private Long fileSize;         // size in bytes
    private String messageType;    // "TEXT" or "FILE"

    private boolean read;
    private LocalDateTime timestamp;
}