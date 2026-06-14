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

    public CloudinaryService() {
        // Expect CLOUDINARY_URL env var (e.g. cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
        String url = System.getenv("CLOUDINARY_URL");
        if (url != null && !url.isBlank()) {
            this.cloudinary = new Cloudinary(url);
        } else {
            this.cloudinary = new Cloudinary(ObjectUtils.emptyMap());
        }
    }

    public java.util.Map<String, String> upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return java.util.Collections.emptyMap();
        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        Object url = uploadResult.get("secure_url");
        Object publicId = uploadResult.get("public_id");
        java.util.Map<String, String> result = new java.util.HashMap<>();
        if (url != null) result.put("url", url.toString());
        if (publicId != null) result.put("public_id", publicId.toString());
        return result;
    }

    public java.util.Map destroyByPublicId(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) return java.util.Collections.emptyMap();
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
