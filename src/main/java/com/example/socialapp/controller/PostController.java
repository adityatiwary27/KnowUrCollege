package com.example.socialapp.controller;

import com.example.socialapp.model.Post;
import com.example.socialapp.service.CloudinaryService;
import com.example.socialapp.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.example.socialapp.model.User;
import com.example.socialapp.service.UserService;
import java.security.Principal;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final CloudinaryService cloudinaryService;
    private final UserService userService;
    private final com.example.socialapp.service.AiService aiService;

    public PostController(PostService postService, CloudinaryService cloudinaryService, UserService userService, com.example.socialapp.service.AiService aiService) {
        this.postService = postService;
        this.cloudinaryService = cloudinaryService;
        this.userService = userService;
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Post post, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User u = userService.getByUsername(principal.getName());
        if (u != null) post.setUser(u);
        return ResponseEntity.ok(postService.create(post));
    }

    // Multipart endpoint: accepts a JSON `post` part and an optional `image` file part.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createWithImage(@RequestPart(value = "post") String postJson,
                                             @RequestPart(value = "image", required = false) MultipartFile image,
                                             Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            ObjectMapper mapper = new ObjectMapper();
            Post post = mapper.readValue(postJson, Post.class);
            User u = userService.getByUsername(principal.getName());
            if (u != null) post.setUser(u);
            Post saved = postService.createWithImage(post, image, cloudinaryService);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create post: " + e.getMessage());
        }
    }

    @PostMapping(value = "/generate-caption", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generateCaption(@RequestPart(value = "image") MultipartFile image, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            java.util.Map<String, String> response = aiService.generateCaption(image);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> list() {
        return ResponseEntity.ok(postService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> get(@PathVariable Long id) {
        Post p = postService.get(id);
        return p == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(p);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> byUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.findByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Post post, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        Post existing = postService.get(id);
        if (existing == null) return ResponseEntity.notFound().build();
        if (!existing.getUser().getId().equals(currentUser.getId())) return ResponseEntity.status(403).body(java.util.Map.of("error", "Unauthorized to edit this post"));
        
        Post p = postService.update(id, post);
        return p == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        User currentUser = userService.getByUsername(principal.getName());
        Post existing = postService.get(id);
        if (existing == null) return ResponseEntity.notFound().build();
        if (!existing.getUser().getId().equals(currentUser.getId())) return ResponseEntity.status(403).body(java.util.Map.of("error", "Unauthorized to delete this post"));
        
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
