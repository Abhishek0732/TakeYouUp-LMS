-- =============================================================================
-- V8 — When an item was completed, so the problems page can show a streak.
-- =============================================================================

ALTER TABLE user_progress
    ADD COLUMN completed_at DATETIME(6) NULL;

-- Existing rows have no recorded date. Leaving them NULL is deliberate: a
-- backfilled "today" would invent a streak nobody earned. They simply don't
-- count toward the streak until the item is toggled again.

-- Streak reads group by day for one user and one item type.
CREATE INDEX idx_user_progress_completed_at
    ON user_progress (user_id, item_type, completed_at);
