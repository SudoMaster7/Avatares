-- ============================================================
-- SUDO Education – Vila do Saber & Avatares
-- Schema v2 – Subscriptions, Parental Accounts, Plan Gates
-- Apply AFTER schema.sql (extends existing tables)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PLAN TYPES (use DO blocks for IF NOT EXISTS on types)
-- ─────────────────────────────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
        CREATE TYPE plan_type AS ENUM ('free', 'pro');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing', 'incomplete');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_interval') THEN
        CREATE TYPE billing_interval AS ENUM ('month', 'year');
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 2. EXTEND users TABLE
-- ─────────────────────────────────────────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS plan              plan_type NOT NULL DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS date_of_birth     DATE,
    ADD COLUMN IF NOT EXISTS age_verified      BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_child          BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS parent_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS parental_consent  BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS consent_given_at  TIMESTAMP,
    ADD COLUMN IF NOT EXISTS daily_msg_count   INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS daily_msg_reset   DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Token system columns (v3)
    ADD COLUMN IF NOT EXISTS daily_tokens_used     INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS daily_tokens_reset    DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS total_messages_sent   INTEGER NOT NULL DEFAULT 0;

-- ─────────────────────────────────────────────────────────────
-- 3. SUBSCRIPTIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id    VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id       VARCHAR(255),
    plan                  plan_type NOT NULL DEFAULT 'free',
    status                subscription_status NOT NULL DEFAULT 'active',
    billing_interval      billing_interval,
    current_period_start  TIMESTAMP,
    current_period_end    TIMESTAMP,
    cancel_at_period_end  BOOLEAN DEFAULT false,
    trial_end             TIMESTAMP,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user    ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe  ON subscriptions(stripe_subscription_id);

-- ─────────────────────────────────────────────────────────────
-- 4. PAYMENT EVENTS (Webhook log for audit / debugging)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type      VARCHAR(100) NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    payload         JSONB NOT NULL,
    processed       BOOLEAN DEFAULT false,
    processed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_events_user   ON payment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_stripe ON payment_events(stripe_event_id);

-- ─────────────────────────────────────────────────────────────
-- 5. FAMILY / PARENTAL ACCOUNTS
-- ─────────────────────────────────────────────────────────────
-- A parent (role = 'parent') can have many child profiles.
-- Children inherit the parent's plan but have separate progress.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role_extended VARCHAR(50)
        CHECK (role_extended IN ('student','teacher','admin','parent')) DEFAULT 'student';

CREATE TABLE IF NOT EXISTS family_invites (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(128) UNIQUE NOT NULL,
    email       VARCHAR(255),
    accepted    BOOLEAN DEFAULT false,
    expires_at  TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- 6. AVATAR PLAN GATES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE avatars
    ADD COLUMN IF NOT EXISTS required_plan plan_type NOT NULL DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN NOT NULL DEFAULT false;

-- Mark the three free avatars (run AFTER seeding avatars):
-- UPDATE avatars SET required_plan = 'free', is_free_preview = true
--     WHERE name IN ('Einstein','Da Vinci','Santos Dumont');

-- ─────────────────────────────────────────────────────────────
-- 7. DAILY MESSAGE QUOTA MANAGEMENT
-- ─────────────────────────────────────────────────────────────
-- Automatically reset daily_msg_count when date rolls over.
-- Called from application layer (middleware) or a pg_cron job.
CREATE OR REPLACE FUNCTION reset_daily_messages()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    UPDATE users
       SET daily_msg_count = 0,
           daily_msg_reset  = CURRENT_DATE
     WHERE daily_msg_reset < CURRENT_DATE
       AND plan = 'free';
END;
$$;

-- Optional: pg_cron schedule (requires pg_cron extension)
-- SELECT cron.schedule('reset-daily-msgs', '0 0 * * *', 'SELECT reset_daily_messages()');

-- ─────────────────────────────────────────────────────────────
-- 8. CONTENT MODERATION LOG
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moderation_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    message_text    TEXT NOT NULL,
    flagged_reason  TEXT,
    action_taken    VARCHAR(50) CHECK (action_taken IN ('blocked','warned','allowed')) DEFAULT 'blocked',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_modlog_user ON moderation_log(user_id);

-- ─────────────────────────────────────────────────────────────
-- 9. RLS POLICIES (Supabase Row Level Security)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log   ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscription
CREATE POLICY "Own subscription" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Only service_role can insert/update subscriptions (Stripe webhook)
CREATE POLICY "Service role manages subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Parents can see their family invites
CREATE POLICY "Parent sees own invites" ON family_invites
    FOR SELECT USING (parent_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- 10. LEARNING ANALYTICS VIEW (for parent e-mail reports)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW child_progress_report AS
SELECT
    u.id              AS child_id,
    u.name            AS child_name,
    u.parent_id,
    sp.subject,
    sp.level,
    sp.total_conversations,
    sp.total_time_minutes,
    sp.average_score,
    sp.last_activity_at
FROM users u
JOIN student_progress sp ON sp.student_id = u.id
WHERE u.is_child = true;

-- ─────────────────────────────────────────────────────────────
-- 11. TRIGGER: sync plan to subscriptions
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_user_plan()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    -- When a subscription becomes active → upgrade user.plan
    IF NEW.status = 'active' THEN
        UPDATE users SET plan = NEW.plan WHERE id = NEW.user_id;
    END IF;
    -- When cancelled / past_due → downgrade to free
    IF NEW.status IN ('cancelled', 'past_due') THEN
        UPDATE users SET plan = 'free' WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_user_plan
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION sync_user_plan();

-- Update trigger for subscriptions.updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
