package takeyouup.example.takeyouup.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.resources.ResourceCategory;
import takeyouup.example.takeyouup.repository.CourseRepository;
import takeyouup.example.takeyouup.repository.resources.ResourceCategoryRepository;
import takeyouup.example.takeyouup.service.blog.BlogService;
import takeyouup.example.takeyouup.util.RequestOrigin;

import java.util.List;

/**
 * Generated sitemap for search engines.
 *
 * Served from the backend rather than shipped as a static file so it reflects
 * what is actually published — a checked-in sitemap.xml goes stale the moment a
 * resource category is added. Before this existed, /sitemap.xml fell through
 * nginx's SPA rewrite and returned the HTML app with a 200, so a crawler asking
 * for the sitemap got a web page claiming to be one.
 *
 * The host comes from the request, so the URLs are right on whatever domain the
 * site is served from — the same approach used for emailed links.
 *
 * Course overview pages are listed now that they render publicly. Individual
 * LESSON URLs still are not: those need an account, so a crawler following one
 * would land on the sign-in page.
 */
@RestController
public class SitemapController {

    /** Public, crawlable routes with no dynamic segment. */
    private static final String[][] STATIC_PATHS = {
            // path, changefreq, priority
            {"/",                 "weekly",  "1.0"},
            {"/courses",          "weekly",  "0.9"},
            {"/blog",             "daily",   "0.8"},
            {"/resources",        "weekly",  "0.8"},
            {"/online-compiler",  "monthly", "0.7"},
            {"/about",            "monthly", "0.5"},
            {"/contact",          "monthly", "0.4"},
    };

    @Autowired
    private ResourceCategoryRepository resourceCategoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BlogService blogService;

    @Value("${app.frontend-url:http://localhost:5174}")
    private String fallbackOrigin;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap(HttpServletRequest request) {
        String origin = RequestOrigin.resolve(request, fallbackOrigin);

        StringBuilder xml = new StringBuilder(1024);
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
           .append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        for (String[] entry : STATIC_PATHS) {
            append(xml, origin + entry[0], entry[1], entry[2]);
        }

        // Course overviews — the pages a search result should actually land on.
        for (Course course : courseRepository.findAll()) {
            if (course.getSlug() != null && !course.getSlug().isBlank()) {
                append(xml, origin + "/" + course.getSlug(), "weekly", "0.9");
            }
        }

        // Published blog posts — public, admin-approved, and exactly the kind of
        // fresh content a crawler should keep coming back for.
        for (String slug : blogService.getPublishedSlugs()) {
            if (slug != null && !slug.isBlank()) {
                append(xml, origin + "/blog/" + slug, "monthly", "0.6");
            }
        }

        // Resource categories are genuinely public — SecurityConfig permits GET
        // on /api/resources/categories and the pages render without an account.
        List<ResourceCategory> categories = resourceCategoryRepository.findAll();
        for (ResourceCategory category : categories) {
            if (category.getSlug() != null && !category.getSlug().isBlank()) {
                append(xml, origin + "/resources/" + category.getSlug(), "weekly", "0.7");
            }
        }

        xml.append("</urlset>\n");

        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=3600")
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    private static void append(StringBuilder xml, String loc, String changefreq, String priority) {
        xml.append("  <url>\n")
           .append("    <loc>").append(escape(loc)).append("</loc>\n")
           .append("    <changefreq>").append(changefreq).append("</changefreq>\n")
           .append("    <priority>").append(priority).append("</priority>\n")
           .append("  </url>\n");
    }

    /** Slugs are author-controlled, so escape rather than trust them in XML. */
    private static String escape(String value) {
        return value.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&apos;");
    }
}
