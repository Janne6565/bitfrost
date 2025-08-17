package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final ProjectService projectService;

    public User getUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUser(userId).orElseThrow(() -> new UsernameNotFoundException(userId));
    }

    public void assertUserHasProjectAccess(String projectTag) {
        if (getUser().getRole().equals(User.UserRole.ADMIN)) {
            return;
        }
        getUser().getAssignedProjects().stream().filter(project -> project.getProjectTag().equals(projectTag)).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You dont have access to that project"));
    }

    public void assertUserHasProjectAccess(List<String> projects) {
        if (getUser().getRole().equals(User.UserRole.ADMIN)) {
            return;
        }
        getUser().getAssignedProjects().stream().filter(project -> projects.stream()
                .anyMatch(p -> p.equals(project.getProjectTag()))).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You dont have access to that project"));
    }

    public void assertUserHasProjectReadAccess(String projectTag) {
        if (getUser().getRole().equals(User.UserRole.ADMIN)) {
            return;
        }
        projectService.getAllAllowedProjects(getUser())
            .stream()
            .filter(project -> project.getProjectTag().equals(projectTag))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You dont have access to that project"));
    }

    public void assertUserHasTopicAccess(String projectTag, String topicLabel) {
        if (getUser().getRole().equals(User.UserRole.ADMIN)) {
            return;
        }
        projectService.getAllAllowedTopics(getUser()).stream()
            .filter(topic -> topic.getProject().getProjectTag().equals(projectTag)
                && topic.getLabel().equals(topicLabel)).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You dont have access to that topic"));
    }

    public void assertAdmin() {
        if (!getUser().getRole().equals(User.UserRole.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to execute this operation");
        }
    }

}
