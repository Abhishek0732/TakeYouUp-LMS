package takeyouup.example.takeyouup.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Single owner of everything written to the uploads directory.
 *
 * Paths handed back are always <em>relative to the uploads root</em> (e.g.
 * {@code courses/9f3c….png}) — never absolute and never host-qualified — so the
 * value stored in the database stays portable and the browser resolves the
 * eventual {@code /uploads/…} URL against whatever origin serves the app.
 */
@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    /** Upload caps: anything larger or of another type is rejected with 400. */
    public static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;

    private static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            "image/png", ".png",
            "image/jpeg", ".jpg",
            "image/jpg", ".jpg",
            "image/webp", ".webp",
            "image/gif", ".gif",
            "image/svg+xml", ".svg"
    );

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of(".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg");

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Cloudinary connection string, e.g. {@code cloudinary://key:secret@cloud}.
     * When present, images are stored on Cloudinary (a persistent CDN) instead
     * of the local disk — which on ephemeral hosts (Render free tier, etc.) is
     * wiped on every restart. Blank/unset keeps the local-disk behaviour.
     */
    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    private Path root;

    /** Non-null only when CLOUDINARY_URL is configured. */
    private Cloudinary cloudinary;

    @PostConstruct
    void init() throws IOException {
        Path configured = Paths.get(uploadDir);
        // A relative dir is resolved against the working directory, matching how
        // WebConfig exposes the same folder at /uploads/**.
        this.root = configured.isAbsolute()
                ? configured.normalize()
                : Paths.get(System.getProperty("user.dir")).resolve(configured).normalize();
        Files.createDirectories(root);

        if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
            this.cloudinary = new Cloudinary(cloudinaryUrl.trim());
            log.info("Image storage: Cloudinary (persistent). Local uploads root {} kept as fallback.", root);
        } else {
            log.info("Image storage: local disk at {} (set CLOUDINARY_URL for persistent storage).", root);
        }
    }

    /** Absolute uploads root — used by the static resource handler. */
    public Path getRoot() {
        return root;
    }

    /**
     * Store an uploaded image under {@code <root>/<folder>} and return its path
     * relative to the uploads root.
     *
     * @throws IllegalArgumentException when the file is empty, too large, or not
     *                                  an image type we are willing to serve
     */
    public String storeImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No image file was provided");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("Image is larger than 5 MB");
        }

        String extension = resolveExtension(file);   // also validates the content type

        // Persistent path: upload to Cloudinary and hand back the absolute https
        // URL, which callers store as-is (see publicUrl below).
        if (cloudinary != null) {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "takeyouup/" + folder,
                    "public_id", UUID.randomUUID().toString(),
                    "resource_type", "image",
                    "overwrite", true));
            Object url = result.get("secure_url");
            if (url == null) {
                throw new IOException("Cloudinary upload returned no URL");
            }
            return url.toString();
        }

        // Local-disk fallback: return a path relative to the uploads root.
        Path folderPath = root.resolve(folder).normalize();
        if (!folderPath.startsWith(root)) {
            throw new IllegalArgumentException("Invalid upload folder");
        }
        Files.createDirectories(folderPath);

        String fileName = UUID.randomUUID() + extension;
        try (var in = file.getInputStream()) {
            Files.copy(in, folderPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        }
        return folder + "/" + fileName;
    }

    /**
     * Turn a value returned by {@link #storeImage} into a URL the browser can
     * load. Cloudinary returns an absolute https URL (used as-is); local storage
     * returns a bare {@code folder/file}, which is served under {@code /uploads/}.
     * Values already absolute or root-relative pass through unchanged.
     */
    public static String publicUrl(String stored) {
        if (stored == null || stored.isBlank()) {
            return stored;
        }
        if (stored.startsWith("http://") || stored.startsWith("https://") || stored.startsWith("/")) {
            return stored;
        }
        return "/uploads/" + stored;
    }

    /**
     * Best-effort delete of a previously stored file. Paths outside the uploads
     * root — and values that are really external URLs — are ignored.
     */
    public void deleteQuietly(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) {
            return;
        }
        if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
            return;
        }
        String cleaned = relativePath.startsWith("/uploads/")
                ? relativePath.substring("/uploads/".length())
                : relativePath;
        try {
            Path target = root.resolve(cleaned).normalize();
            if (target.startsWith(root)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException | RuntimeException e) {
            log.warn("Could not delete upload {}: {}", relativePath, e.getMessage());
        }
    }

    private String resolveExtension(MultipartFile file) {
        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase(Locale.ROOT).trim();
        String byType = IMAGE_EXTENSIONS.get(contentType);
        if (byType != null) {
            return byType;
        }
        // Some browsers send application/octet-stream — fall back to the name.
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        int dot = name.lastIndexOf('.');
        String extension = dot >= 0 ? name.substring(dot) : "";
        if (ALLOWED_EXTENSIONS.contains(extension)) {
            return extension.equals(".jpeg") ? ".jpg" : extension;
        }
        throw new IllegalArgumentException("Unsupported image type — use PNG, JPG, WEBP, GIF or SVG");
    }
}
