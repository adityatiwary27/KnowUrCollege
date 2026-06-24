package com.example.socialapp.controller;

import com.example.socialapp.model.User;
import com.example.socialapp.service.UserService;
import com.example.socialapp.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String identifier = body.get("identifier");
        if (identifier == null) {
            identifier = body.get("username");
            if (identifier == null) identifier = body.get("email");
        }
        String password = body.get("password");
        if (identifier == null || password == null) return ResponseEntity.badRequest().body("username/email and password required");
        User u = userService.authenticate(identifier, password);
        if (u == null) return ResponseEntity.status(401).body("invalid credentials");
        String token = jwtUtil.generateToken(u.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
