package takeyouup.example.takeyouup.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Refuses to start a production deployment that is still using the development
 * defaults committed to this repository.
 *
 * Those defaults exist so `docker compose up` works with no setup, which is
 * genuinely useful locally — but the JWT secret is in public source control, so
 * anyone who can read the repo could mint an admin token against a server still
 * using it. Failing at boot is the only reliable way to stop that reaching a
 * public URL; a warning in the log would simply be missed.
 *
 * Set APP_ENV=production to arm the check.
 */
@Configuration
public class ProductionSecretsCheck {

    private static final Logger log = LoggerFactory.getLogger(ProductionSecretsCheck.class);

    /** Must match the fallbacks in application.properties. */
    private static final String DEFAULT_JWT_SECRET =
            "takeyouupsecretkeytakeyouupsecretkeytakeyouupsecretkeytakeyouupsecretkey";
    private static final String DEFAULT_GEMINI_KEY = "AIzaSyANL8sqF5bCHMB1nTiTTxhwXsmqf_3j910";

    private static final int MIN_SECRET_LENGTH = 32;

    @Value("${app.env:development}")
    private String environment;

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${spring.ai.google.genai.api-key:}")
    private String geminiKey;

    @Value("${spring.jpa.hibernate.ddl-auto:validate}")
    private String ddlAuto;

    @PostConstruct
    void verify() {
        boolean production = "production".equalsIgnoreCase(environment.trim());
        List<String> problems = new ArrayList<>();

        if (DEFAULT_JWT_SECRET.equals(jwtSecret)) {
            problems.add("JWT_SECRET is still the value committed to the repository. "
                    + "Anyone with the source can forge tokens, including admin ones. "
                    + "Set a random value of at least " + MIN_SECRET_LENGTH + " characters.");
        } else if (jwtSecret == null || jwtSecret.length() < MIN_SECRET_LENGTH) {
            problems.add("JWT_SECRET is shorter than " + MIN_SECRET_LENGTH
                    + " characters, which is too short for HS256.");
        }

        if (DEFAULT_GEMINI_KEY.equals(geminiKey)) {
            problems.add("GEMINI_API_KEY is the committed demo key. Set your own, "
                    + "and revoke the committed one.");
        }

        if ("update".equalsIgnoreCase(ddlAuto) || "create".equalsIgnoreCase(ddlAuto)
                || "create-drop".equalsIgnoreCase(ddlAuto)) {
            problems.add("spring.jpa.hibernate.ddl-auto=" + ddlAuto
                    + " lets Hibernate rewrite the schema behind Flyway. Use 'validate'.");
        }

        if (problems.isEmpty()) {
            if (production) {
                log.info("Production secret check passed.");
            }
            return;
        }

        String detail = String.join("\n  - ", problems);
        if (production) {
            throw new IllegalStateException(
                    "Refusing to start with development defaults while APP_ENV=production:\n  - "
                            + detail);
        }
        log.warn("Development defaults in use (fine locally, but these must be replaced "
                + "before deploying):\n  - {}", detail);
    }
}
