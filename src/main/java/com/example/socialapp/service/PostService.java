package com.example.socialapp.service;

import com.example.socialapp.model.Post;
import com.example.socialapp.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post create(Post post) {
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
            p.setContent(updated.getContent());
            return postRepository.save(p);
        }).orElse(null);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}
