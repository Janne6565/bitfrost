package com.janne.bitfrost.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.repositories.MessageRepository;
import com.janne.bitfrost.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessagePublishingService {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;
    private final MessageRepository messageRepository;
    private final JobService jobService;

    @SneakyThrows
    public Message publishMessage(String projectTag, String topicLabel, String message) {
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        Topic topic = project.getTopics().stream().filter(p -> p.getLabel().equals(topicLabel)).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        Message buildMessage = Message.builder()
            .message(message)
            .project(project)
            .topic(topic)
            .date(LocalDateTime.now())
            .build();
        Message sendMessage = messageRepository.save(buildMessage);
        topic.getMessages().add(sendMessage);
        projectRepository.save(project);
        jobService.scheduleMessage(sendMessage);
        log.info("Message Published: {}", sendMessage);
        return sendMessage;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesOfProject(String projectTag) {
        return messageRepository.findAllByProjectId(projectTag);
    }

    public List<Message> getMessagesOfTopic(String projectTag, String topicLabel) {
        return messageRepository.findAllByProjectIdAndTopicLabel(projectTag, topicLabel);
    }
}
