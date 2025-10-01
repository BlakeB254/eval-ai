# System Architecture - TitanScores Platform

## Overview

TitanScores is a **dual-track bias-minimized judging platform** that combines human expertise with AI-powered evaluation to ensure fairness in award adjudication.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  - Judge Portal UI                                              │
│  - Application Display                                          │
│  - Scoring Forms                                                │
│  - Context Display                                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
│  - API Routes (organizations, applications, evaluations)        │
│  - Extended Routes (AI, bias, workflows, Titan100)             │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼────────┐
│   Database   │  │  AI Agents    │
│  (Neon PG)   │  │  (Claude SDK) │
│              │  │               │
│ - Base       │  │ - SoTruth     │
│ - Extended   │  │ - Bias        │
│ - Titan100   │  │ - Validator   │
└──────────────┘  └───────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Radix UI** - Accessible components
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form + Zod** - Form validation

### Backend
- **Express.js** - Web server
- **TypeScript** - Type safety
- **Drizzle ORM** - Database queries
- **Neon PostgreSQL** - Serverless database
- **dotenv** - Environment config

### AI System
- **Anthropic Claude Sonnet 4.5** - Language model
- **Claude Agent SDK** - Agent framework
- **Zod** - Schema validation

## Directory Structure

```
eval-ai/
├── client/                    # Frontend application
│   └── src/
│       ├── api/              # API client functions
│       │   ├── client.ts     # Axios config
│       │   └── judging.ts    # Judge portal API
│       ├── components/       # React components
│       │   ├── judging/      # Judge-specific components
│       │   │   ├── ApplicationDisplay.tsx
│       │   │   ├── ScoringForm.tsx
│       │   │   └── Titan100Context.tsx
│       │   └── ui/           # Base UI components
│       ├── pages/            # Page components
│       │   ├── HomePage.tsx
│       │   ├── JudgeDashboard.tsx
│       │   └── ApplicationScoring.tsx
│       └── App.tsx           # Main app & routing
│
├── server/                    # Backend application
│   ├── routes/
│   │   └── extended-routes.ts # AI/Bias/Workflow routes
│   └── index.ts              # Express server
│
├── db/                        # Database layer
│   ├── schema.ts             # Base tables
│   ├── extended-schema.ts    # Extended tables
│   ├── seed-titan100.ts      # Org & rubric seed
│   ├── seed-sample-applications.ts
│   └── index.ts              # DB client
│
├── ai-agents/                 # AI agents system
│   ├── agents/               # Agent implementations
│   │   ├── sotruth-scoring-agent.ts
│   │   └── bias-analysis-agent.ts
│   ├── config/               # Agent configurations
│   │   └── agent-config.ts
│   └── types.ts              # Type definitions
│
└── drizzle/                   # Database migrations
```

## Data Flow - Human Scoring

### 1. Judge Accesses Dashboard

```
User navigates to /judge?org=2
    ↓
JudgeDashboard component loads
    ↓
Fetches from API:
  - GET /api/organizations/2
  - GET /api/applications?organizationId=2
  - GET /api/evaluations?applicationId=X (for each app)
    ↓
Displays applications with status
```

### 2. Judge Scores Application

```
User clicks "Score Application"
    ↓
Navigate to /judge/score/:id?org=2
    ↓
ApplicationScoring component loads
    ↓
Fetches from API:
  - GET /api/applications/:id
  - GET /api/organizations/:id
  - GET /api/rubrics?organizationId=2
  - GET /api/titan100-data/:id
  - GET /api/evaluations?applicationId=:id
    ↓
Displays three-tab interface:
  1. Application (read responses)
  2. Scoring (interactive form)
  3. Context (guidelines)
```

### 3. Judge Submits Evaluation

```
User fills out scoring form
    ↓
Selects 1-5 for each of 4 criteria
    ↓
Form calculates total score
    ↓
User clicks "Submit Evaluation"
    ↓
POST /api/evaluations
    ↓
Backend validates & saves to database
    ↓
Success message shown
    ↓
Dashboard updates to show "Evaluated"
```

## Database Schema

### Base Tables (schema.ts)

```sql
organizations
├── id (serial)
├── name (text)
├── description (text)
├── contact_info (jsonb)
├── application_structure (jsonb)
└── timestamps

rubrics
├── id (serial)
├── organization_id (int FK)
├── name (text)
├── description (text)
├── criteria (jsonb)      -- Array of criteria with weights
├── scoring_type (text)
├── scoring_config (jsonb)
└── created_at

applicants
├── id (serial)
├── first_name, last_name, email
├── company, title
├── metadata (jsonb)
└── timestamps

applications
├── id (serial)
├── applicant_id (int FK)
├── organization_id (int FK)
├── submission_data (jsonb)  -- All responses
└── submitted_at

evaluations
├── id (serial)
├── application_id (int FK)
├── rubric_id (int FK)
├── judge_name (text)
├── criterion_scores (jsonb) -- Array of scores
├── total_score (real)
├── comments (text)
└── evaluated_at
```

### Extended Tables (extended-schema.ts)

```sql
ai_evaluations           -- AI scoring results
bias_analyses            -- Bias detection reports
scoring_workflows        -- Track dual-track progress
titan100_org_data        -- Titan100-specific config
judge_performance        -- Judge consistency metrics
comparison_dashboard_data -- Pre-computed analytics
pdf_documents            -- Stored org documents
```

## API Routes

### Base Routes (server/index.ts)

```
GET    /api/organizations          - List orgs
GET    /api/organizations/:id      - Get org
POST   /api/organizations          - Create org
PUT    /api/organizations/:id      - Update org
DELETE /api/organizations/:id      - Delete org

GET    /api/rubrics                - List rubrics (filter by org)
POST   /api/rubrics                - Create rubric

GET    /api/applicants             - List applicants
POST   /api/applicants             - Create applicant

GET    /api/applications           - List applications (filter by org/applicant)
POST   /api/applications           - Create application

GET    /api/evaluations            - List evaluations (filter by app)
POST   /api/evaluations            - Create evaluation
```

### Extended Routes (server/routes/extended-routes.ts)

```
GET    /api/pdf-documents          - List PDFs
POST   /api/pdf-documents          - Upload PDF

GET    /api/ai-evaluations         - List AI scores
POST   /api/ai-evaluations/score   - Trigger AI scoring

GET    /api/bias-analyses          - List bias analyses
POST   /api/bias-analyses/run      - Run bias analysis

GET    /api/scoring-workflows      - List workflows
POST   /api/scoring-workflows      - Create workflow
PUT    /api/scoring-workflows/:id  - Update workflow

GET    /api/titan100-data/:id      - Get Titan100 config
GET    /api/judge-performance      - Get judge metrics
GET    /api/dashboard/comparison   - Get comparison data
```

## AI Agents System

### Agent Types

**1. SoTruth Scoring Agent**
- **Purpose**: Objective, consistent application scoring
- **Model**: Claude Sonnet 4.5
- **Temperature**: 0.3 (low for consistency)
- **Input**: Application data + rubric
- **Output**: Structured evaluation with scores and reasoning

**2. Bias Analysis Agent**
- **Purpose**: Compare human vs AI scores
- **Model**: Claude Sonnet 4.5
- **Temperature**: 0.4 (slightly higher for analysis)
- **Input**: Human evaluations + AI evaluations
- **Output**: Correlation metrics, discrepancy reports, bias indicators

**3. Application Validator Agent** (planned)
- **Purpose**: Check eligibility requirements
- **Model**: Claude Sonnet 4.5
- **Temperature**: 0.2 (very low for rule-checking)

### Agent Configuration

```typescript
// ai-agents/config/agent-config.ts
export const soTruthAgentConfig: AgentConfig = {
  name: 'SoTruth Scoring Agent',
  model: 'claude-sonnet-4-5-20250929',
  temperature: 0.3,
  systemPrompt: `You are the SoTruth AI Scoring Agent...`,
  tools: ['Read', 'Write'],
};
```

## Dual-Track Workflow

### Phase 1: Human Scoring (COMPLETED)
```
1. Judge accesses portal
2. Reviews application
3. Scores using rubric
4. Submits evaluation
   ↓
   Stored in evaluations table
```

### Phase 2: AI Scoring (INFRASTRUCTURE READY)
```
1. Trigger AI evaluation
2. SoTruth agent processes application
3. Generates objective scores
4. Stores in ai_evaluations table
```

### Phase 3: Bias Analysis (FUTURE)
```
1. System compares human vs AI scores
2. Bias Analysis agent identifies patterns
3. Generates report with:
   - Correlation coefficients
   - Score discrepancies
   - Bias indicators (halo effect, leniency, etc.)
4. Stores in bias_analyses table
```

### Phase 4: Governance Review (FUTURE)
```
1. Review comparison dashboard
2. Examine flagged discrepancies
3. Make final decisions
4. Document rationale
```

## State Management

### Frontend State

**React Hooks:**
- `useState` - Component-level state
- `useEffect` - Side effects & data loading
- `useNavigate` - Programmatic navigation
- `useSearchParams` - URL query parameters

**Example:**
```typescript
const [applications, setApplications] = useState<Application[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    const apps = await getApplications(orgId);
    setApplications(apps);
    setLoading(false);
  }
  loadData();
}, [orgId]);
```

### Backend State

**Database Connection:**
```typescript
// db/index.ts
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema: fullSchema });
```

**Request Handling:**
```typescript
app.get('/api/applications', async (req, res) => {
  const { organizationId } = req.query;
  const apps = await db
    .select()
    .from(applications)
    .where(eq(applications.organizationId, parseInt(organizationId)));
  res.json({ success: true, data: apps });
});
```

## Security Considerations

### Current Implementation
- CORS enabled for development
- Input validation with Zod schemas
- Database constraints prevent invalid data
- Type safety with TypeScript

### Future Enhancements
- Authentication & authorization
- Role-based access control (RBAC)
- Judge identity management
- API rate limiting
- Input sanitization
- SQL injection prevention (using Drizzle ORM)

## Performance Optimization

### Current
- Efficient database queries with Drizzle ORM
- Neon serverless PostgreSQL auto-scaling
- React component memoization where needed
- Vite for fast development builds

### Future
- API response caching
- Pre-computed dashboard metrics
- Database indexing on frequently queried columns
- Code splitting for large components
- Image optimization
- CDN for static assets

## Deployment Architecture

### Development
```
Frontend: Vite dev server (port 5174)
Backend: tsx watch (port 3001)
Database: Neon cloud (WebSocket)
```

### Production (Recommended)
```
Frontend: Vercel/Netlify static hosting
Backend: Railway/Render Node.js hosting
Database: Neon PostgreSQL production tier
AI Agents: Serverless functions or background workers
```

## Future Enhancements

### Short Term
1. **Comparison Dashboard** - Visual comparison of human vs AI scores
2. **Judge Authentication** - Login system for judges
3. **Email Notifications** - Notify judges of new applications
4. **Export Reports** - Download evaluations as PDF/CSV

### Medium Term
1. **Real-time AI Scoring** - Trigger AI evaluation alongside human scoring
2. **Batch Processing** - Score multiple applications at once
3. **Judge Calibration** - Training mode with example applications
4. **Mobile Responsive** - Optimize for tablet/phone judging

### Long Term
1. **Multi-Organization Support** - Handle multiple award programs
2. **Advanced Analytics** - ML-powered insights on scoring patterns
3. **Collaborative Judging** - Multi-judge consensus tools
4. **Integration APIs** - Connect with external award platforms

## Troubleshooting

### Common Issues

**Database Connection Errors:**
- Check `.env` has valid `DATABASE_URL`
- Verify Neon database is active
- Check network connectivity

**API 404 Errors:**
- Ensure backend server is running on port 3001
- Check frontend `VITE_API_URL` if customized
- Verify route paths in `server/index.ts`

**Frontend Build Errors:**
- Run `npm install` to ensure all dependencies
- Check for TypeScript errors: `npm run type-check`
- Clear node_modules and reinstall if needed

**Data Not Loading:**
- Verify database is seeded: `npm run db:seed`
- Check browser DevTools console for errors
- Verify API responses in Network tab

## Additional Resources

- [Judge Guide](./JUDGE_GUIDE.md) - How to use the judge portal
- [AI Agents README](./ai-agents/README.md) - AI system details
- [Main README](./README.md) - Setup and overview
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Router Docs](https://reactrouter.com/)
- [Anthropic Claude Docs](https://docs.anthropic.com/)
