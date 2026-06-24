package com.example.socialapp.service;

import com.example.socialapp.model.User;
import com.example.socialapp.repository.UserRepository;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import java.util.Arrays;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final Argon2 argon2 = Argon2Factory.create();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new IllegalArgumentException("username is required");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("email is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("password is required");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("email already exists");
        }

        String raw = user.getPassword();
        if (raw.length() > 1024) {
            throw new IllegalArgumentException("password is too long");
        }
        char[] passwordChars = raw.toCharArray();
        String hashed = argon2.hash(2, 65536, 1, passwordChars);
        Arrays.fill(passwordChars, '\0');
        user.setPassword(hashed);
        return userRepository.save(user);
    }

    public List<User> list() {
        return userRepository.findAll();
    }

    public User get(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User update(Long id, User updated) {
        return userRepository.findById(id).map(u -> {
            u.setUsername(updated.getUsername());
            u.setEmail(updated.getEmail());
            u.setBio(updated.getBio());
            return userRepository.save(u);
        }).orElse(null);
    }

    public User authenticate(String identifier, String password) {
        User u = userRepository.findByUsername(identifier).orElse(null);
        if (u == null) {
            u = userRepository.findByEmail(identifier).orElse(null);
        }
        if (u == null) return null;

        String hashed = u.getPassword();
        if (hashed == null || hashed.isBlank()) return null;
        char[] pwd = password.toCharArray();
        try {
            if (argon2.verify(hashed, pwd)) {
                return u;
            }
            return null;
        } finally {
            java.util.Arrays.fill(pwd, '\0');
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void followUser(Long followerId, Long targetId) {
        User follower = userRepository.findById(followerId).orElse(null);
        User target = userRepository.findById(targetId).orElse(null);
        if (follower != null && target != null && !follower.getId().equals(target.getId())) {
            follower.getFollowing().add(target);
            userRepository.save(follower);
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void unfollowUser(Long followerId, Long targetId) {
        User follower = userRepository.findById(followerId).orElse(null);
        User target = userRepository.findById(targetId).orElse(null);
        if (follower != null && target != null) {
            follower.getFollowing().remove(target);
            userRepository.save(follower);
        }
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
