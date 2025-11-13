# BioCalendar - FDA Clinical Trials & Events Tracker

## Overview

BioCalendar is a real-time, interactive biotech calendar application that aggregates FDA clinical trial events, PDUFA dates, and data readouts. The platform provides AI-powered analysis of clinical events with scenario-based stock price forecasting. Users can track upcoming biotech events, view detailed AI explanations of trial outcomes, explore bull/base/bear scenarios, and maintain a personalized watchlist of events.

The application serves biotech investors, analysts, and professionals who need comprehensive tracking of FDA trials, advisory committee meetings, and clinical readouts with intelligent insights to inform investment decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for component-based UI
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Framer Motion for animations and transitions

**Design System:**
- shadcn/ui component library (Radix UI primitives)
- Tailwind CSS for utility-first styling
- Custom design tokens following professional data platform aesthetics (Linear, Bloomberg Terminal, Robinhood)
- Typography: Inter for UI/body text, JetBrains Mono for monospaced data (tickers, NCT IDs)
- New York style variant with custom color system for light/dark modes

**Key UI Patterns:**
- Calendar grid view and list view for event browsing
- Detailed event pages with AI analysis and scenario cards
- Interactive price path charts using Recharts
- Filter sidebar for event type, status, and date range filtering
- Watchlist management for tracking events of interest

**State Management:**
- React Query for API data fetching, caching, and invalidation
- Local component state for UI interactions (view modes, filters, search)
- Session-based authentication state

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Node.js runtime
- Session-based authentication using Passport.js with OpenID Connect (Replit Auth)
- PostgreSQL session store (connect-pg-simple)

**API Design:**
- RESTful API endpoints under `/api` namespace
- Authentication middleware protecting user-specific routes
- CRUD operations for companies, trials, events, watchlist items
- AI analysis generation endpoint (POST `/api/ai-analysis/:eventId`)

**Authentication Flow:**
- OpenID Connect integration with Replit's identity provider
- Session cookies with HTTP-only, secure flags
- Middleware-based route protection (`isAuthenticated`)
- User profile syncing with database on login

**Data Models:**
- Users: Authentication and profile information
- Companies: Biotech companies with tickers, market cap, sector
- Trials: Clinical trials with NCT IDs, phase, design, endpoints
- Events: Calendar events (PDUFA, readouts, advisory committees) with status tracking
- AI Analyses: Generated insights with summary, key factors, scenarios, confidence scores
- Watchlist Items: User-specific event tracking

### External Dependencies

**Database:**
- Replit PostgreSQL database (development)
- Direct PostgreSQL connection using `pg` library
- Support for Supabase as alternative (for Vercel deployment)
- Schema includes sessions, users, companies, trials, events, ai_analyses, watchlist_items tables
- Timestamp handling with UTC conversion for consistent date operations
- Automatic schema initialization on startup

**AI Service:**
- OpenAI API (GPT-5 model) for generating event analysis
- Structured JSON responses with scenario-based forecasting
- Analysis includes: summary, key factors, bull/base/bear scenarios with probabilities
- Price path projections (30-day arrays) for each scenario

**Authentication Provider:**
- Replit OpenID Connect (OIDC) for user authentication
- Automatic user provisioning on first login
- Profile data syncing (email, name, profile image)

**Third-Party Libraries:**
- Recharts for data visualization (price path charts)
- date-fns for date manipulation and formatting
- Embla Carousel for UI carousels
- Zod for schema validation

**Development Tools:**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- Vite plugins for Replit integration (cartographer, dev banner, error overlay)

**Deployment:**
- Primary: Replit (native deployment with built-in PostgreSQL)
- Vercel: Supported (see VERCEL_QUICK_START.md and VERCEL_DEPLOYMENT.md)
- Render: Supported (see RENDER_DEPLOYMENT.md)
- Environment variables: 
  - Required: DATABASE_URL (or SUPABASE_URL + SUPABASE_ANON_KEY), SESSION_SECRET
  - Optional: OPENAI_API_KEY, ISSUER_URL, REPL_ID
- Build process: `npm run build` creates bundled server and client assets
- Production start: `npm start` runs compiled server from dist/

## Recent Changes

### 2025-01-13: Vercel Deployment Support & Database Migration

- Migrated from Supabase-only to flexible database setup:
  - Primary: Direct PostgreSQL connection via `pg` library
  - Alternative: Supabase (for easy Vercel deployment)
- Created Vercel deployment configuration:
  - `vercel.json` - Vercel build and routing configuration
  - `VERCEL_QUICK_START.md` - Quick deployment guide
  - `VERCEL_DEPLOYMENT.md` - Comprehensive deployment documentation
  - `.env.example` - Environment variable template
- Added PostgreSQL storage layer (`server/pg-storage.ts`)
- Made OpenAI API key optional (app works without AI features)
- Made Supabase credentials optional (no longer throws errors if missing)
- Created database initialization script (`server/db.ts`)
- Updated authentication to support multiple deployment environments