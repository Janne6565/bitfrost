package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.User;
import com.janne.bitfrost.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public User createUser(User user) {
        user.setUuid(null);
        user.setPassword(hashPassword(user.getPassword()));
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        return userRepository.save(user);
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
