package takeyouup.example.takeyouup.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import takeyouup.example.takeyouup.service.FileStorageService;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FileStorageService fileStorageService;

    public WebConfig(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve the uploads root, resolved once by FileStorageService so that a
        // relative *or* absolute file.upload-dir both work.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileStorageService.getRoot().toUri().toString())
                .setCachePeriod(86400);
    }
}
