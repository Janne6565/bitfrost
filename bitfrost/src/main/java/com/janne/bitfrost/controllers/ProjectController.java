package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project buildProject = projectService.createProject(project);
        projectService.assignUserToProject(authService.getUser().getUuid(), buildProject.getProjectTag());
        return ResponseEntity.ok(buildProject);
    }

    @PostMapping("/{projectTag}/topic")
    public ResponseEntity<Project> createTopic(@PathVariable String projectTag, @RequestBody Topic topic) {
        authService.assertUserHasProjectAccess(projectTag);
        return ResponseEntity.ok(projectService.addTopic(projectTag, topic));
    }

    @DeleteMapping("/{projectTag}/topic/{labelId}")
    public ResponseEntity<Project> deleteTopic(@PathVariable String projectTag, @PathVariable String labelId) {
        authService.assertUserHasProjectAccess(projectTag);
        return ResponseEntity.ok(projectService.removeTopic(projectTag, labelId));
    }

    @GetMapping("/owned")
    public ResponseEntity<List<Project>> getOwnedProjects() {
        return ResponseEntity.ok(authService.getUser().getAssignedProjects().stream().toList());
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
