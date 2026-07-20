-- =============================================================================
-- V3 — Indexes on the columns used by finders / filters, so lookups stay fast
-- as the tables grow. (Foreign-key columns are already indexed by V1/V2.)
-- =============================================================================

-- Course lookup by slug (findBySlug) and browse by category
CREATE INDEX idx_course_slug     ON course (slug);
CREATE INDEX idx_course_category ON course (category);

-- Lesson lookup by slug within a course
CREATE INDEX idx_lesson_slug ON lesson (slug);

-- Quiz lookup by course (findByCourseId) — no index existed before
CREATE INDEX idx_quiz_course ON quiz (course_id);

-- DSA reference lookups (findByName / findByLevel used while filtering questions)
CREATE INDEX idx_topics_name       ON topics (name);
CREATE INDEX idx_platforms_name    ON platforms (name);
CREATE INDEX idx_difficulties_level ON difficulties (level);

-- DSA question title search / ordering
CREATE INDEX idx_questions_title ON questions (title);

-- Progress lookups by user + item (counts for course summaries)
CREATE INDEX idx_user_progress_completed ON user_progress (user_id, completed);
