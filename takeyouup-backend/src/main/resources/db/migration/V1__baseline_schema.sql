-- =============================================================================
-- V1 — Baseline schema for the TakeYouUp LMS.
-- Mirrors the JPA entity mappings exactly so `spring.jpa.hibernate.ddl-auto`
-- can run in `validate` mode. Tables are created in foreign-key dependency
-- order. Charset/collation and column types match Hibernate's MySQL output.
-- =============================================================================

-- ---------------------------------------------------------------- users
CREATE TABLE users (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    email    VARCHAR(255) DEFAULT NULL,
    name     VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    role     ENUM('ADMIN','USER') DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- course
CREATE TABLE course (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    category    VARCHAR(255)  DEFAULT NULL,
    course_id   VARCHAR(255)  DEFAULT NULL,
    description VARCHAR(2000) DEFAULT NULL,
    duration    VARCHAR(255)  DEFAULT NULL,
    image       VARCHAR(255)  DEFAULT NULL,
    instructor  VARCHAR(255)  DEFAULT NULL,
    level       VARCHAR(255)  DEFAULT NULL,
    price       VARCHAR(255)  DEFAULT NULL,
    rating      DOUBLE        NOT NULL,
    slug        VARCHAR(255)  DEFAULT NULL,
    students    INT           NOT NULL,
    title       VARCHAR(255)  DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- modules
CREATE TABLE modules (
    id        BIGINT NOT NULL AUTO_INCREMENT,
    title     VARCHAR(255) DEFAULT NULL,
    course_id BIGINT       DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_modules_course (course_id),
    CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES course (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- lesson
CREATE TABLE lesson (
    id        BIGINT NOT NULL AUTO_INCREMENT,
    content   VARCHAR(5000) DEFAULT NULL,
    duration  VARCHAR(255)  DEFAULT NULL,
    slug      VARCHAR(255)  DEFAULT NULL,
    title     VARCHAR(255)  DEFAULT NULL,
    module_id BIGINT        DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_lesson_module (module_id),
    CONSTRAINT fk_lesson_module FOREIGN KEY (module_id) REFERENCES modules (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- key_point
CREATE TABLE key_point (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    explanation VARCHAR(5000) DEFAULT NULL,
    point       VARCHAR(255)  DEFAULT NULL,
    lesson_id   BIGINT        DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_key_point_lesson (lesson_id),
    CONSTRAINT fk_key_point_lesson FOREIGN KEY (lesson_id) REFERENCES lesson (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- topics (DSA)
CREATE TABLE topics (
    id   BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- platforms (DSA)
CREATE TABLE platforms (
    id   BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- difficulties (DSA)
CREATE TABLE difficulties (
    id    BIGINT NOT NULL AUTO_INCREMENT,
    level VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- questions (DSA)
CREATE TABLE questions (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    created_at    DATETIME(6)  DEFAULT NULL,
    title         VARCHAR(255) DEFAULT NULL,
    url           VARCHAR(255) DEFAULT NULL,
    difficulty_id BIGINT       DEFAULT NULL,
    platform_id   BIGINT       DEFAULT NULL,
    topic_id      BIGINT       NOT NULL,
    PRIMARY KEY (id),
    KEY idx_questions_difficulty (difficulty_id),
    KEY idx_questions_platform (platform_id),
    KEY idx_questions_topic (topic_id),
    CONSTRAINT fk_questions_topic      FOREIGN KEY (topic_id)      REFERENCES topics (id),
    CONSTRAINT fk_questions_platform   FOREIGN KEY (platform_id)   REFERENCES platforms (id),
    CONSTRAINT fk_questions_difficulty FOREIGN KEY (difficulty_id) REFERENCES difficulties (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- quiz
CREATE TABLE quiz (
    id             BIGINT NOT NULL AUTO_INCREMENT,
    course_id      BIGINT       DEFAULT NULL,
    questions_json JSON         DEFAULT NULL,
    title          VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- contact_message
CREATE TABLE contact_message (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6)   DEFAULT NULL,
    email      VARCHAR(255)  DEFAULT NULL,
    message    VARCHAR(5000) DEFAULT NULL,
    name       VARCHAR(255)  DEFAULT NULL,
    subject    VARCHAR(255)  DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- user_progress
CREATE TABLE user_progress (
    id        BIGINT NOT NULL AUTO_INCREMENT,
    completed BIT(1)       NOT NULL,
    item_id   VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    user_id   BIGINT       NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_progress_item (user_id, item_type, item_id),
    CONSTRAINT fk_user_progress_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- resource_categories
CREATE TABLE resource_categories (
    id          BINARY(16)   NOT NULL,
    accent      VARCHAR(255) DEFAULT NULL,
    created_at  DATETIME(6)  DEFAULT NULL,
    description TEXT,
    hero_text   TEXT,
    short_title VARCHAR(255) DEFAULT NULL,
    slug        VARCHAR(255) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    updated_at  DATETIME(6)  DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_resource_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- resource_topics
CREATE TABLE resource_topics (
    id          BINARY(16)   NOT NULL,
    created_at  DATETIME(6)  DEFAULT NULL,
    difficulty  VARCHAR(255) DEFAULT NULL,
    duration    VARCHAR(255) DEFAULT NULL,
    slug        VARCHAR(255) NOT NULL,
    sort_order  INT          NOT NULL,
    summary     TEXT,
    title       VARCHAR(255) NOT NULL,
    updated_at  DATETIME(6)  DEFAULT NULL,
    category_id BINARY(16)   NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_resource_topics_slug_category (slug, category_id),
    KEY idx_resource_topics_category (category_id),
    CONSTRAINT fk_resource_topics_category FOREIGN KEY (category_id) REFERENCES resource_categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- topic_concepts
CREATE TABLE topic_concepts (
    id         BINARY(16)   NOT NULL,
    name       VARCHAR(255) NOT NULL,
    sort_order INT          NOT NULL,
    topic_id   BINARY(16)   NOT NULL,
    PRIMARY KEY (id),
    KEY idx_topic_concepts_topic (topic_id),
    CONSTRAINT fk_topic_concepts_topic FOREIGN KEY (topic_id) REFERENCES resource_topics (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- mcq_questions
CREATE TABLE mcq_questions (
    id                   BINARY(16) NOT NULL,
    correct_answer_index INT        NOT NULL,
    created_at           DATETIME(6) DEFAULT NULL,
    explanation          TEXT,
    question_text        TEXT       NOT NULL,
    sort_order           INT        NOT NULL,
    updated_at           DATETIME(6) DEFAULT NULL,
    topic_id             BINARY(16) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_mcq_questions_topic (topic_id),
    CONSTRAINT fk_mcq_questions_topic FOREIGN KEY (topic_id) REFERENCES resource_topics (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- question_options
CREATE TABLE question_options (
    id           BINARY(16) NOT NULL,
    option_index INT        NOT NULL,
    option_text  TEXT       NOT NULL,
    question_id  BINARY(16) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_question_options_question (question_id),
    CONSTRAINT fk_question_options_question FOREIGN KEY (question_id) REFERENCES mcq_questions (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
