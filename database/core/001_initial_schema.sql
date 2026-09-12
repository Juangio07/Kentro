-- Kentro Core / migration 001
-- PostgreSQL. Ejecutar únicamente mediante kentro-migrations.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(100) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE business_status AS ENUM ('trial', 'active', 'suspended', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'suspended', 'cancelled');
CREATE TYPE device_status AS ENUM ('pending', 'active', 'revoked');
CREATE TYPE license_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE database_status AS ENUM ('provisioning', 'active', 'suspended', 'error', 'retired');
CREATE TYPE release_channel AS ENUM ('stable', 'beta', 'internal');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_code VARCHAR(32) NOT NULL UNIQUE,
    legal_name VARCHAR(160) NOT NULL,
    tax_id VARCHAR(80),
    status business_status NOT NULL DEFAULT 'trial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE global_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX global_users_email_unique ON global_users (lower(email));

CREATE TABLE business_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    user_id UUID NOT NULL REFERENCES global_users(id),
    role_code VARCHAR(40) NOT NULL DEFAULT 'propietario',
    is_owner BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (business_id, user_id)
);

CREATE UNIQUE INDEX one_owner_per_business
    ON business_memberships (business_id) WHERE is_owner;

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    max_users INTEGER NOT NULL CHECK (max_users > 0),
    max_devices INTEGER NOT NULL CHECK (max_devices > 0),
    modules JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status NOT NULL DEFAULT 'trial',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE INDEX subscriptions_business_idx ON subscriptions (business_id, status);

CREATE TABLE database_registry (
    business_id UUID PRIMARY KEY REFERENCES businesses(id),
    cluster_code VARCHAR(80) NOT NULL DEFAULT 'primary',
    host_alias VARCHAR(160) NOT NULL,
    database_name VARCHAR(100) NOT NULL UNIQUE,
    schema_version INTEGER NOT NULL DEFAULT 0 CHECK (schema_version >= 0),
    status database_status NOT NULL DEFAULT 'provisioning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    device_id VARCHAR(160) NOT NULL,
    name VARCHAR(100) NOT NULL,
    platform VARCHAR(40),
    app_version VARCHAR(32),
    status device_status NOT NULL DEFAULT 'pending',
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (business_id, device_id)
);

CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    license_key_hash TEXT NOT NULL UNIQUE,
    status license_status NOT NULL DEFAULT 'active',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES global_users(id),
    business_id UUID NOT NULL REFERENCES businesses(id),
    device_id UUID REFERENCES devices(id),
    access_token_jti UUID NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sessions_lookup_idx ON sessions (user_id, business_id, revoked_at);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    subscription_id UUID REFERENCES subscriptions(id),
    provider VARCHAR(60),
    provider_reference VARCHAR(160),
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'COP',
    status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(32) NOT NULL UNIQUE,
    channel release_channel NOT NULL DEFAULT 'stable',
    download_url TEXT NOT NULL,
    mandatory BOOLEAN NOT NULL DEFAULT false,
    released_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),
    user_id UUID REFERENCES global_users(id),
    device_id UUID REFERENCES devices(id),
    level VARCHAR(16) NOT NULL DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error')),
    event_name VARCHAR(120) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX system_logs_business_created_idx ON system_logs (business_id, created_at DESC);

CREATE TRIGGER businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER global_users_updated_at BEFORE UPDATE ON global_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER database_registry_updated_at BEFORE UPDATE ON database_registry FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
