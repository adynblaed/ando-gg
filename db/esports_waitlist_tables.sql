-- ============================================
-- Ando eSports Waitlist (LTS)
-- Matching the JSON Schema: waitlist-signup.v1
-- Postgres 14+ recommended
-- ============================================

-- Optional: enable citext for case-insensitive email uniqueness (best practice)
CREATE EXTENSION IF NOT EXISTS citext;

-- If you want UUIDs:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------
-- ENUMS (mirror schema enums)
-- ----------------------------

DO $$ BEGIN
  CREATE TYPE bb_region AS ENUM (
    'Reno',
    'Sparks',
    'Carson City',
    'Tahoe/Truckee',
    'Fernley',
    'Fallon',
    'Other Northern Nevada',
    'Not Local'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_membership AS ENUM (
    'Tier 1 (Free) Registered Local',
    'Tier 2 ($3/mo) Player Profile',
    'Tier 3 ($5/mo) Captain Profile',
    'Coach / Leadership Track Interest'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_play_intent AS ENUM ('Casual', 'Competitive', 'Both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_play_time AS ENUM ('Weeknights', 'Weekends', 'Late Nights', 'Flexible');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_skill_self_report AS ENUM ('New', 'Casual', 'Ranked', 'High Ranked', 'Prefer Not To Say');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_platform AS ENUM ('PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile', 'Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bb_pro_interest AS ENUM ('Yes', 'Maybe', 'Not right now');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------
-- TABLE: waitlist_signups
-- ----------------------------
CREATE TABLE IF NOT EXISTS bb_waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- === required ===
  email citext NOT NULL,
  club_username text NOT NULL,

  -- locality (object)
  is_northern_nevada_local boolean NOT NULL,
  region bb_region NOT NULL,
  zip_code text NULL,

  -- games array (store as JSONB for 1:1 fidelity + future expansion)
  -- Each element matches the schema's "games.items" object.
  games jsonb NOT NULL,

  desired_membership bb_membership NOT NULL,
  play_intent bb_play_intent NOT NULL,

  -- preferredPlayTimes is an array of enums; we store as enum[]
  preferred_play_times bb_play_time[] NOT NULL,

  -- consent (object). Schema requires both const=true.
  consent_email_updates boolean NOT NULL CHECK (consent_email_updates = true),
  consent_privacy_ack boolean NOT NULL CHECK (consent_privacy_ack = true),

  -- === optional ===
  -- connectedUsernames (object)
  discord_username text NULL,
  steam_username text NULL,
  riot_username text NULL,

  pro_interest bb_pro_interest NULL,
  event_interest boolean NULL,
  notes text NULL,

  -- marketingAttribution (object)
  marketing_source text NULL,
  marketing_campaign text NULL,
  marketing_medium text NULL,

  -- metadata (server-managed)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  schema_version text NOT NULL DEFAULT '1.0.0',

  -- ----------------------------
  -- Guards that reflect schema constraints
  -- ----------------------------
  CONSTRAINT bb_club_username_len CHECK (char_length(club_username) BETWEEN 2 AND 24),
  CONSTRAINT bb_notes_len CHECK (notes IS NULL OR char_length(notes) <= 300),
  CONSTRAINT bb_zip_format CHECK (zip_code IS NULL OR zip_code ~ '^[0-9]{5}(-[0-9]{4})?$'),
  CONSTRAINT bb_marketing_source_len CHECK (marketing_source IS NULL OR char_length(marketing_source) <= 60),
  CONSTRAINT bb_marketing_campaign_len CHECK (marketing_campaign IS NULL OR char_length(marketing_campaign) <= 80),
  CONSTRAINT bb_marketing_medium_len CHECK (marketing_medium IS NULL OR char_length(marketing_medium) <= 60),

  -- Ensure games is an array, min 1, max 6 (schema)
  CONSTRAINT bb_games_is_array CHECK (jsonb_typeof(games) = 'array'),
  CONSTRAINT bb_games_min_1 CHECK (jsonb_array_length(games) >= 1),
  CONSTRAINT bb_games_max_6 CHECK (jsonb_array_length(games) <= 6)
);

-- ----------------------------
-- UPDATED_AT trigger
-- ----------------------------
CREATE OR REPLACE FUNCTION bb_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bb_waitlist_set_updated_at ON bb_waitlist_signups;

CREATE TRIGGER bb_waitlist_set_updated_at
BEFORE UPDATE ON bb_waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION bb_set_updated_at();

-- ----------------------------
-- Indexes (hardened, practical)
-- ----------------------------

-- Uniqueness (recommended): only one signup per email
CREATE UNIQUE INDEX IF NOT EXISTS bb_waitlist_email_uq
  ON bb_waitlist_signups (email);

-- Optional: keep club usernames unique (good for lookup)
CREATE UNIQUE INDEX IF NOT EXISTS bb_waitlist_club_username_uq
  ON bb_waitlist_signups (lower(club_username));

-- Fast segmentation by membership intent
CREATE INDEX IF NOT EXISTS bb_waitlist_membership_idx
  ON bb_waitlist_signups (desired_membership);

-- Fast segmentation by locality
CREATE INDEX IF NOT EXISTS bb_waitlist_region_idx
  ON bb_waitlist_signups (region);

-- Fast segmentation by play intent
CREATE INDEX IF NOT EXISTS bb_waitlist_play_intent_idx
  ON bb_waitlist_signups (play_intent);

-- Query preferred times (GIN for arrays)
CREATE INDEX IF NOT EXISTS bb_waitlist_preferred_times_gin
  ON bb_waitlist_signups USING gin (preferred_play_times);

-- Search connected usernames (lower for case-insensitive lookup)
CREATE INDEX IF NOT EXISTS bb_waitlist_discord_idx
  ON bb_waitlist_signups (lower(discord_username))
  WHERE discord_username IS NOT NULL;

CREATE INDEX IF NOT EXISTS bb_waitlist_riot_idx
  ON bb_waitlist_signups (lower(riot_username))
  WHERE riot_username IS NOT NULL;

CREATE INDEX IF NOT EXISTS bb_waitlist_steam_idx
  ON bb_waitlist_signups (lower(steam_username))
  WHERE steam_username IS NOT NULL;

-- Games JSONB searching (e.g., filter by gameId)
-- Example query:
--   SELECT * FROM bb_waitlist_signups
--   WHERE games @> '[{"gameId":"valorant"}]';
CREATE INDEX IF NOT EXISTS bb_waitlist_games_gin
  ON bb_waitlist_signups USING gin (games jsonb_path_ops);
