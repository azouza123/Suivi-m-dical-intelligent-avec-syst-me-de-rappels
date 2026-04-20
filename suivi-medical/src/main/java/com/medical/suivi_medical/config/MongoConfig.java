package com.medical.suivi_medical.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        String host = System.getenv("SPRING_DATA_MONGODB_HOST") != null 
            ? System.getenv("SPRING_DATA_MONGODB_HOST") : "localhost";
        String port = System.getenv("SPRING_DATA_MONGODB_PORT") != null 
            ? System.getenv("SPRING_DATA_MONGODB_PORT") : "27017";
        String database = System.getenv("SPRING_DATA_MONGODB_DATABASE") != null 
            ? System.getenv("SPRING_DATA_MONGODB_DATABASE") : "suivi_medical_chat";
        
        String uri = "mongodb://" + host + ":" + port + "/" + database;
        System.out.println("=== Connecting to MongoDB: " + uri + " ===");
        return MongoClients.create(uri);
    }
}