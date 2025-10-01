# Quick Start Guide

## ⚠️ Important: Set Up Your Database First!

Before running the app, you need to configure your Neon database connection.

### Step 1: Get Your Neon Database URL

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (or use an existing one)
3. Copy your connection string

### Step 2: Update the .env File

Open `.env` in the root directory and replace the placeholder DATABASE_URL:

```env
DATABASE_URL=your_actual_neon_connection_string_here
```

Your connection string should look like:
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Step 3: Push Database Schema

```bash
npm run db:push
```

This creates all the necessary tables in your database.

### Step 4: Start the Application

```bash
npm run dev
```

Both the client and server will start automatically and find available ports.

## What You'll See

```
🚀 Server running on http://localhost:3002
📊 API available at http://localhost:3002/api
🗄️  Database: Neon PostgreSQL

VITE v6.3.6  ready in 415 ms
➜  Local:   http://localhost:5174/
```

The ports may be different if 3001/5173 are already in use.

## Verify It's Working

1. Open the Local URL shown by Vite (e.g., http://localhost:5174)
2. You should see the "Multi-Org Judging System" page
3. With styling and a clean interface

## Troubleshooting

### "DATABASE_URL is not set" Error

Make sure you:
1. Created the `.env` file in the root directory
2. Added your actual Neon connection string
3. Restarted the dev server

### No Styling

If you see unstyled content:
1. Make sure Tailwind CSS is working
2. Check the browser console for errors
3. Try clearing cache and reloading

### Port Conflicts

The app automatically finds available ports. Check the terminal output to see which ports are being used.

## Next Steps

Once everything is running:

1. **Create an Organization** - Use the API or add a form to create your first organization
2. **Build Rubrics** - Define evaluation criteria
3. **Add Applicants** - Manage applicant data
4. **Start Evaluating** - Score applications using your rubrics

## Need Help?

Check the full [SETUP.md](./SETUP.md) for detailed information.
