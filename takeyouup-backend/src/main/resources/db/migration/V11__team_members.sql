-- The team roster shown on the About page. Previously a single hard-coded card
-- in the frontend; now admin-managed content with an uploadable photo.
--
-- No seed rows here: migrations run once, so starter content lives in the Java
-- seeders instead (see TeamMemberSeeder), matching the convention used by the
-- blog and resource tables.
CREATE TABLE team_members (
    id          BINARY(16)   NOT NULL,
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NULL,
    bio         VARCHAR(512) NULL,
    photo_url   VARCHAR(512) NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  DATETIME(6)  DEFAULT NULL,
    updated_at  DATETIME(6)  DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
