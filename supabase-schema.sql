-- Biotech Calendar Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Companies/Sponsors table
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  tickers TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  market_cap TEXT,
  sector TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trials table
CREATE TABLE IF NOT EXISTS trials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nct_id TEXT UNIQUE,
  title TEXT NOT NULL,
  phase TEXT,
  design TEXT,
  endpoints TEXT[] DEFAULT ARRAY[]::text[],
  enrollment INTEGER,
  locations TEXT[] DEFAULT ARRAY[]::text[],
  company_id VARCHAR REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date_utc TIMESTAMP NOT NULL,
  source_links TEXT[] DEFAULT ARRAY[]::text[],
  nct_id TEXT,
  company_id VARCHAR REFERENCES companies(id),
  related_tickers TEXT[] DEFAULT ARRAY[]::text[],
  status TEXT NOT NULL DEFAULT 'upcoming',
  therapeutic_area TEXT,
  description TEXT,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Analyses table
CREATE TABLE IF NOT EXISTS ai_analyses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id VARCHAR NOT NULL REFERENCES events(id) UNIQUE,
  generated_at TIMESTAMP DEFAULT NOW(),
  summary TEXT NOT NULL,
  key_factors TEXT[] DEFAULT ARRAY[]::text[],
  scenarios JSONB NOT NULL,
  confidence REAL NOT NULL,
  model_version TEXT NOT NULL,
  sources_used TEXT[] DEFAULT ARRAY[]::text[]
);

-- Watchlist items table
CREATE TABLE IF NOT EXISTS watchlist_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  event_id VARCHAR REFERENCES events(id),
  company_id VARCHAR REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_utc);
CREATE INDEX IF NOT EXISTS idx_events_company ON events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_trials_company ON trials(company_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_event ON watchlist_items(event_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_event ON ai_analyses(event_id);
