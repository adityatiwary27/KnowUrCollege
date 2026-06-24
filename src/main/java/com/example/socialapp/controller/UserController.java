package com.example.socialapp.controller;

import com.example.socialapp.model.User;
import com.example.socialapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.security.Principal;

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

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        User created = userService.registerUser(user);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<User>> list() {
        return ResponseEntity.ok(userService.list());
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User u = userService.getByUsername(principal.getName());
        return u == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        User u = userService.get(id);
        return u == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User user, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        if (currentUser == null || !currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).body("Unauthorized to edit this profile");
        }
        User u = userService.update(id, user);
        return u == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(u);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        if (currentUser == null) return ResponseEntity.status(401).build();
        
        userService.followUser(currentUser.getId(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        if (currentUser == null) return ResponseEntity.status(401).build();
        
        userService.unfollowUser(currentUser.getId(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/following")
    public ResponseEntity<List<Long>> getMyFollowing(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        if (currentUser == null) return ResponseEntity.status(401).build();
        
        List<Long> followingIds = currentUser.getFollowing().stream()
            .map(User::getId)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(followingIds);
    }
}
