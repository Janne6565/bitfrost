package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.Message;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class MessageDto {
    private String uuid;
    private String projectTag;
    private String topicId;
    private String message;
    private LocalDateTime date;

    public static MessageDto from(Message message) {
        return MessageDto.builder()
            .uuid(message.getUuid())
            .projectTag(message.getProject().getProjectTag())
            .topicId(message.getTopic().getUuid())
            .message(message.getMessage())
            .date(message.getDate())
            .build();
    }
}
