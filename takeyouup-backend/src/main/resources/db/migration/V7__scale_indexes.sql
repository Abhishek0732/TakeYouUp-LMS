-- =============================================================================
-- V7 — Indexes for the access patterns that grow with usage.
--
-- Each one below backs a query that exists today and would otherwise degrade
-- to a range scan plus row lookups, or an outright filesort, as rows pile up.
-- =============================================================================

-- user_progress is the one genuinely unbounded table: a row per user per
-- lesson AND per solved problem. This covering index serves both
--   countByUserAndItemTypeAndCompletedTrueAndItemIdIn (course completion), and
--   countSolvedByDifficulty (problems solved per difficulty)
-- without touching the table at all.
CREATE INDEX idx_user_progress_lookup
    ON user_progress (user_id, item_type, item_id, completed);

-- findByUserOrderByCreatedAtDesc / findByUserAndQuizIdOrderByCreatedAtDesc:
-- previously filtered on user_id then filesorted on created_at.
CREATE INDEX idx_quiz_attempts_user_created
    ON quiz_attempts (user_id, created_at);

-- Every "ordered by sort_order within a parent" read in the resources module.
CREATE INDEX idx_mcq_questions_topic_sort
    ON mcq_questions (topic_id, sort_order);

CREATE INDEX idx_question_options_q_idx
    ON question_options (question_id, option_index);

CREATE INDEX idx_resource_topics_cat_sort
    ON resource_topics (category_id, sort_order);

CREATE INDEX idx_topic_concepts_topic_sort
    ON topic_concepts (topic_id, sort_order);
