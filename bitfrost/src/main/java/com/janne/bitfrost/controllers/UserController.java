package com.janne.bitfrost.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janne.bitfrost.dtos.UserDto;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.services.JwtService;
import com.janne.bitfrost.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final JwtService jwtService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("UserRoles: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{uuid}")
    public ResponseEntity<UserDto> getUser(@PathVariable String uuid) {
        return ResponseEntity.ok(objectMapper.convertValue(
            userService.getUser(uuid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")),
            UserDto.class));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setRole(User.UserRole.ADMIN);
        log.info("Creating new ADMIN: {}", user.getEmail());
        return ResponseEntity.ok(userService.createUser(user));
    }

    @DeleteMapping("/user/{uuid}")
    public ResponseEntity<Void> deleteUser(@PathVariable String uuid) {
        userService.deleteUser(uuid);
        return ResponseEntity.accepted().build();
    }
}
