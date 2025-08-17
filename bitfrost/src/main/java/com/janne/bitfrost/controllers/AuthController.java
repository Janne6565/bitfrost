package com.janne.bitfrost.controllers;

import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.models.UserDto;
import com.janne.bitfrost.services.JwtService;
import com.janne.bitfrost.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/user")
    public ResponseEntity<UserDto> createUser(@RequestBody User user) {
        user.setRole(User.UserRole.DEVELOPER);
        log.info("Creating new User: {}", user.getEmail());
        return ResponseEntity.ok(userService.createUser(user).toDto());
    }

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        User user = userService.loginUser(email, password);
        String jwt = jwtService.generateToken(Map.of(), user.getUuid(), JwtService.TokenType.REFRESH_TOKEN, user.getRole());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwt)
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(jwtService.getJwtRefreshValidityDuration() / 1000)
            .build();
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
            .body("Success");
    }

    @GetMapping("/token")
    public ResponseEntity<String> getIdentityToken(@CookieValue(name = "refreshToken") String refreshToken) {
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

    @DeleteMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie resetCookie = ResponseCookie.from("refreshToken")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)
            .build();
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, resetCookie.toString())
            .body("Success");
    }
}
