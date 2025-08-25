package com.janne.bitfrost.models;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Collections;

@Data
@Builder
public class ProjectDto {
    private String projectTag;
    private String description;
    private List<String> topics;
    private boolean hasAccess;

    public static ProjectDto from(Project project) {
        return ProjectDto.builder()
            .topics(Optional.ofNullable(project.getTopics())
                .orElse(Collections.emptyList())
                .stream()
                .map(Topic::getUuid)
                .collect(Collectors.toList()))
            .description(project.getDescription())
            .projectTag(project.getProjectTag())
            .build();
    }
}
