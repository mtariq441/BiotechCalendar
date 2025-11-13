// Referenced from javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateEventAnalysis } from "./openai";
import { insertEventSchema, insertWatchlistItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Company routes
  app.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Event routes
  app.get('/api/events', async (req, res) => {
    try {
      const filters = {
        companyId: req.query.companyId as string | undefined,
        status: req.query.status ? (req.query.status as string).split(',') : undefined,
        types: req.query.types ? (req.query.types as string).split(',') : undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
      };
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // AI Analysis routes
  app.get('/api/ai-analysis/:eventId', async (req, res) => {
    try {
      const analysis = await storage.getAiAnalysis(req.params.eventId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      res.status(500).json({ message: "Failed to fetch AI analysis" });
    }
  });

  app.post('/api/ai-analysis/:eventId', isAuthenticated, async (req, res) => {
    try {
      const eventId = req.params.eventId;
      
      // Check if analysis already exists
      const existingAnalysis = await storage.getAiAnalysis(eventId);
      if (existingAnalysis) {
        return res.json(existingAnalysis);
      }
      
      // Fetch event and related data
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const company = event.companyId ? await storage.getCompany(event.companyId) : undefined;
      const trial = event.nctId ? await storage.getTrialByNctId(event.nctId) : undefined;
      
      // Generate AI analysis
      const analysisData = await generateEventAnalysis(event, company, trial);
      
      // Save to database
      const analysis = await storage.createAiAnalysis({
        eventId,
        summary: analysisData.summary,
        keyFactors: analysisData.keyFactors,
        scenarios: analysisData.scenarios as any,
        confidence: analysisData.confidence,
        modelVersion: "gpt-5-analysis-v1.0",
        sourcesUsed: ["clinicaltrials.gov", "fda.gov", "event_metadata"],
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      res.status(500).json({ message: "Failed to generate AI analysis" });
    }
  });

  // Watchlist routes
  app.get('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getWatchlistItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post('/api/watchlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertWatchlistItemSchema.safeParse({ ...req.body, userId });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request data", errors: validation.error.errors });
      }
      
      // Check if already in watchlist to prevent duplicates
      if (validation.data.eventId) {
        const existing = await storage.getWatchlistItem(userId, validation.data.eventId);
        if (existing) {
          return res.status(200).json(existing); // Return existing item, not an error
        }
      }
      
      const item = await storage.createWatchlistItem(validation.data);
      res.json(item);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete('/api/watchlist/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteWatchlistItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
