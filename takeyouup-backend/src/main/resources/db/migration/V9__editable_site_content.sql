-- Site content that used to be hardcoded in the React source.
--
-- Two shapes, because the content has two shapes:
--
--   content_item  repeatable lists — FAQs, home features, about values, the
--                 "how it works" steps, contact details. Rows are ordered and
--                 can be switched off without deleting them.
--   site_text     one-off copy — headlines, page intros, taglines. Addressed by
--                 a stable key the frontend asks for by name.
--
-- Both are seeded by SiteContentSeeder with the exact strings that were in the
-- components, so deploying this changes nothing on screen until someone edits it.

CREATE TABLE content_item (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    -- Which list this row belongs to, e.g. 'HOME_FEATURE'. Not a FK: sections
    -- are defined by the frontend that renders them, not by data.
    section      VARCHAR(64)  NOT NULL,
    title        VARCHAR(255) NULL,
    body         TEXT         NULL,
    -- Lucide icon name, resolved against an allow-list in the frontend. A name
    -- that is not in that list falls back to a default rather than breaking.
    icon         VARCHAR(64)  NULL,
    -- Optional href for rows that link somewhere (contact email, phone).
    link         VARCHAR(512) NULL,
    -- Small free-form slot for a row that needs one more field, e.g. the step
    -- number on "how it works".
    extra        VARCHAR(255) NULL,
    sort_order   INT          NOT NULL DEFAULT 0,
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    -- The only query this table serves: "give me the active rows of a section,
    -- in order". Covering index so it never touches the table for the sort.
    KEY idx_content_item_section (section, active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_text (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    -- Stable identifier the frontend looks up, e.g. 'home.hero.subtitle'.
    content_key  VARCHAR(128) NOT NULL,
    value        TEXT         NULL,
    -- Shown next to the field in the admin editor so whoever edits it knows
    -- where the text appears. Content, not code, should explain itself.
    description  VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_site_text_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data deliberately lives in SiteContentSeeder, not here. A migration
-- seeds once and only once, so a section added later would never appear in an
-- existing database, and re-running it against a partially-populated table
-- means writing conflict handling by hand. The seeder is idempotent per section
-- and per key: it fills in whatever is missing on every boot and leaves edited
-- rows alone.
