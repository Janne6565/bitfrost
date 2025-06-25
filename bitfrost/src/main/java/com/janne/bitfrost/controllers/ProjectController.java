package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @PostMapping("/{projectId}/topic")
    public ResponseEntity<Project> createTopic(@PathVariable String projectId, @RequestBody Topic topic) {
        return ResponseEntity.ok(projectService.addTopic(projectId, topic));
    }

    @DeleteMapping("/{projectTag}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectTag) {
        projectService.deleteProject(projectTag);
        return ResponseEntity.ok().build();
    }
}
