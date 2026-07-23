package takeyouup.example.takeyouup.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())   // ✅ FIXED
                .authorizeHttpRequests(auth -> auth
                        // --- Public ---
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/courses/basic",
                                // Published-content counts only; see StatsController.
                                "/api/stats",
                                // Crawlers fetch this without credentials.
                                "/sitemap.xml",
                                "/api/certificates/verify/**",
                                "/uploads/**",
                                "/actuator/health",
                                "/actuator/health/**",
                                "/error"
                        ).permitAll()

                        // --- Public browsing of the resource catalogue ---
                        // Categories and their topic lists are readable by
                        // anyone: visitors can see what is on offer before
                        // signing up. These DTOs carry titles, concepts and
                        // question COUNTS only — never the questions or
                        // answers, which stay behind /api/resources/topics/**.
                        // Scoped to GET so creating or editing a category is
                        // still admin-only (the blanket rules further down).
                        .requestMatchers(HttpMethod.GET, "/api/resources/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/resources/categories/*").permitAll()

                        // --- Public course overview ---
                        // Syllabus only: module and lesson TITLES, never lesson
                        // bodies or key points — see CourseOverviewDTO, which has
                        // no field capable of carrying them. Lesson content stays
                        // behind /api/courses/slug/** for signed-in users.
                        // Scoped to GET; creating and editing courses remains
                        // admin-only via the blanket rules further down.
                        .requestMatchers(HttpMethod.GET, "/api/courses/overview/*").permitAll()

                        // --- Public code execution ---
                        // The compiler page works signed out, and a Run button
                        // on a lesson snippet should not be what forces a login.
                        // Abuse control is the per-IP limit in ExecuteController
                        // plus the result cache in CodeExecutionService.
                        .requestMatchers(HttpMethod.POST, "/api/execute").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/execute/languages").permitAll()

                        // --- Public contact form ---
                        // Requiring an account here turned away the one visitor
                        // most worth hearing from: someone with a question they
                        // want answered before signing up. Safe to open because
                        // ContactController takes a DTO with no id field (a
                        // client-supplied id used to overwrite an existing
                        // message), validates every field, rate-limits by IP and
                        // carries a honeypot.
                        .requestMatchers(HttpMethod.POST, "/api/contacts").permitAll()

                        // --- Writes that a normal logged-in USER may perform ---
                        .requestMatchers(HttpMethod.POST,
                                "/api/chatbot/generate",
                                "/api/quizzes/attempts").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/progress/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/certificates/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/update-name").authenticated()
                        // Changing your own password is a PUT, so it must be
                        // allowed before the blanket admin-only PUT rule below.
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/password").authenticated()

                        // --- Admin-only user management (listing exposes accounts) ---
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")

                        // --- Editable site copy ---
                        // The admin listing goes FIRST: it returns inactive rows
                        // too, which are drafts the public has no business seeing.
                        // Without this it would fall through to
                        // anyRequest().authenticated() and any signed-in user
                        // could read them.
                        .requestMatchers(HttpMethod.GET, "/api/content/admin/**").hasRole("ADMIN")
                        // The public read is what every marketing page calls on
                        // first paint, so it must work signed out.
                        .requestMatchers(HttpMethod.GET, "/api/content").permitAll()

                        // --- Community blog ---
                        // Order matters, most specific first:
                        //  1. Moderation is staff-only, every verb. This must
                        //     come before the /me and public rules or a broader
                        //     match would let a non-admin reach it.
                        .requestMatchers("/api/blog/admin/**").hasRole("ADMIN")
                        //  2. An author managing THEIR OWN posts. Any signed-in
                        //     user, any verb — placed ahead of the blanket
                        //     "POST/PUT/DELETE to /api/** is admin-only" rules
                        //     below, which would otherwise block a USER from
                        //     writing. Ownership itself is checked in the service.
                        .requestMatchers("/api/blog/me/**").authenticated()
                        //  3. The reader's view: topics and published posts are
                        //     public, so the blog is findable without an account
                        //     (the whole point — same reasoning as course
                        //     overviews). Scoped to GET; the writer/admin verbs
                        //     are already handled above.
                        .requestMatchers(HttpMethod.GET, "/api/blog/topics").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog/posts").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog/posts/*").permitAll()

                        // --- All other content mutations are ADMIN-only ---
                        .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

                        // --- Everything else (reads) just needs authentication ---
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        // 401 = "your token is missing or expired" — the client
                        // refreshes and retries. 403 = "you are signed in but not
                        // allowed", which no refresh can fix.
                        .authenticationEntryPoint((req, res, e) ->
                                writeError(res, HttpServletResponse.SC_UNAUTHORIZED,
                                        "Unauthorized", "Authentication required or token expired", req))
                        .accessDeniedHandler((req, res, e) ->
                                writeError(res, HttpServletResponse.SC_FORBIDDEN,
                                        "Forbidden", "You do not have permission to perform this action", req))
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** Same JSON shape GlobalExceptionHandler uses, so clients parse one format. */
    private static void writeError(HttpServletResponse response, int status, String error,
                                   String message, HttpServletRequest request) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}",
                Instant.now(), status, error, message, request.getRequestURI()));
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}