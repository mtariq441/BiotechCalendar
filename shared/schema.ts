import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  jsonb,
  integer,
  real,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Companies/Sponsors table
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tickers: text("tickers").array().notNull().default(sql`ARRAY[]::text[]`),
  marketCap: text("market_cap"),
  sector: text("sector"),
  website: text("website"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Trials table
export const trials = pgTable("trials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nctId: text("nct_id").unique(),
  title: text("title").notNull(),
  phase: text("phase"),
  design: text("design"),
  endpoints: text("endpoints").array().default(sql`ARRAY[]::text[]`),
  enrollment: integer("enrollment"),
  locations: text("locations").array().default(sql`ARRAY[]::text[]`),
  companyId: varchar("company_id").references(() => companies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trialsRelations = relations(trials, ({ one }) => ({
  company: one(companies, {
    fields: [trials.companyId],
    references: [companies.id],
  }),
}));

export const insertTrialSchema = createInsertSchema(trials).omit({
  id: true,
  createdAt: true,
});

export type InsertTrial = z.infer<typeof insertTrialSchema>;
export type Trial = typeof trials.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // advisory_committee, pdufa, readout, nda_bla, phase_result
  dateUtc: timestamp("date_utc").notNull(),
  sourceLinks: text("source_links").array().default(sql`ARRAY[]::text[]`),
  nctId: text("nct_id"),
  companyId: varchar("company_id").references(() => companies.id),
  relatedTickers: text("related_tickers").array().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("upcoming"), // upcoming, live, completed, cancelled
  therapeuticArea: text("therapeutic_area"),
  description: text("description"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  company: one(companies, {
    fields: [events.companyId],
    references: [companies.id],
  }),
  aiAnalysis: one(aiAnalyses, {
    fields: [events.id],
    references: [aiAnalyses.eventId],
  }),
  watchlistItems: many(watchlistItems),
}));

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// AI Analyses table
export const aiAnalyses = pgTable("ai_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id).unique(),
  generatedAt: timestamp("generated_at").defaultNow(),
  summary: text("summary").notNull(),
  keyFactors: text("key_factors").array().default(sql`ARRAY[]::text[]`),
  scenarios: jsonb("scenarios").notNull(), // Array of {name, prob, narrative, pricePath: [{date, price}]}
  confidence: real("confidence").notNull(),
  modelVersion: text("model_version").notNull(),
  sourcesUsed: text("sources_used").array().default(sql`ARRAY[]::text[]`),
});

export const aiAnalysesRelations = relations(aiAnalyses, ({ one }) => ({
  event: one(events, {
    fields: [aiAnalyses.eventId],
    references: [events.id],
  }),
}));

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).omit({
  id: true,
  generatedAt: true,
});

export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;

// Scenario type for AI analysis
export interface Scenario {
  name: string;
  prob: number;
  narrative: string;
  pricePath: { date: string; price: number }[];
  priceTarget: number;
}

// Watchlist items table
export const watchlistItems = pgTable("watchlist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventId: varchar("event_id").references(() => events.id),
  companyId: varchar("company_id").references(() => companies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const watchlistItemsRelations = relations(watchlistItems, ({ one }) => ({
  user: one(users, {
    fields: [watchlistItems.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [watchlistItems.eventId],
    references: [events.id],
  }),
  company: one(companies, {
    fields: [watchlistItems.companyId],
    references: [companies.id],
  }),
}));

export const insertWatchlistItemSchema = createInsertSchema(watchlistItems).omit({
  id: true,
  createdAt: true,
});

export type InsertWatchlistItem = z.infer<typeof insertWatchlistItemSchema>;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
