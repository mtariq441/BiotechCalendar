import { z } from "zod";

// User types
export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface UpsertUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  tickers: string[];
  marketCap?: string | null;
  sector?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  createdAt?: Date | null;
}

export const insertCompanySchema = z.object({
  name: z.string(),
  tickers: z.array(z.string()),
  marketCap: z.string().optional(),
  sector: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;

// Trial types
export interface Trial {
  id: string;
  nctId?: string | null;
  title: string;
  phase?: string | null;
  design?: string | null;
  endpoints?: string[] | null;
  enrollment?: number | null;
  locations?: string[] | null;
  companyId?: string | null;
  createdAt?: Date | null;
}

export const insertTrialSchema = z.object({
  nctId: z.string().optional(),
  title: z.string(),
  phase: z.string().optional(),
  design: z.string().optional(),
  endpoints: z.array(z.string()).optional(),
  enrollment: z.number().optional(),
  locations: z.array(z.string()).optional(),
  companyId: z.string().optional(),
});

export type InsertTrial = z.infer<typeof insertTrialSchema>;

// Event types
export interface Event {
  id: string;
  title: string;
  type: string;
  dateUtc: Date;
  sourceLinks?: string[] | null;
  nctId?: string | null;
  companyId?: string | null;
  relatedTickers?: string[] | null;
  status: string;
  therapeuticArea?: string | null;
  description?: string | null;
  lastUpdated?: Date | null;
  createdAt?: Date | null;
}

export const insertEventSchema = z.object({
  title: z.string(),
  type: z.string(),
  dateUtc: z.date(),
  sourceLinks: z.array(z.string()).optional(),
  nctId: z.string().optional(),
  companyId: z.string().optional(),
  relatedTickers: z.array(z.string()).optional(),
  status: z.string(),
  therapeuticArea: z.string().optional(),
  description: z.string().optional(),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;

// Scenario type for AI analysis
export interface Scenario {
  name: string;
  prob: number;
  narrative: string;
  pricePath: { date: string; price: number }[];
  priceTarget: number;
}

// AI Analysis types
export interface AiAnalysis {
  id: string;
  eventId: string;
  generatedAt?: Date | null;
  summary: string;
  keyFactors?: string[] | null;
  scenarios: Scenario[];
  confidence: number;
  modelVersion: string;
  sourcesUsed?: string[] | null;
}

export const insertAiAnalysisSchema = z.object({
  eventId: z.string(),
  summary: z.string(),
  keyFactors: z.array(z.string()).optional(),
  scenarios: z.any(), // JSONB
  confidence: z.number(),
  modelVersion: z.string(),
  sourcesUsed: z.array(z.string()).optional(),
});

export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;

// Watchlist types
export interface WatchlistItem {
  id: string;
  userId: string;
  eventId?: string | null;
  companyId?: string | null;
  createdAt?: Date | null;
}

export const insertWatchlistItemSchema = z.object({
  userId: z.string(),
  eventId: z.string().optional(),
  companyId: z.string().optional(),
});

export type InsertWatchlistItem = z.infer<typeof insertWatchlistItemSchema>;
