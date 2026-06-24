package com.example.socialapp.service;

import com.example.socialapp.model.Post;
import com.example.socialapp.repository.PostRepository;
import com.example.socialapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public PostService(PostRepository postRepository, UserRepository userRepository, CloudinaryService cloudinaryService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public Post create(Post post) {
        if (post.getUser() != null && post.getUser().getId() != null) {
            Long uid = post.getUser().getId();
            userRepository.findById(uid).ifPresent(post::setUser);
        }
        return postRepository.save(post);
    }

    public Post createWithImage(Post post, MultipartFile image, CloudinaryService unusedCloudinaryService) throws IOException {
        if (post.getUser() != null && post.getUser().getId() != null) {
            Long uid = post.getUser().getId();
            userRepository.findById(uid).ifPresent(post::setUser);
        }
        if (image != null && !image.isEmpty()) {
            java.util.Map<String, String> upload = this.cloudinaryService.upload(image);
            if (upload.containsKey("url")) post.setImageUrl(upload.get("url"));
            if (upload.containsKey("public_id")) post.setImagePublicId(upload.get("public_id"));
        }
        return postRepository.save(post);
    }

    public List<Post> list() {
        return postRepository.findAll();
    }

    public Post get(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public List<Post> findByUser(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Post update(Long id, Post updated) {
        return postRepository.findById(id).map(p -> {
            if (updated.getContent() != null) p.setContent(updated.getContent());
            if (updated.getLocation() != null) p.setLocation(updated.getLocation());
            return postRepository.save(p);
        }).orElse(null);
    }

    public void delete(Long id) {
        postRepository.findById(id).ifPresent(p -> {
            if (p.getImagePublicId() != null) {
                try {
                    this.cloudinaryService.destroyByPublicId(p.getImagePublicId());
                } catch (IOException e) {
                    // Log or ignore delete error
                }
            }
            postRepository.deleteById(id);
        });
    }
}
