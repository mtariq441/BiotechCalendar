# Supabase Database Setup Instructions

Follow these steps to set up your database in Supabase:

## Step 1: Access Supabase SQL Editor
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Click on "SQL Editor" in the left sidebar

## Step 2: Run the Schema
1. Open the file `supabase-schema.sql` in this project
2. Copy all the SQL content
3. In the Supabase SQL Editor, paste the SQL
4. Click "Run" to execute the schema

## Step 3: Verify Tables Created
1. Click on "Table Editor" in the left sidebar
2. You should see the following tables:
   - sessions
   - users
   - companies
   - trials
   - events
   - ai_analyses
   - watchlist_items

## Step 4: Enable Row Level Security (Optional but Recommended)
For production use, you may want to enable Row Level Security (RLS) on your tables:
1. Go to "Authentication" → "Policies" in Supabase
2. Enable RLS for each table
3. Create appropriate policies based on your security requirements

## Done!
Your database is now set up and ready to use with your biotech calendar application.
