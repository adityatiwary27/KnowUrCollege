package com.example.socialapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SocialAppApplication {
    public static void main(String[] args) {
        var ctx = SpringApplication.run(SocialAppApplication.class, args);
        System.out.println("SocialApp started. Active profiles: " + java.util.Arrays.toString(ctx.getEnvironment().getActiveProfiles()));
    }
}
