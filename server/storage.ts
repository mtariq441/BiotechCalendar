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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  getTrials(): Promise<Trial[]>;
  getTrial(id: string): Promise<Trial | undefined>;
  getTrialByNctId(nctId: string): Promise<Trial | undefined>;
  createTrial(trial: InsertTrial): Promise<Trial>;
  getEvents(filters?: { companyId?: string; status?: string[]; types?: string[]; dateFrom?: string; dateTo?: string }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getAiAnalysis(eventId: string): Promise<AiAnalysis | undefined>;
  createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis>;
  getWatchlistItems(userId: string): Promise<WatchlistItem[]>;
  getWatchlistItem(userId: string, eventId: string): Promise<WatchlistItem | undefined>;
  createWatchlistItem(item: InsertWatchlistItem): Promise<WatchlistItem>;
  deleteWatchlistItem(id: string): Promise<void>;
}

export { storage } from "./pg-storage";
