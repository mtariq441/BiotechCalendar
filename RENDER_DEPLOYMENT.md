# Deploy to Render Guide

This guide will help you deploy your Biotech Calendar application to Render.

## Prerequisites

1. A [Render account](https://dashboard.render.com)
2. Your Supabase project set up with the database schema
3. An OpenAI API key
4. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure your `.gitignore` file includes:
```
node_modules
.env
*.log
dist
.replit
.config
.upm
```

Push all your code to your Git repository.

## Step 2: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Configure the service:
   - **Name:** `biotech-calendar` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or your choice)

## Step 3: Configure Environment Variables

In the Render dashboard, go to the **Environment** tab and add these variables:

### Required Environment Variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `NODE_ENV` | `production` | Set manually |
| `PORT` | `10000` | Render default (can leave blank) |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API (anon/public key) |
| `OPENAI_API_KEY` | `sk-...` | OpenAI Platform → API Keys |

### Optional Environment Variables (if using Replit Auth):

If you're deploying outside Replit and want to use Replit Auth, you'll need to replace the auth system with a standard authentication solution like:
- Auth0
- Supabase Auth
- Passport.js with local strategy

**For Supabase Auth**, add:
| Variable Name | Value |
|--------------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Get from Supabase → Settings → API (service_role key) |

## Step 4: Update Code for Production

The app is already configured to work on Render. The server listens on `process.env.PORT` which Render provides automatically.

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your app
   - Start the server
3. Monitor the deployment in the **Logs** tab
4. Once deployed, your app will be available at: `https://your-app-name.onrender.com`

## Step 6: Verify Deployment

Test your deployment:
```bash
# Health check
curl https://your-app-name.onrender.com/

# Test API
curl https://your-app-name.onrender.com/api/companies
```

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Check that all dependencies are in `dependencies` (not `devDependencies`) in `package.json`

### Issue: "Port already in use"
**Solution:** Ensure your server uses `process.env.PORT` (already configured)

### Issue: "Database connection failed"
**Solution:** Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct in environment variables

### Issue: "OpenAI API error"
**Solution:** Verify `OPENAI_API_KEY` is set correctly

## Continuous Deployment

Render automatically redeploys when you push to your connected Git branch:
```bash
git add .
git commit -m "Update app"
git push origin main
```

## Production Checklist

- ✅ All environment variables set in Render
- ✅ Supabase database tables created (run `supabase-schema.sql`)
- ✅ OpenAI API key has sufficient credits
- ✅ Build command succeeds
- ✅ App accessible at Render URL
- ✅ Test all major features (calendar, events, AI analysis, watchlist)

## Scaling

For production use, consider upgrading to:
- **Starter Plan** ($7/month) - Better performance, no sleep
- **Standard Plan** ($25/month) - More memory and CPU
- **Professional Plan** ($85/month) - Autoscaling and priority support

## Monitoring

- View logs in Render Dashboard → Your Service → **Logs**
- Set up health checks in Render Dashboard → **Settings** → **Health Check Path**: `/`
- Monitor Supabase usage in Supabase Dashboard

## Support

- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs

Your biotech calendar is now live! 🚀
