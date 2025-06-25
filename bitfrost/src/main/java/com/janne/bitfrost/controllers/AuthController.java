package com.janne.bitfrost.controllers;

import com.janne.bitfrost.dtos.LoginDto;
import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.services.JwtService;
import com.janne.bitfrost.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setRole(User.UserRole.DEVELOPER);
        log.info("Creating new User: {}", user.getEmail());
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/login")
    public ResponseEntity<String> getUserByLogin(@RequestBody LoginDto loginDto) {
        User user = userService.loginUser(loginDto.email(), loginDto.password());
        return ResponseEntity.ok(jwtService.generateToken(Map.of(), user.getUuid(), JwtService.TokenType.REFRESH_TOKEN, user.getRole()));
    }

    @GetMapping("/token")
    public ResponseEntity<String> getUserByToken(@RequestBody String refreshToken) {
        String uuid = Optional.ofNullable(jwtService.parseJwt(refreshToken, JwtService.TokenType.REFRESH_TOKEN).getSubject()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        User user = userService.getUser(uuid).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return ResponseEntity.ok(
            jwtService.generateToken(
                Map.of("email", user.getEmail()),
                uuid,
                JwtService.TokenType.IDENTITY_TOKEN,
                user.getRole()
            ));
    }
}
