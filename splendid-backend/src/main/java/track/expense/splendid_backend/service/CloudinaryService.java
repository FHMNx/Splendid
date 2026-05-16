package track.expense.splendid_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, String> uploadBase64Image(String base64Image, String folder) {
        try {
            // Cloudinary accepts base64 directly with data URI prefix
            Map<?, ?> result = cloudinary.uploader().upload(base64Image, ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "image"
            ));

            return Map.of(
                    "url", (String) result.get("secure_url"),
                    "publicId", (String) result.get("public_id")
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }
}