-- =============================================================================
-- V6 — Track when an account was created ("Member since" on the profile).
-- =============================================================================

ALTER TABLE users
    ADD COLUMN created_at DATETIME(6) NULL;

-- Accounts that predate this column (seed users, early signups) get stamped
-- with the migration time rather than left blank.
UPDATE users SET created_at = NOW(6) WHERE created_at IS NULL;
