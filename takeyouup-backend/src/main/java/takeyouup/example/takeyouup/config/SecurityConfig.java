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

                        // --- Writes that a normal logged-in USER may perform ---
                        .requestMatchers(HttpMethod.POST,
                                "/api/contacts",
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