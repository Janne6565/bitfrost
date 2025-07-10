package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.repositories.ProjectRepository;
import com.janne.bitfrost.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
    private final ProjectRepository projectRepository;

    @EventListener(ApplicationReadyEvent.class)
    private void instantiateAdmin() {
        String password = RandomStringUtils.randomAlphanumeric(10);
        log.info("Created admin account with credentials [Email: {}, Password: {}]", "admin@admin.de", password);
        try {
            createUser(User.builder()
                .name("Admin")
                .email("admin@admin.de")
                .password(password)
                .role(User.UserRole.ADMIN)
                .build());
        } catch (ResponseStatusException e) {
            log.info("Admin account already instantiated");
        }
    }

    public User createUser(User user) {
        user.setUuid(null);
        user.setPassword(hashPassword(user.getPassword()));
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (!user.getEmail().matches(emailRegex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email");
        }
        return userRepository.save(user);
    }

    public Set<User> getUserAssignedToProject(String projectTag) {
        return projectRepository.getProjectByProjectTag(projectTag)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"))
            .getAssignedUsers();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUser(String uuid) {
        return userRepository.findById(uuid);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return user;
    }

    public User deleteUser(String uuid) {
        Optional<User> user = userRepository.findById(uuid);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return user.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }

    private String hashPassword(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

    private boolean validatePassword(String password, String hash) {
        return bCryptPasswordEncoder.matches(password, hash);
    }
}
