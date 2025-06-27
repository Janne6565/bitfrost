package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.models.MessageDto;
import com.janne.bitfrost.models.ProjectDto;
import com.janne.bitfrost.models.TopicDto;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<Set<ProjectDto>> getProjects() {
        return ResponseEntity.ok(projectService.findAll().stream().map(ProjectDto::from).collect(Collectors.toSet()));
    }

    @GetMapping("/topics")
    public ResponseEntity<Set<TopicDto>> getTopics() {
        return ResponseEntity.ok(projectService.findAll().stream().map(Project::getTopics).flatMap(Collection::stream).map(TopicDto::from).collect(Collectors.toSet()));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody Project project) {
        Project buildProject = projectService.createProject(project);
        projectService.assignUserToProject(authService.getUser().getUuid(), buildProject.getProjectTag());
        return ResponseEntity.ok(buildProject.toDto());
    }

    @PostMapping("/{projectTag}/topic")
    public ResponseEntity<ProjectDto> createTopic(@PathVariable String projectTag, @RequestBody Topic topic) {
        return ResponseEntity.ok(projectService.addTopic(projectTag, topic).toDto());
    }

    @GetMapping("/{projectTag}/{topicLabel}/messages")
    public ResponseEntity<Set<MessageDto>> getTopicMessages(@PathVariable String projectTag, @PathVariable String topicLabel) {
        authService.assertUserHasTopicAccess(projectTag, topicLabel);
        return ResponseEntity.ok(projectService.getProjectTopic(projectTag, topicLabel).getMessages().stream().map(MessageDto::from).collect(Collectors.toSet()));
    }

    @DeleteMapping("/{projectTag}/topic/{labelId}")
    public ResponseEntity<ProjectDto> deleteTopic(@PathVariable String projectTag, @PathVariable String labelId) {
        authService.assertUserHasProjectAccess(projectTag);
        return ResponseEntity.ok(projectService.removeTopic(projectTag, labelId).toDto());
    }

    @GetMapping("/owned")
    public ResponseEntity<Set<ProjectDto>> getOwnedProjects() {
        if (authService.getUser().getRole().equals(User.UserRole.ADMIN)) {
            return getProjects();
        }
        return ResponseEntity.ok(authService.getUser().getAssignedProjects().stream().toList().stream().map(ProjectDto::from).collect(Collectors.toSet()));
    }

    @DeleteMapping("/{projectTag}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectTag) {
        authService.assertUserHasProjectAccess(projectTag);
        projectService.deleteProject(projectTag);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/allow/{projectTag}")
    public ResponseEntity<Void> allowAccess(@PathVariable String projectTag, @RequestParam String userId) {
        authService.assertUserHasProjectAccess(projectTag);
        projectService.assignUserToProject(userId, projectTag);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/revoke/{projectTag}")
    public ResponseEntity<Void> revokeAccess(@PathVariable String projectTag, @RequestParam String userId) {
        authService.assertUserHasProjectAccess(projectTag);
        projectService.revokeUserFromProject(userId, projectTag);
        return ResponseEntity.ok().build();
    }
}
