// Referenced from javascript_log_in_with_replit and javascript_database blueprints
import {
  users,
  companies,
  trials,
  events,
  aiAnalyses,
  watchlistItems,
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
import { db } from "./db";
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(companyData).returning();
    return company;
  }

  // Trial operations
  async getTrials(): Promise<Trial[]> {
    return await db.select().from(trials);
  }

  async getTrial(id: string): Promise<Trial | undefined> {
    const [trial] = await db.select().from(trials).where(eq(trials.id, id));
    return trial || undefined;
  }

  async getTrialByNctId(nctId: string): Promise<Trial | undefined> {
    const [trial] = await db.select().from(trials).where(eq(trials.nctId, nctId));
    return trial || undefined;
  }

  async createTrial(trialData: InsertTrial): Promise<Trial> {
    const [trial] = await db.insert(trials).values(trialData).returning();
    return trial;
  }

  // Event operations
  async getEvents(filters?: { companyId?: string; status?: string[]; types?: string[]; dateFrom?: string; dateTo?: string }): Promise<Event[]> {
    let query = db.select().from(events);
    
    const conditions = [];
    
    if (filters?.companyId) {
      conditions.push(eq(events.companyId, filters.companyId));
    }
    
    if (filters?.status && filters.status.length > 0) {
      conditions.push(inArray(events.status, filters.status));
    }
    
    if (filters?.types && filters.types.length > 0) {
      conditions.push(inArray(events.type, filters.types));
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(events.dateUtc, new Date(filters.dateFrom)));
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(events.dateUtc, new Date(filters.dateTo)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(events.dateUtc);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  // AI Analysis operations
  async getAiAnalysis(eventId: string): Promise<AiAnalysis | undefined> {
    const [analysis] = await db.select().from(aiAnalyses).where(eq(aiAnalyses.eventId, eventId));
    return analysis || undefined;
  }

  async createAiAnalysis(analysisData: InsertAiAnalysis): Promise<AiAnalysis> {
    const [analysis] = await db.insert(aiAnalyses).values(analysisData).returning();
    return analysis;
  }

  // Watchlist operations
  async getWatchlistItems(userId: string): Promise<WatchlistItem[]> {
    return await db.select().from(watchlistItems).where(eq(watchlistItems.userId, userId)).orderBy(desc(watchlistItems.createdAt));
  }

  async getWatchlistItem(userId: string, eventId: string): Promise<WatchlistItem | undefined> {
    const [item] = await db
      .select()
      .from(watchlistItems)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.eventId, eventId)));
    return item || undefined;
  }

  async createWatchlistItem(itemData: InsertWatchlistItem): Promise<WatchlistItem> {
    const [item] = await db.insert(watchlistItems).values(itemData).returning();
    return item;
  }

  async deleteWatchlistItem(id: string): Promise<void> {
    await db.delete(watchlistItems).where(eq(watchlistItems.id, id));
  }
}

export const storage = new DatabaseStorage();
