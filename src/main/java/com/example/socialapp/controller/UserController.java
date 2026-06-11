package com.example.socialapp.controller;

import com.example.socialapp.model.User;
import com.example.socialapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        return ResponseEntity.ok(userService.create(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> list() {
        return ResponseEntity.ok(userService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        User u = userService.get(id);
        return u == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        User u = userService.update(id, user);
        return u == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
