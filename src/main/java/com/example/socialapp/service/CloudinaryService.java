package com.example.socialapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;
    private final boolean enabled;

    public CloudinaryService(@org.springframework.beans.factory.annotation.Value("${app.cloudinary.url:}") String propertyUrl) {
        String url = propertyUrl;
        if (url != null && !url.isBlank()) {
            String cleanUrl = url.replace("cloudinary://", "");
            String[] parts = cleanUrl.split("@");
            String cloudName = parts[1];
            String[] credentials = parts[0].split(":");
            this.cloudinary = new Cloudinary(com.cloudinary.utils.ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", credentials[0],
                "api_secret", credentials[1]
            ));
            this.enabled = true;
        } else {
            this.cloudinary = new Cloudinary(ObjectUtils.emptyMap());
            this.enabled = false;
        }
    }

    public java.util.Map<String, String> upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return java.util.Collections.emptyMap();
        
        if (enabled) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            Object url = uploadResult.get("secure_url");
            Object publicId = uploadResult.get("public_id");
            java.util.Map<String, String> result = new java.util.HashMap<>();
            if (url != null) result.put("url", url.toString());
            if (publicId != null) result.put("public_id", publicId.toString());
            return result;
        } else {
            // Fallback to local storage in frontend/public/uploads
            String uploadDir = "frontend/public/uploads/";
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + filename);
            java.nio.file.Files.write(path, file.getBytes());
            
            java.util.Map<String, String> result = new java.util.HashMap<>();
            result.put("url", "/uploads/" + filename);
            return result;
        }
    }

    public java.util.Map destroyByPublicId(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank() || !enabled) return java.util.Collections.emptyMap();
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public boolean exists(String publicId) {
        if (publicId == null || publicId.isBlank() || !enabled) return true;
        try {
            cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            return true;
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Not found")) {
                return false;
            }
            return true;
        }
    }
}
