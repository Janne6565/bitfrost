package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.models.PublicUserDto;
import com.janne.bitfrost.models.UserDto;
import com.janne.bitfrost.services.AuthService;
import com.janne.bitfrost.services.ProjectService;
import com.janne.bitfrost.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final AuthService authService;
    private final ProjectService projectService;

    @GetMapping("/users")
    public ResponseEntity<List<PublicUserDto>> getAllUsers() {
        log.info("UserRoles: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return ResponseEntity.ok(userService.getAllUsers().stream().map(PublicUserDto::from).collect(Collectors.toList()));
    }

    @GetMapping("/users/{uuid}")
    public ResponseEntity<?> getUser(@PathVariable String uuid) {
        User user = userService.getUser(uuid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(user.getRole().equals(User.UserRole.ADMIN) ? UserDto.from(user) : PublicUserDto.from(user));
    }

    @GetMapping("/users/assigned-to/{projectTag}")
    public ResponseEntity<Set<UserDto>> getUserAssignedToProject(@PathVariable String projectTag) {
        authService.assertUserHasProjectAccess(projectTag);
        return ResponseEntity.ok(
            userService.getUserAssignedToProject(
                projectTag
            ).stream().map(UserDto::from).collect(Collectors.toSet())
        );
    }

    @PostMapping("/admin")
    public ResponseEntity<UserDto> createUser(@RequestBody User user) {
        authService.assertAdmin();
        user.setRole(User.UserRole.ADMIN);
        log.info("Creating new ADMIN: {}", user.getEmail());
        return ResponseEntity.ok(userService.createUser(user).toDto());
    }

    @DeleteMapping("/user/{uuid}")
    public ResponseEntity<Void> deleteUser(@PathVariable String uuid) {
        if (!authService.getUser().getRole().equals(User.UserRole.ADMIN)) {
            if (!authService.getUser().getUuid().equals(uuid)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to execute this operation");
            }
        }
        userService.deleteUser(uuid);
        return ResponseEntity.ok().build();
    }
}
