package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(Project project) {
        if (!project.projectTag.matches("[a-z\\-A-Z0-9]*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project tag is invalid");
        }
        if (projectRepository.existsById(project.projectTag)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project tag already exists");
        }
        if (project.topics.stream().map(Topic::getLabel).distinct().count() != project.topics.size()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic Labels are not unique");
        }
        return projectRepository.save(project);
    }

    public Project addTopic(String projectTag, Topic topic) {
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        if (project.topics.stream().map(Topic::getLabel).anyMatch(label -> label.equals(topic.getLabel()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic Labels are not unique");
        }
        return projectRepository.save(project);
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
