// Supabase storage implementation
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
import { supabase } from "./supabase";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Company operations
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Trial operations
  getTrials(): Promise<Trial[]>;
  getTrial(id: string): Promise<Trial | undefined>;
  getTrialByNctId(nctId: string): Promise<Trial | undefined>;
  createTrial(trial: InsertTrial): Promise<Trial>;

  // Event operations
  getEvents(filters?: { companyId?: string; status?: string[]; types?: string[]; dateFrom?: string; dateTo?: string }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // AI Analysis operations
  getAiAnalysis(eventId: string): Promise<AiAnalysis | undefined>;
  createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis>;

  // Watchlist operations
  getWatchlistItems(userId: string): Promise<WatchlistItem[]>;
  getWatchlistItem(userId: string, eventId: string): Promise<WatchlistItem | undefined>;
  createWatchlistItem(item: InsertWatchlistItem): Promise<WatchlistItem>;
  deleteWatchlistItem(id: string): Promise<void>;
}

// Specific Supabase timestamp columns that should be converted to Date objects
const TIMESTAMP_COLUMNS = new Set([
  'created_at',
  'updated_at',
  'last_updated',
  'date_utc',
  'generated_at',
  'expire'
]);

// Helper function to convert snake_case to camelCase and handle date strings
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = obj[key];
      
      // Convert ISO date strings to Date objects ONLY for specific timestamp columns
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

// Helper function to convert camelCase to snake_case
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

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return toCamelCase(data) as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const snakeData = toSnakeCase(userData);
    const { data, error } = await supabase
      .from('users')
      .upsert({
        ...snakeData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as User;
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data) as Company[];
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as Company;
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const snakeData = toSnakeCase(companyData);
    const { data, error } = await supabase
      .from('companies')
      .insert(snakeData)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as Company;
  }

  // Trial operations
  async getTrials(): Promise<Trial[]> {
    const { data, error } = await supabase
      .from('trials')
      .select('*');
    
    if (error) throw error;
    return toCamelCase(data) as Trial[];
  }

  async getTrial(id: string): Promise<Trial | undefined> {
    const { data, error } = await supabase
      .from('trials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as Trial;
  }

  async getTrialByNctId(nctId: string): Promise<Trial | undefined> {
    const { data, error } = await supabase
      .from('trials')
      .select('*')
      .eq('nct_id', nctId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as Trial;
  }

  async createTrial(trialData: InsertTrial): Promise<Trial> {
    const snakeData = toSnakeCase(trialData);
    const { data, error } = await supabase
      .from('trials')
      .insert(snakeData)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as Trial;
  }

  // Event operations
  async getEvents(filters?: { companyId?: string; status?: string[]; types?: string[]; dateFrom?: string; dateTo?: string }): Promise<Event[]> {
    let query = supabase.from('events').select('*');
    
    if (filters?.companyId) {
      query = query.eq('company_id', filters.companyId);
    }
    
    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    
    if (filters?.types && filters.types.length > 0) {
      query = query.in('type', filters.types);
    }
    
    if (filters?.dateFrom) {
      query = query.gte('date_utc', filters.dateFrom);
    }
    
    if (filters?.dateTo) {
      query = query.lte('date_utc', filters.dateTo);
    }
    
    query = query.order('date_utc');
    
    const { data, error } = await query;
    if (error) throw error;
    return toCamelCase(data) as Event[];
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as Event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const snakeData = toSnakeCase(eventData);
    const { data, error } = await supabase
      .from('events')
      .insert(snakeData)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as Event;
  }

  // AI Analysis operations
  async getAiAnalysis(eventId: string): Promise<AiAnalysis | undefined> {
    const { data, error } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('event_id', eventId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as AiAnalysis;
  }

  async createAiAnalysis(analysisData: InsertAiAnalysis): Promise<AiAnalysis> {
    const snakeData = toSnakeCase(analysisData);
    const { data, error } = await supabase
      .from('ai_analyses')
      .insert(snakeData)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as AiAnalysis;
  }

  // Watchlist operations
  async getWatchlistItems(userId: string): Promise<WatchlistItem[]> {
    const { data, error } = await supabase
      .from('watchlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return toCamelCase(data) as WatchlistItem[];
  }

  async getWatchlistItem(userId: string, eventId: string): Promise<WatchlistItem | undefined> {
    const { data, error } = await supabase
      .from('watchlist_items')
      .select('*')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return toCamelCase(data) as WatchlistItem;
  }

  async createWatchlistItem(itemData: InsertWatchlistItem): Promise<WatchlistItem> {
    const snakeData = toSnakeCase(itemData);
    const { data, error } = await supabase
      .from('watchlist_items')
      .insert(snakeData)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data) as WatchlistItem;
  }

  async deleteWatchlistItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const storage = new SupabaseStorage();
