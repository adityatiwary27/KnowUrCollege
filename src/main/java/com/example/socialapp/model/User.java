package com.example.socialapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String username;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String email;

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String bio;

    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Post> posts = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "user_following",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> following = new java.util.HashSet<>();

    @ManyToMany(mappedBy = "following")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> followers = new java.util.HashSet<>();

    public User() {
    }

    public User(Long id, String username, String email, String password, String bio, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public java.util.Set<User> getFollowing() {
        return following;
    }

    public void setFollowing(java.util.Set<User> following) {
        this.following = following;
    }

    public java.util.Set<User> getFollowers() {
        return followers;
    }

    public void setFollowers(java.util.Set<User> followers) {
        this.followers = followers;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("followerCount")
    public int getFollowerCount() {
        return followers != null ? followers.size() : 0;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("followingCount")
    public int getFollowingCount() {
        return following != null ? following.size() : 0;
    }
}
