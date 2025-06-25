package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
}
