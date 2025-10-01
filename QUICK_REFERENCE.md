# Quick Reference - TitanScores Platform

## 🚀 Common Commands

### Start the Application
```bash
npm run dev
```
Access at: http://localhost:5174

### Database Operations
```bash
npm run db:generate          # Generate migrations
npm run db:push              # Apply schema to database
npm run db:seed              # Seed Titan100 org & rubric
npm run db:seed:applications # Seed sample applications
npm run db:studio            # Open database GUI
```

### Development
```bash
npm run dev:client           # Frontend only
npm run dev:server           # Backend only
npm run type-check           # Check TypeScript
npm run lint                 # Run ESLint
```

## 📍 Important URLs

| Resource | URL |
|----------|-----|
| **Home Page** | http://localhost:5174 |
| **Judge Dashboard** | http://localhost:5174/judge?org=2 |
| **Score Application** | http://localhost:5174/judge/score/:id?org=2 |
| **Backend API** | http://localhost:3001/api |
| **Health Check** | http://localhost:3001/api/health |

## 🗂️ Key Files & Directories

### Frontend
```
client/src/
├── pages/
│   ├── HomePage.tsx              # Landing page with Quick Access
│   ├── JudgeDashboard.tsx        # Judge dashboard
│   └── ApplicationScoring.tsx    # Scoring interface
├── components/judging/
│   ├── ApplicationDisplay.tsx    # Application viewer
│   ├── ScoringForm.tsx          # Scoring form
│   └── Titan100Context.tsx      # Context display
└── api/judging.ts               # API client functions
```

### Backend
```
server/
├── index.ts                     # Main server & base routes
└── routes/extended-routes.ts    # AI/Bias/Workflow routes
```

### Database
```
db/
├── schema.ts                    # Base tables
├── extended-schema.ts           # Extended tables
├── seed-titan100.ts            # Org & rubric seed
└── seed-sample-applications.ts # Sample data seed
```

### AI System
```
ai-agents/
├── agents/
│   ├── sotruth-scoring-agent.ts    # AI scoring
│   └── bias-analysis-agent.ts      # Bias detection
└── config/agent-config.ts          # Agent settings
```

## 🎯 Judge Portal Workflow

### 1. Access Judge Dashboard
```
Navigate to: http://localhost:5174
Click: "Judge Portal" card
OR
Go directly to: /judge?org=2
```

### 2. Score an Application
```
1. Click "Score Application" on any application
2. Tab 1: Read the full application
3. Tab 2: Score each criterion (1-5)
4. Tab 3: Reference context & guidelines
5. Submit evaluation
```

### 3. View Evaluations
```
Applications with green "Evaluated" badge are completed
Click "View Evaluation" to review your scores
```

## 🗄️ Database Tables

### Base Tables
- `organizations` - Award programs
- `rubrics` - Scoring criteria
- `applicants` - Candidate information
- `applications` - Submissions
- `evaluations` - Judge scores

### Extended Tables
- `ai_evaluations` - AI scores
- `bias_analyses` - Bias reports
- `scoring_workflows` - Workflow tracking
- `titan100_org_data` - Titan100 config
- `judge_performance` - Judge metrics
- `comparison_dashboard_data` - Analytics
- `pdf_documents` - Org documents

## 🔌 API Endpoints

### Organizations
```
GET    /api/organizations
GET    /api/organizations/:id
POST   /api/organizations
PUT    /api/organizations/:id
DELETE /api/organizations/:id
```

### Applications & Evaluations
```
GET    /api/applications?organizationId=:id
GET    /api/evaluations?applicationId=:id
POST   /api/evaluations
```

### Titan100
```
GET    /api/rubrics?organizationId=:id
GET    /api/titan100-data/:organizationId
```

### Extended Features
```
GET    /api/ai-evaluations
POST   /api/ai-evaluations/score
GET    /api/bias-analyses
POST   /api/bias-analyses/run
GET    /api/scoring-workflows
```

## 📊 Sample Data

### Organizations
- **ID 2**: Titan CEO - Chicago Titan 100

### Applications (after seeding)
1. **Application #2**: Sarah Chen - TechVentures Inc
2. **Application #3**: Michael Rodriguez - Finance Solutions Group
3. **Application #4**: Jennifer Thompson - HealthTech Solutions

### Rubrics
- **ID 1**: Titan100 First Year Judging Rubric
  - 4 criteria, 25% weight each
  - Score scale: 1-5
  - Max total: 25 points

## 🏗️ Tech Stack Quick Ref

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI Components** | Radix UI + Tailwind CSS |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Zod |
| **State** | Zustand |
| **Backend** | Express.js + TypeScript |
| **Database** | Neon PostgreSQL (serverless) |
| **ORM** | Drizzle ORM |
| **AI** | Anthropic Claude Sonnet 4.5 |
| **Agent SDK** | Claude Agent SDK |

## 🐛 Troubleshooting

### Application won't start
```bash
# Install dependencies
npm install

# Check environment variables
cat .env

# Restart servers
npm run dev
```

### Database connection error
```bash
# Verify DATABASE_URL in .env
# Check Neon console for database status
# Test connection:
npm run db:studio
```

### No applications showing
```bash
# Seed the database
npm run db:seed              # Titan100 org & rubric
npm run db:seed:applications # Sample applications
```

### Port already in use
```bash
# Frontend auto-finds available port (5174, 5175, etc.)
# Backend: Change PORT in .env
# Or kill process using port:
lsof -ti:3001 | xargs kill
```

### TypeScript errors
```bash
# Run type check
npm run type-check

# Common fixes:
# - Check import paths use @/ alias
# - Verify types in client/src/api/judging.ts
# - Check .tsx extension for React components
```

## 📚 Documentation Links

- **[Judge Guide](./JUDGE_GUIDE.md)** - How to use judge portal
- **[Architecture](./ARCHITECTURE.md)** - System design
- **[AI Agents](./ai-agents/README.md)** - AI system docs
- **[Main README](./README.md)** - Full documentation

## 🔑 Environment Variables

Required in `.env`:
```env
DATABASE_URL=postgresql://...       # Neon database URL
PORT=3001                          # Backend port
ANTHROPIC_API_KEY=sk-ant-...       # For AI agents (optional)
```

## 🎨 UI Component Library

Using Radix UI primitives with Tailwind styling:
- `Button` - Primary actions
- `Card` - Content containers
- `Badge` - Status indicators
- `Tabs` - Tabbed interfaces
- `RadioGroup` - Score selection
- `Textarea` - Text input
- `Label` - Form labels
- `Alert` - Messages & notifications

## 📱 Responsive Breakpoints

Tailwind breakpoints used:
- `md:` - 768px+ (tablets)
- `lg:` - 1024px+ (desktops)

Most layouts use:
```
grid md:grid-cols-2 lg:grid-cols-3
```

## 🚦 Development Workflow

1. **Start Dev Servers**: `npm run dev`
2. **Make Changes**: Edit files (HMR auto-reloads)
3. **Check Types**: `npm run type-check`
4. **Test in Browser**: http://localhost:5174
5. **Check Backend**: http://localhost:3001/api/health
6. **Commit Changes**: Standard git workflow

## 🎯 Scoring Scale Reference

| Score | Label | Meaning |
|-------|-------|---------|
| **1** | Poor | No clear evidence, incomplete |
| **2** | Needs Improvement | Limited, vague, weak |
| **3** | Satisfactory | Basic, general, adequate |
| **4** | Good | Clear, solid, well-developed |
| **5** | Outstanding | Exceptional, inspiring, detailed |

**Total Score Range**: 1.0 - 5.0 (or 5 - 25 points)

## 🔄 Hot Reload

Changes to these files trigger auto-reload:
- `.tsx` files → Frontend HMR
- `.ts` files in `server/` → Backend restart
- `.css` files → Style injection
- Database schema → Requires manual `npm run db:push`

## 📦 Key Dependencies

Frontend:
- `react` / `react-dom` - UI framework
- `react-router-dom` - Routing
- `@radix-ui/*` - UI primitives
- `axios` - HTTP client
- `zod` - Validation

Backend:
- `express` - Web server
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - DB driver
- `dotenv` - Environment config

AI:
- `@anthropic-ai/claude-agent-sdk` - Agent framework
- `@anthropic-ai/sdk` - Claude API

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Anthropic Claude](https://docs.anthropic.com/)

---

**Last Updated**: October 2025
**Platform Version**: 1.0.0
