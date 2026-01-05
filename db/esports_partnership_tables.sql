-- ============================================
-- Ando eSports Partnerships (LTS)
-- Matching the JSON Schema: partnership-lead.v1
-- Postgres 14+ recommended
-- ============================================

-- Optional: enable citext for case-insensitive email uniqueness (best practice)
CREATE EXTENSION IF NOT EXISTS citext;

-- If you want UUIDs:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------
-- TABLE: partnership_leads
-- ----------------------------
CREATE TABLE IF NOT EXISTS bb_partnership_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- === required ===
  email citext NOT NULL,

  -- === optional ===
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
  CONSTRAINT bb_partnership_notes_len CHECK (notes IS NULL OR char_length(notes) <= 1000),
  CONSTRAINT bb_partnership_marketing_source_len CHECK (marketing_source IS NULL OR char_length(marketing_source) <= 60),
  CONSTRAINT bb_partnership_marketing_campaign_len CHECK (marketing_campaign IS NULL OR char_length(marketing_campaign) <= 80),
  CONSTRAINT bb_partnership_marketing_medium_len CHECK (marketing_medium IS NULL OR char_length(marketing_medium) <= 60)
);

-- ----------------------------
-- UPDATED_AT trigger
-- ----------------------------
CREATE OR REPLACE FUNCTION bb_partnership_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bb_partnership_set_updated_at ON bb_partnership_leads;

CREATE TRIGGER bb_partnership_set_updated_at
BEFORE UPDATE ON bb_partnership_leads
FOR EACH ROW
EXECUTE FUNCTION bb_partnership_set_updated_at();

-- ----------------------------
-- Indexes
-- ----------------------------

-- Uniqueness (optional): only one lead per email
CREATE UNIQUE INDEX IF NOT EXISTS bb_partnership_email_uq
  ON bb_partnership_leads (email);

-- Fast recent-first browsing
CREATE INDEX IF NOT EXISTS bb_partnership_created_at_idx
  ON bb_partnership_leads (created_at DESC);


