package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.MessageDTO;
import com.medical.suivi_medical.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    private final Path uploadDir = Paths.get("uploads/chat");

    // GET /chat/{otherUserId} — get conversation history
    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable Long otherUserId,
            HttpServletRequest request) {
        Long myId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(chatService.getConversation(myId, otherUserId));
    }

    // PUT /chat/{senderId}/read — mark as read
    @PutMapping("/{senderId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long senderId,
            HttpServletRequest request) {
        Long myId = (Long) request.getAttribute("userId");
        chatService.markAsRead(myId, senderId);
        return ResponseEntity.ok().build();
    }

    // GET /chat/unread/count
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> countUnread(HttpServletRequest request) {
        Long myId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(Map.of("count", chatService.countUnread(myId)));
    }

    // POST /chat/upload — upload a file and send as message
    @PostMapping("/upload")
    public ResponseEntity<MessageDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("receiverId") Long receiverId,
            @RequestParam("receiverName") String receiverName,
            @RequestParam("senderName") String senderName,
            @RequestParam("senderRole") String senderRole,
            HttpServletRequest request) throws IOException {

        Long senderId = (Long) request.getAttribute("userId");

        // Create upload directory if not exists
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID() + extension;

        // Save file to disk
        Path filePath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // File URL accessible by frontend
        String fileUrl = "/chat/files/" + uniqueFilename;

        // Save file message to MongoDB
        MessageDTO saved = chatService.saveFileMessage(
                senderId, senderName, senderRole,
                receiverId, receiverName,
                fileUrl, originalFilename,
                file.getContentType(), file.getSize()
        );

        // Broadcast via WebSocket
        Long id1 = Math.min(senderId, receiverId);
        Long id2 = Math.max(senderId, receiverId);
        String topic = "/topic/chat." + id1 + "." + id2;
        messagingTemplate.convertAndSend(topic, saved);

        return ResponseEntity.ok(saved);
    }

    // GET /chat/files/{filename} — download/view a file
    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException ignored) {}

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}