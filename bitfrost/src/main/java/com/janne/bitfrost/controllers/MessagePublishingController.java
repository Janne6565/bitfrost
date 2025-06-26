package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.MessagePublishingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessagePublishingController {

    private final MessagePublishingService messagePublishingService;
    private final AuthService authService;

    @PostMapping("/publish/{projectTag}/{topic}")
    public ResponseEntity<Message> publishMessage(@PathVariable String projectTag, @PathVariable String topic, @RequestBody String message) {
        authService.assertUserHasProjectAccess(projectTag);
        return ResponseEntity.ok(messagePublishingService.publishMessage(projectTag, topic, message));
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messagePublishingService.getAllMessages());
    }

    @GetMapping("/{projectTag}")
    public ResponseEntity<List<Message>> getAllMessagesByProjectTag(@PathVariable String projectTag) {
        return ResponseEntity.ok(messagePublishingService.getMessagesOfProject(projectTag));
    }

    @GetMapping("/{projectTag}/{topicLabel}")
    public ResponseEntity<List<Message>> getAllMessagesByTopicLabel(@PathVariable String projectTag, @PathVariable String topicLabel) {
        return ResponseEntity.ok(messagePublishingService.getMessagesOfTopic(projectTag, topicLabel));
    }
}
