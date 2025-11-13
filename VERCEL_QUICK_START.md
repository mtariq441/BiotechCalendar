# Quick Start: Deploy to Vercel

Follow these steps to deploy your BioCalendar app to Vercel in under 10 minutes.

## Step 1: Database Setup (Choose One)

### Option A: Use Supabase (Easiest)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > Database
4. Copy your connection string
5. Go to SQL Editor and run the schema from `supabase-schema.sql`
6. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API

### Option B: Use Vercel Postgres

1. Deploy to Vercel first (see Step 3)
2. In your Vercel project, go to Storage tab
3. Create a Postgres database
4. Connect it to your project (auto-configures DATABASE_URL)
5. Run the schema manually via Vercel's database interface

### Option C: Use Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create account
2. Create a new project
3. Copy the connection string
4. Run the schema from `supabase-schema.sql`

## Step 2: Prepare Environment Variables

Create these environment variables (you'll add them to Vercel in Step 3):

```bash
# REQUIRED: Database (choose one option)

# If using Supabase:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# OR if using direct PostgreSQL:
DATABASE_URL=postgresql://user:password@host:5432/database

# REQUIRED: Session secret (generate random 32+ chars)
SESSION_SECRET=replace-with-random-string-min-32-chars

# OPTIONAL: OpenAI for AI features
OPENAI_API_KEY=sk-your-key-here

# OPTIONAL: For custom auth (not needed initially)
# ISSUER_URL=https://your-auth-provider.com/oidc
# REPL_ID=your-client-id
```

## Step 3: Deploy to Vercel

### Method 1: Deploy from Git (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/biocalendar.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add all the variables from Step 2
   - Click "Add" for each variable
6. Click "Deploy"

### Method 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables via CLI or dashboard
vercel env add SESSION_SECRET
vercel env add DATABASE_URL
# ... add others as needed

# Redeploy with env vars
vercel --prod
```

## Step 4: Post-Deployment

1. **Test the deployment**: Visit your Vercel URL
2. **Check database connection**: The app should seed sample data on first run
3. **Configure custom domain** (optional): In Vercel dashboard > Settings > Domains

## Troubleshooting

### "SUPABASE_URL must be set" Error

- Make sure you've added either `SUPABASE_URL` + `SUPABASE_ANON_KEY` OR `DATABASE_URL`
- Redeploy after adding environment variables

### Database Connection Failed

- Verify your connection string is correct
- Check that your database allows connections from Vercel IPs
- For Supabase: Make sure connection pooling is enabled

### Build Failed

- Check the build logs in Vercel dashboard
- Make sure all dependencies are installed
- Try running `npm run build` locally first

### Authentication Not Working

- The Replit Auth won't work on Vercel
- You'll need to implement alternative auth (Auth0, Clerk, NextAuth) or disable auth for testing
- For testing without auth, you can comment out `isAuthenticated` middleware temporarily

## What Gets Deployed

- **Frontend**: Static React app built with Vite
- **API**: Serverless functions handling all `/api/*` routes
- **Database**: External PostgreSQL (Supabase, Vercel, or Neon)

## Cost Estimate

- **Vercel**: Free tier (100GB bandwidth, unlimited functions)
- **Supabase**: Free tier (500MB database, 2GB transfer)
- **Neon**: Free tier (3GB storage, 100 hours compute/month)
- **OpenAI**: Pay-per-use (optional, ~$0.01 per analysis)

**Total**: $0/month for small projects (free tiers)

## Next Steps

- Set up custom domain
- Configure OAuth for authentication
- Monitor usage in Vercel dashboard
- Set up error tracking (Sentry, LogRocket, etc.)

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Join Discord or post an issue for support
