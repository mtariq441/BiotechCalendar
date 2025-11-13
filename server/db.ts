import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Replit database is not configured.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire)
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        tickers TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
        market_cap TEXT,
        sector TEXT,
        website TEXT,
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS watchlist_items (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        event_id VARCHAR REFERENCES events(id),
        company_id VARCHAR REFERENCES companies(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_utc)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_company ON events(company_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_trials_company ON trials(company_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist_items(user_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_watchlist_event ON watchlist_items(event_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_analyses_event ON ai_analyses(event_id)
    `);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
