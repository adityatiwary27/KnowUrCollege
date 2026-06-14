package com.example.socialapp.controller;

import com.example.socialapp.model.Post;
import com.example.socialapp.repository.PostRepository;
import com.example.socialapp.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final PostRepository postRepository;
    private final CloudinaryService cloudinaryService;

    public AdminController(PostRepository postRepository, CloudinaryService cloudinaryService) {
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @DeleteMapping("/posts/{id}/image")
    public ResponseEntity<?> deletePostImage(@PathVariable Long id) {
        Post p = postRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        String pub = p.getImagePublicId();
        if (pub == null || pub.isBlank()) return ResponseEntity.badRequest().body("no image for post");
        try {
            cloudinaryService.destroyByPublicId(pub);
            p.setImagePublicId(null);
            p.setImageUrl(null);
            postRepository.save(p);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("failed to delete image: " + e.getMessage());
        }
    }
}
