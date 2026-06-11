package com.example.socialapp.controller;

import com.example.socialapp.model.Post;
import com.example.socialapp.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post) {
        return ResponseEntity.ok(postService.create(post));
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
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post post) {
        Post p = postService.update(id, post);
        return p == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
