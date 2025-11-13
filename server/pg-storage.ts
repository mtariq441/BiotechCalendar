import {
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Trial,
  type InsertTrial,
  type Event,
  type InsertEvent,
  type AiAnalysis,
  type InsertAiAnalysis,
  type WatchlistItem,
  type InsertWatchlistItem,
} from "@shared/schema";
import { pool } from "./db";
import type { IStorage } from "./storage";

const TIMESTAMP_COLUMNS = new Set([
  'created_at',
  'updated_at',
  'last_updated',
  'date_utc',
  'generated_at',
  'expire'
]);

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = obj[key];
      
      if (typeof value === 'string' && 
          TIMESTAMP_COLUMNS.has(key) &&
          /^\d{4}-\d{2}-\d{2}/.test(value)) {
        acc[camelKey] = new Date(value);
      } else {
        acc[camelKey] = toCamelCase(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const snakeData = toSnakeCase(userData);
    const result = await pool.query(
      `INSERT INTO users (id, email, first_name, last_name, profile_image_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         profile_image_url = EXCLUDED.profile_image_url,
         updated_at = NOW()
       RETURNING *`,
      [
        snakeData.id || null,
        snakeData.email || null,
        snakeData.first_name || null,
        snakeData.last_name || null,
        snakeData.profile_image_url || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as User;
  }

  async getCompanies(): Promise<Company[]> {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY name'
    );
    return toCamelCase(result.rows) as Company[];
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const result = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as Company;
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const snakeData = toSnakeCase(companyData);
    const result = await pool.query(
      `INSERT INTO companies (name, tickers, market_cap, sector, website, logo_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        snakeData.name,
        snakeData.tickers,
        snakeData.market_cap || null,
        snakeData.sector || null,
        snakeData.website || null,
        snakeData.logo_url || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as Company;
  }

  async getTrials(): Promise<Trial[]> {
    const result = await pool.query('SELECT * FROM trials');
    return toCamelCase(result.rows) as Trial[];
  }

  async getTrial(id: string): Promise<Trial | undefined> {
    const result = await pool.query(
      'SELECT * FROM trials WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as Trial;
  }

  async getTrialByNctId(nctId: string): Promise<Trial | undefined> {
    const result = await pool.query(
      'SELECT * FROM trials WHERE nct_id = $1',
      [nctId]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as Trial;
  }

  async createTrial(trialData: InsertTrial): Promise<Trial> {
    const snakeData = toSnakeCase(trialData);
    const result = await pool.query(
      `INSERT INTO trials (nct_id, title, phase, design, endpoints, enrollment, locations, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        snakeData.nct_id || null,
        snakeData.title,
        snakeData.phase || null,
        snakeData.design || null,
        snakeData.endpoints || null,
        snakeData.enrollment || null,
        snakeData.locations || null,
        snakeData.company_id || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as Trial;
  }

  async getEvents(filters?: { companyId?: string; status?: string[]; types?: string[]; dateFrom?: string; dateTo?: string }): Promise<Event[]> {
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters?.companyId) {
      query += ` AND company_id = $${paramIndex}`;
      params.push(filters.companyId);
      paramIndex++;
    }
    
    if (filters?.status && filters.status.length > 0) {
      query += ` AND status = ANY($${paramIndex})`;
      params.push(filters.status);
      paramIndex++;
    }
    
    if (filters?.types && filters.types.length > 0) {
      query += ` AND type = ANY($${paramIndex})`;
      params.push(filters.types);
      paramIndex++;
    }
    
    if (filters?.dateFrom) {
      query += ` AND date_utc >= $${paramIndex}`;
      params.push(filters.dateFrom);
      paramIndex++;
    }
    
    if (filters?.dateTo) {
      query += ` AND date_utc <= $${paramIndex}`;
      params.push(filters.dateTo);
      paramIndex++;
    }
    
    query += ' ORDER BY date_utc';
    
    const result = await pool.query(query, params);
    return toCamelCase(result.rows) as Event[];
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as Event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const snakeData = toSnakeCase(eventData);
    const result = await pool.query(
      `INSERT INTO events (title, type, date_utc, source_links, nct_id, company_id, related_tickers, status, therapeutic_area, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        snakeData.title,
        snakeData.type,
        snakeData.date_utc,
        snakeData.source_links || null,
        snakeData.nct_id || null,
        snakeData.company_id || null,
        snakeData.related_tickers || null,
        snakeData.status,
        snakeData.therapeutic_area || null,
        snakeData.description || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as Event;
  }

  async getAiAnalysis(eventId: string): Promise<AiAnalysis | undefined> {
    const result = await pool.query(
      'SELECT * FROM ai_analyses WHERE event_id = $1',
      [eventId]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as AiAnalysis;
  }

  async createAiAnalysis(analysisData: InsertAiAnalysis): Promise<AiAnalysis> {
    const snakeData = toSnakeCase(analysisData);
    const result = await pool.query(
      `INSERT INTO ai_analyses (event_id, summary, key_factors, scenarios, confidence, model_version, sources_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        snakeData.event_id,
        snakeData.summary,
        snakeData.key_factors || null,
        JSON.stringify(snakeData.scenarios),
        snakeData.confidence,
        snakeData.model_version,
        snakeData.sources_used || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as AiAnalysis;
  }

  async getWatchlistItems(userId: string): Promise<WatchlistItem[]> {
    const result = await pool.query(
      'SELECT * FROM watchlist_items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return toCamelCase(result.rows) as WatchlistItem[];
  }

  async getWatchlistItem(userId: string, eventId: string): Promise<WatchlistItem | undefined> {
    const result = await pool.query(
      'SELECT * FROM watchlist_items WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    if (result.rows.length === 0) return undefined;
    return toCamelCase(result.rows[0]) as WatchlistItem;
  }

  async createWatchlistItem(itemData: InsertWatchlistItem): Promise<WatchlistItem> {
    const snakeData = toSnakeCase(itemData);
    const result = await pool.query(
      `INSERT INTO watchlist_items (user_id, event_id, company_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        snakeData.user_id,
        snakeData.event_id || null,
        snakeData.company_id || null
      ]
    );
    
    return toCamelCase(result.rows[0]) as WatchlistItem;
  }

  async deleteWatchlistItem(id: string): Promise<void> {
    await pool.query(
      'DELETE FROM watchlist_items WHERE id = $1',
      [id]
    );
  }
}

export const storage = new PostgresStorage();
