# Setup Guide

## Project Structure

```
eval-ai/
├── client/             # React frontend
│   └── src/
│       ├── api/        # API client
│       ├── components/ # React components
│       └── lib/        # Utilities
├── server/             # Express backend
│   └── index.ts
├── db/                 # Database schema and types
│   ├── schema.ts       # Drizzle ORM schema
│   ├── index.ts        # Database client
│   └── types/          # Shared TypeScript types
├── drizzle/            # Generated migrations
└── package.json        # Root package.json
```

## Prerequisites

- Node.js 18+
- Neon DB account

## Installation Steps

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Neon DB connection string:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/judging_app?sslmode=require
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Generate and Push Database Schema

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start Development Servers

```bash
# Start both client and server
npm run dev

# Or start them separately:
npm run dev:client  # Runs on http://localhost:5173
npm run dev:server  # Runs on http://localhost:3001
```

## Available Scripts

- `npm run dev` - Start both client and server concurrently
- `npm run dev:client` - Start Vite dev server
- `npm run dev:server` - Start Express server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run type-check` - Check TypeScript types
- `npm run clean` - Clean build artifacts

## Database Setup with Neon

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file
5. Run `npm run db:push` to create tables

## Next Steps

Once the setup is complete, you can:

1. **Create Organizations**: Add organizations with custom application forms
2. **Build Rubrics**: Define evaluation criteria and scoring systems
3. **Manage Applicants**: Add applicants and their applications
4. **Evaluate Applications**: Score applications using rubrics
5. **Cross-Org Mapping**: Map fields between different organizations

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
- Verify your `DATABASE_URL` is correct
- Ensure your Neon project is active
- Check that you have network access to Neon

### Port Already in Use

The server automatically finds an available port between 3000-3100 if the preferred port is in use. Vite will also automatically find an available port if 5173 is taken.

If you need to manually specify ports:
- Change `PORT` in `.env` for the server's preferred port
- If the server uses a different port, update `VITE_API_URL` in `.env` for the client proxy

### TypeScript Errors

Run type checking:
```bash
npm run type-check
```

## Development Tips

- The API is available at `http://localhost:3001/api`
- Vite dev server proxies `/api` requests to the Express server
- Use Drizzle Studio to inspect/modify data: `npm run db:studio`
- Check server logs for API errors
- Client uses Tailwind CSS with shadcn/ui components

## Project Features

### Current Implementation

✅ Database schema with Drizzle ORM
✅ Express API server
✅ React client with Vite
✅ Organizations CRUD
✅ Basic routing structure
✅ Type-safe API client

### To Be Implemented

- [ ] Complete UI components (rubrics, applicants, applications, evaluations)
- [ ] Form builder for organization applications
- [ ] Rubric builder with multiple scoring types
- [ ] Evaluation interface
- [ ] Field mapping between organizations
- [ ] Authentication with Neon Auth/Stack Auth
- [ ] Dashboard with statistics
- [ ] Export functionality
