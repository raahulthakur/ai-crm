-- Run this in your Supabase SQL editor to set up the database
-- Dashboard: https://app.supabase.com > SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE deal_stage AS ENUM ('prospecting','qualification','proposal','negotiation','closed_won','closed_lost');
CREATE TYPE contact_role AS ENUM ('economic_buyer','champion','blocker','influencer','end_user','technical_evaluator');
CREATE TYPE contact_status AS ENUM ('not_contacted','engaged','champion','blocked','neutral','unresponsive');
CREATE TYPE activity_type AS ENUM ('email_sent','email_received','whatsapp_sent','whatsapp_received','call_completed','meeting_booked','document_sent','ai_insight_generated','score_updated','note_added');
CREATE TYPE message_channel AS ENUM ('whatsapp','email','sms');
CREATE TYPE message_direction AS ENUM ('outbound','inbound');
CREATE TYPE message_status AS ENUM ('draft','sent','delivered','read','replied','skipped');
CREATE TYPE insight_category AS ENUM ('risk','opportunity','relationship','competitive','timeline','compliance');
CREATE TYPE action_priority AS ENUM ('critical','high','medium','low');
CREATE TYPE document_type AS ENUM ('proposal','contract','compliance_doc','case_study','nda','pricing_sheet');

CREATE TABLE deals (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  arr_value        NUMERIC(12,2) NOT NULL,
  stage            deal_stage NOT NULL DEFAULT 'qualification',
  health_score     INTEGER NOT NULL DEFAULT 50 CHECK (health_score BETWEEN 0 AND 100),
  health_score_prev INTEGER,
  days_in_stage    INTEGER NOT NULL DEFAULT 0,
  close_date       DATE,
  owner_name       TEXT,
  owner_email      TEXT,
  is_stuck         BOOLEAN NOT NULL DEFAULT false,
  stuck_reason     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name        TEXT NOT NULL,
  email            TEXT,
  phone            TEXT,
  job_title        TEXT,
  company_name     TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deal_contacts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  contact_id       UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role             contact_role NOT NULL,
  status           contact_status NOT NULL DEFAULT 'not_contacted',
  influence_weight INTEGER DEFAULT 50 CHECK (influence_weight BETWEEN 0 AND 100),
  reports_to       UUID REFERENCES deal_contacts(id),
  is_key_blocker   BOOLEAN NOT NULL DEFAULT false,
  is_champion      BOOLEAN NOT NULL DEFAULT false,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(deal_id, contact_id)
);

CREATE TABLE activities (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  contact_id       UUID REFERENCES contacts(id) ON DELETE SET NULL,
  type             activity_type NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  metadata         JSONB,
  occurred_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_insights (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  category         insight_category NOT NULL,
  title            TEXT NOT NULL,
  body             TEXT NOT NULL,
  confidence       INTEGER NOT NULL DEFAULT 75 CHECK (confidence BETWEEN 0 AND 100),
  model_used       TEXT,
  is_dismissed     BOOLEAN NOT NULL DEFAULT false,
  is_actioned      BOOLEAN NOT NULL DEFAULT false,
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_recommended_actions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  insight_id       UUID REFERENCES ai_insights(id) ON DELETE SET NULL,
  priority         action_priority NOT NULL DEFAULT 'medium',
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  action_type      TEXT NOT NULL,
  target_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  due_date         DATE,
  is_completed     BOOLEAN NOT NULL DEFAULT false,
  completed_at     TIMESTAMPTZ,
  metadata         JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  contact_id       UUID REFERENCES contacts(id) ON DELETE SET NULL,
  channel          message_channel NOT NULL DEFAULT 'whatsapp',
  direction        message_direction NOT NULL,
  status           message_status NOT NULL DEFAULT 'draft',
  body             TEXT NOT NULL,
  ai_drafted       BOOLEAN NOT NULL DEFAULT false,
  ai_model_used    TEXT,
  sent_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  type             document_type NOT NULL,
  file_url         TEXT,
  sent_to          UUID[],
  sent_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX ON activities(deal_id);
CREATE INDEX ON activities(occurred_at DESC);
CREATE INDEX ON ai_insights(deal_id);
CREATE INDEX ON ai_recommended_actions(deal_id);
CREATE INDEX ON messages(deal_id);
CREATE INDEX ON messages(contact_id);
CREATE INDEX ON documents(deal_id);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_deal_contacts_updated_at BEFORE UPDATE ON deal_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_actions_updated_at BEFORE UPDATE ON ai_recommended_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
