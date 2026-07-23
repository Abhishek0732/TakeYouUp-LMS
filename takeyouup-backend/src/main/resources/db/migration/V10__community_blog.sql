-- V10: Community blog.
--
-- Topic-categorised posts that any signed-in user can write, but which the
-- public only ever sees once an admin has approved them. Two tables:
--   blog_topics — the admin-curated categories a post is filed under
--   blog_posts  — the posts themselves, carrying their own moderation trail
--
-- Ids are BINARY(16) UUIDs to match the resource_* tables (Hibernate
-- GenerationType.UUID). Author/reviewer are BIGINT FKs into users, whose id is
-- BIGINT AUTO_INCREMENT. Seed data (starter topics + one sample post) lives in
-- BlogSeeder, not here, for the same reason V9's copy does: a migration runs
-- once, so anything seeded here could never reach an already-migrated database.

-- ---------------------------------------------------------------- blog_topics
CREATE TABLE blog_topics (
    id          BINARY(16)   NOT NULL,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  DATETIME(6)  DEFAULT NULL,
    updated_at  DATETIME(6)  DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_blog_topics_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------- blog_posts
CREATE TABLE blog_posts (
    id                BINARY(16)   NOT NULL,
    title             VARCHAR(255) NOT NULL,
    slug              VARCHAR(255) NOT NULL,
    excerpt           TEXT         NULL,
    content           LONGTEXT     NULL,
    cover_image_url   VARCHAR(512) NULL,
    topic_id          BINARY(16)   NOT NULL,
    author_id         BIGINT       NOT NULL,
    -- DRAFT / PENDING / PUBLISHED / REJECTED — see enums/PostStatus.
    status            VARCHAR(20)  NOT NULL,
    rejection_reason  TEXT         NULL,
    reviewed_by       BIGINT       NULL,
    reviewed_at       DATETIME(6)  DEFAULT NULL,
    published_at      DATETIME(6)  DEFAULT NULL,
    read_minutes      INT          NOT NULL DEFAULT 0,
    created_at        DATETIME(6)  DEFAULT NULL,
    updated_at        DATETIME(6)  DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_blog_posts_slug (slug),
    -- The public listing: "published posts, newest first", optionally filtered
    -- by topic. Covering the topic keeps the by-topic page off a table scan.
    KEY idx_blog_posts_status_published (status, published_at),
    KEY idx_blog_posts_topic (topic_id),
    -- The author dashboard and the pending-per-author cap both look up by author.
    KEY idx_blog_posts_author (author_id),
    CONSTRAINT fk_blog_posts_topic    FOREIGN KEY (topic_id)    REFERENCES blog_topics (id),
    CONSTRAINT fk_blog_posts_author   FOREIGN KEY (author_id)   REFERENCES users (id),
    CONSTRAINT fk_blog_posts_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
