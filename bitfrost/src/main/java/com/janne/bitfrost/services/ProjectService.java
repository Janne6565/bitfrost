package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.repositories.ProjectRepository;
import com.janne.bitfrost.repositories.UserRepository;
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
    private final UserRepository userRepository;

    public Project createProject(Project project) {
        if (!project.getProjectTag().matches("[a-z\\-A-Z0-9]*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project tag is invalid");
        }
        if (projectRepository.existsById(project.getProjectTag())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Project tag already exists");
        }
        if (project.getTopics().stream().map(Topic::getLabel).distinct().count() != project.getTopics().size()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic Labels are not unique");
        }
        return projectRepository.save(project);
    }

    public Project addTopic(String projectTag, Topic topic) {
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        if (project.getTopics().stream().map(Topic::getLabel).anyMatch(label -> label.equals(topic.getLabel()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic Labels are not unique");
        }
        return projectRepository.save(project);
    }

    public void assignUserToProject(String userUuid, String projectTag) {
        User user = userRepository.findById(userUuid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        assignUserToProject(user, project);
    }

    public void revokeUserFromProject(String userUuid, String projectTag) {
        User user = userRepository.findById(userUuid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        revokeUserFromProject(user, project);
    }

    private void assignUserToProject(User user, Project project) {
        user.getAssignedProjects().add(project);
        project.getAssignedUsers().add(user);
        userRepository.save(user);
        projectRepository.save(project);
    }

    private void revokeUserFromProject(User user, Project project) {
        user.getAssignedProjects().remove(project);
        project.getAssignedUsers().remove(user);
        userRepository.save(user);
        projectRepository.save(project);
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public void deleteProject(String id) {
        Project project =  projectRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        project.getAssignedUsers().forEach(u -> u.getAssignedProjects().remove(project));
        userRepository.saveAll(project.getAssignedUsers());
        projectRepository.delete(project);
    }
}
