package com.example.socialapp.service;

import com.example.socialapp.model.User;
import com.example.socialapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public List<User> list() {
        return userRepository.findAll();
    }

    public User get(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User update(Long id, User updated) {
        return userRepository.findById(id).map(u -> {
            u.setUsername(updated.getUsername());
            u.setEmail(updated.getEmail());
            u.setBio(updated.getBio());
            return userRepository.save(u);
        }).orElse(null);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
