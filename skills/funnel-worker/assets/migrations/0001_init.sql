-- Combined starter schema: leads, orders, webhook_events, rate_limits,
-- variant_visits. Split into separate migration files if preferred.

-- 0001_init: funnel data layer for the core offer + lifetime upsell.

CREATE TABLE IF NOT EXISTS orders (
  id                 TEXT PRIMARY KEY,
  email              TEXT NOT NULL,
  stripe_session_id  TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  product            TEXT NOT NULL CHECK (product IN ('bundle', 'lifetime')),
  amount_cents       INTEGER NOT NULL,
  currency           TEXT NOT NULL DEFAULT 'usd',
  status             TEXT NOT NULL,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS orders_email_idx      ON orders (email);
CREATE INDEX IF NOT EXISTS orders_customer_idx   ON orders (stripe_customer_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at);

-- Idempotency ledger. Every webhook writes here (INSERT OR IGNORE) BEFORE any
-- handler side effect; a zero-row result means the event was already processed.
CREATE TABLE IF NOT EXISTS webhook_events (
  stripe_event_id TEXT PRIMARY KEY,
  type            TEXT NOT NULL,
  processed_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  source     TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS leads_email_idx      ON leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);
-- 0002: sustained-window rate limiting for unauthenticated POST /api/lead.
-- Burst (5/min) is handled by the Workers Rate Limiting binding in memory at
-- the edge; this table only carries the 30/hour sustained window, so writes
-- here are already capped at 5/min/IP by the layer in front of it.
--
-- bucket_key is SHA-256(client IP). Raw IPs are never stored.

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket_key   TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_window_idx ON rate_limits (window_start);
-- 0003: A/B test attribution.
--
-- The variant has to survive the handoff to ThriveCart and come back on the
-- webhook, otherwise the test measures clicks rather than money. It is stored
-- in three places for that reason: on the lead at capture time, on the order
-- when the webhook is wired, and as a visit counter so the denominator of the
-- conversion rate is real rather than inferred.

-- (variant is included in the leads table above when starting fresh)
ALTER TABLE leads ADD COLUMN variant TEXT;
CREATE INDEX IF NOT EXISTS leads_variant_idx ON leads (variant);

ALTER TABLE orders ADD COLUMN variant TEXT;
CREATE INDEX IF NOT EXISTS orders_variant_idx ON orders (variant);

-- One row per variant per day. Written only when a human is newly assigned:
-- returning visitors, forced overrides and bots are never counted, so the
-- visitor number is the assignment count and nothing else.
CREATE TABLE IF NOT EXISTS variant_visits (
  variant TEXT NOT NULL,
  day     TEXT NOT NULL,
  count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (variant, day)
);
