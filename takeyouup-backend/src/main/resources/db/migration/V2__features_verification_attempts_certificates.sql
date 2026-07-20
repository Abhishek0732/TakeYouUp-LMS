-- =============================================================================
-- V2 — Email verification, quiz attempts, and certificates.
-- =============================================================================

-- ---- Email verification flag on users -------------------------------------
ALTER TABLE users
    ADD COLUMN email_verified BIT(1) NOT NULL DEFAULT b'0';

-- Existing accounts (seed/admin) are treated as already verified.
UPDATE users SET email_verified = b'1';

-- ---- Email verification tokens --------------------------------------------
CREATE TABLE email_verification_tokens (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    token      VARCHAR(255) NOT NULL,
    user_id    BIGINT       NOT NULL,
    expires_at DATETIME(6)  NOT NULL,
    used       BIT(1)       NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_email_verification_token (token),
    KEY idx_email_verification_user (user_id),
    CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---- Quiz attempts (persisted scores) -------------------------------------
CREATE TABLE quiz_attempts (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    user_id    BIGINT      NOT NULL,
    quiz_id    BIGINT      NOT NULL,
    score      INT         NOT NULL,
    total      INT         NOT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_quiz_attempts_user (user_id),
    KEY idx_quiz_attempts_quiz (quiz_id),
    CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quiz (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---- Certificates (issued on course completion) ---------------------------
CREATE TABLE certificates (
    id        BINARY(16)   NOT NULL,
    serial_no VARCHAR(255) NOT NULL,
    user_id   BIGINT       NOT NULL,
    course_id BIGINT       NOT NULL,
    issued_at DATETIME(6)  DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_certificates_serial (serial_no),
    UNIQUE KEY uk_certificates_user_course (user_id, course_id),
    KEY idx_certificates_user (user_id),
    KEY idx_certificates_course (course_id),
    CONSTRAINT fk_certificates_user   FOREIGN KEY (user_id)   REFERENCES users (id),
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES course (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
