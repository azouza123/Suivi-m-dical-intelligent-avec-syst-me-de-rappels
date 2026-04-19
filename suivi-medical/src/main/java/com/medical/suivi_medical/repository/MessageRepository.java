package com.medical.suivi_medical.repository;

import com.medical.suivi_medical.document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    // Get all messages for a conversation ordered by time
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);

    // Count unread messages for a user
    long countByReceiverIdAndReadFalse(Long receiverId);

    // Get unread messages for a user
    List<Message> findByReceiverIdAndReadFalse(Long receiverId);
}