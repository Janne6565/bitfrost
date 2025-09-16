package com.janne.bitfrost.controllers;

import com.janne.bitfrost.models.MessageDto;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.MessagePublishingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessagePublishingService messagePublishingService;
    private final AuthService authService;

    @PostMapping("/publish/{projectTag}/{topic}")
    public ResponseEntity<MessageDto> publishMessage(@PathVariable String projectTag, @PathVariable String topic, @RequestBody String message) {
        authService.assertApplicationAccessOnProject(projectTag);
        return ResponseEntity.ok(messagePublishingService.publishMessage(projectTag, topic, message).toDto());
    }

    @GetMapping
    public ResponseEntity<List<MessageDto>> getAllMessages() {
        return ResponseEntity.ok(
            messagePublishingService.getAccessibleMessages(authService.getUser())
                .stream()
                .map(MessageDto::from)
                .toList()
        );
    }

    @GetMapping("/{projectTag}")
    public ResponseEntity<List<MessageDto>> getAllMessagesByProjectTag(@PathVariable String projectTag) {
        authService.assertUserHasProjectReadAccess(projectTag);
        return ResponseEntity.ok(
            messagePublishingService.getAccessibleMessages(authService.getUser())
                .stream()
                .filter(message -> message.getProject().getProjectTag().equals(projectTag))
                .map(MessageDto::from)
                .toList());
    }

    @GetMapping("/{projectTag}/{topicLabel}")
    public ResponseEntity<List<MessageDto>> getAllMessagesByTopicLabel(@PathVariable String projectTag, @PathVariable String topicLabel) {
        authService.assertUserHasTopicAccess(projectTag, topicLabel);
        return ResponseEntity.ok(messagePublishingService.getMessagesOfTopic(projectTag, topicLabel).stream().map(MessageDto::from).toList());
    }
}
