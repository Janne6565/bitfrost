package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.Project;
import com.janne.bitfrost.entities.Topic;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final TopicRepository topicRepository;
    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;

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

    public Topic getProjectTopic(String projectLabel, String topicLabel) {
        Project project = projectRepository.findById(projectLabel).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        return project.getTopics().stream().filter(t -> t.getLabel().equals(topicLabel)).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
    }

    public Project addTopic(String projectTag, Topic topic) {
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        if (project.getTopics().stream().map(Topic::getLabel).anyMatch(label -> label.equals(topic.getLabel()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Topic Labels are not unique");
        }
        project.getTopics().add(topic);
        return projectRepository.save(project);
    }

    public Project removeTopic(String projectTag, String topic) {
        Project project = projectRepository.findById(projectTag).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        project.getTopics().removeIf(t -> t.getLabel().equals(topic));
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

    public Optional<Project> getProjectByTag(String id) {
        return projectRepository.findById(id);
    }

    @Transactional
    public void deleteProject(String id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project Not Found"));
        project.getAssignedUsers().forEach(u -> u.getAssignedProjects().remove(project));
        userRepository.saveAll(project.getAssignedUsers());
        subscriptionRepository.findAllByRequestingProject(project).forEach(subscription -> subscriptionService.revokeAccessRequest(subscription.getUuid()));
        subscriptionRepository.findAllByRequestedProject(project).forEach(subscription -> subscriptionService.revokeAccessRequest(subscription.getUuid()));
        projectRepository.delete(project);
    }

}
