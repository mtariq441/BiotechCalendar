# Deploying BioCalendar to Vercel

This guide explains how to deploy your BioCalendar application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, Neon, or any other PostgreSQL provider)
3. An OpenAI API key (optional, for AI analysis features)

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Create a new Postgres database
4. Vercel will automatically set the `DATABASE_URL` environment variable

### Option 2: External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database with your provider
2. Run the schema from `supabase-schema.sql` to set up tables
3. Add the `DATABASE_URL` to Vercel environment variables

## Environment Variables

Configure these environment variables in your Vercel project settings:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Session Secret (generate a random string)
SESSION_SECRET=your-secret-key-min-32-chars

# Authentication (if using custom OAuth)
ISSUER_URL=https://your-auth-provider.com/oidc
REPL_ID=your-client-id
```

### Optional Variables

```bash
# OpenAI (for AI analysis features)
OPENAI_API_KEY=sk-...

# Supabase (alternative to direct PostgreSQL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Deployment Steps

### Method 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Method 2: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables
5. Click "Deploy"

### Method 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git repository or upload files
4. Configure environment variables
5. Click "Deploy"

## Build Configuration

The project is configured to build automatically on Vercel with these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/client`
- **Install Command**: `npm install`

## Post-Deployment Steps

1. **Initialize Database**: After first deployment, run the database initialization:
   - The tables will be created automatically on first run
   - Or manually run the SQL from `supabase-schema.sql`

2. **Seed Sample Data** (Optional):
   - The application includes sample biotech events
   - Data is seeded automatically in development mode

3. **Configure Authentication**:
   - Update OAuth callback URLs to point to your Vercel domain
   - Update `ISSUER_URL` if using custom authentication

## Custom Domain

To use a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correctly set
- Check that your database allows connections from Vercel's IP addresses
- Ensure SSL is properly configured if required

### Build Failures

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript types are correct

### Authentication Issues

- Update OAuth callback URLs to match your Vercel domain
- Verify `SESSION_SECRET` is set and is at least 32 characters
- Check that `ISSUER_URL` and `REPL_ID` are correct

## Environment-Specific Features

### Replit vs Vercel Differences

- **Replit**: Uses Replit Auth with automatic OAuth setup
- **Vercel**: Requires manual OAuth configuration or alternative auth provider

If you're migrating from Replit to Vercel, you'll need to:
1. Set up your own OAuth provider or use a service like Auth0, Clerk, or NextAuth
2. Update the authentication code in `server/replitAuth.ts`

## Monitoring

- View logs in Vercel Dashboard > Deployments > [Your Deployment] > Functions
- Set up alerts for errors and performance issues
- Monitor database performance in your database provider's dashboard

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 6000 build minutes
- **Database**: Varies by provider (Vercel Postgres, Supabase, Neon all have free tiers)
- **OpenAI**: Pay per API call (optional feature)

## Support

For issues specific to:
- Vercel deployment: https://vercel.com/docs
- PostgreSQL: Your database provider's documentation
- Application issues: Check the project README
