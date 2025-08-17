package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.Message;
import com.janne.bitfrost.entities.Subscription;
import com.janne.bitfrost.entities.Topic;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
public class TopicDto {
    private String uuid;
    private String label;
    private String description;
    private String project;
    private List<String> subscriptions;
    private List<String> messages;

    public static TopicDto from(Topic topic) {
        return TopicDto.builder()
            .uuid(topic.getUuid())
            .label(topic.getLabel())
            .description(topic.getDescription())
            .project(topic.getProject().getProjectTag())
            .subscriptions(topic.getSubscriptions().stream().map(Subscription::getUuid).collect(Collectors.toList()))
            .messages(topic.getMessages().stream().map(Message::getUuid).collect(Collectors.toList()))
            .build();
    }
}
