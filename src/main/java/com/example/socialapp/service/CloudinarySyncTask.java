package com.example.socialapp.service;

import com.example.socialapp.model.Post;
import com.example.socialapp.repository.PostRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CloudinarySyncTask {
    private final PostRepository postRepository;
    private final CloudinaryService cloudinaryService;

    public CloudinarySyncTask(PostRepository postRepository, CloudinaryService cloudinaryService) {
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // Run every 15 seconds to aggressively sync missing Cloudinary images
    @Scheduled(fixedDelay = 15000)
    public void syncDeletedImages() {
        List<Post> posts = postRepository.findAll();
        for (Post p : posts) {
            if (p.getImagePublicId() != null && !p.getImagePublicId().isBlank()) {
                if (!cloudinaryService.exists(p.getImagePublicId())) {
                    System.out.println("SyncTask: Deleting post " + p.getId() + " because image missing from Cloudinary.");
                    postRepository.delete(p);
                }
            }
        }
    }
}
