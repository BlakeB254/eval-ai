# Meta-Judge - AI-Powered Evaluation Platform

> **Judge the Judges - Bias Detection & Evaluation Quality Assurance**

A comprehensive judging platform that combines human expertise with AI-powered objective scoring to eliminate bias and ensure fairness in award evaluation processes.

## 🚀 Live Demo

**Demo URL**: `https://meta-judge.pages.dev` (Deploy instructions below)

## 🎯 Overview

Meta-Judge (formerly TitanScores) implements a **Dual-Track Bias-Minimized Judging Program** featuring:

- ✅ **Multi-Judge System**: 5 judge profiles with independent evaluation tracking
- ✅ **Organization Hierarchy**: Organization → Judge → Applications structure
- ✅ **Dual-Track Scoring**: Independent human and AI evaluation systems
- ✅ **Bias Detection & Analysis**: Quantitative bias measurement and reporting
- ✅ **Transparent Governance**: Complete audit trails and explainable decisions
- ✅ **Titan100 Integration**: Custom rubrics and organizational context
- ✅ **Scalable Architecture**: Built for growth and future award cycles

## 📦 Deployment to Cloudflare Pages

### Quick Deploy (Recommended)

1. **Create GitHub repository** (if not already done):
   ```bash
   # Repository is already initialized with git!
   # Just push to GitHub (instructions below)
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages → Create a project → Connect to Git
   - Select your GitHub repository
   - **Build settings**:
     - Build command: `npm run build`
     - Build output directory: `dist/public`
     - Root directory: `/`
   - Click **Save and Deploy**

3. **Your site will be live** at: `https://meta-judge.pages.dev`

### Alternative: Direct Upload

For quick demos without GitHub:
```bash
npm run build
npx wrangler pages deploy dist/public --project-name=meta-judge
```

See [CLOUDFLARE_DEPLOY_QUICK_START.md](./CLOUDFLARE_DEPLOY_QUICK_START.md) for detailed instructions.

## Technology Stack

**Frontend**
- React 18 + TypeScript + Vite
- Radix UI + Tailwind CSS
- TanStack React Table
- Zustand for state management
- React Hook Form + Zod validation

**Backend**
- Express.js + TypeScript
- Drizzle ORM
- Neon PostgreSQL (serverless)

**AI System**
- Anthropic Claude Sonnet 4.5
- Claude Agent SDK
- Custom agent orchestration

## 📁 Project Structure

```
eval-ai/
├── ai-agents/              # AI agents infrastructure ⭐ NEW
│   ├── agents/            # Agent implementations
│   ├── config/            # Agent configurations
│   ├── types.ts           # Type definitions
│   └── README.md          # AI agents documentation
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── api/           # API client
├── server/                 # Express backend
│   ├── routes/            # API routes
│   │   └── extended-routes.ts  # New AI/Bias routes ⭐ NEW
│   └── index.ts           # Express server
├── db/                     # Database layer
│   ├── schema.ts          # Base schema
│   ├── extended-schema.ts # Extended tables ⭐ NEW
│   ├── seed-titan100.ts   # Seed data ⭐ NEW
│   └── index.ts           # Database client
├── Titan100.pdf           # Judging instructions ⭐ NEW
├── Project_Brief_Judging_App_09.22.25.pdf  # Spec ⭐ NEW
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database
- Anthropic API key

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@host/database
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

3. **Generate and push database schema**
```bash
npm run db:generate
npm run db:push
```

4. **Seed the database with Titan100 data**
```bash
npm run db:seed
```

5. **Seed sample applications** (optional but recommended)
```bash
npm run db:seed:applications
```

6. **Start development servers**
```bash
npm run dev
```

- **Frontend**: http://localhost:5174 (or check terminal for actual port)
- **Backend**: http://localhost:3001

## 🚀 Quick Start - Using the Judge Portal

Once the servers are running:

1. **Open your browser** to http://localhost:5174
2. **Click "Judge Portal"** on the home page
3. **View applications** - See 3 sample applications ready to score
4. **Click "Score Application"** on any application
5. **Review the application** in the Application tab
6. **Score using the rubric** in the Scoring tab (1-5 for each of 4 criteria)
7. **Submit your evaluation** when complete

📖 **For detailed instructions**, see the [Judge Guide](./JUDGE_GUIDE.md)

### Key URLs

- **Home Page**: http://localhost:5174
- **Judge Dashboard**: http://localhost:5174/judge?org=2
- **API Documentation**: http://localhost:3001/api
- **Database UI**: Run `npm run db:studio`

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start both frontend + backend
npm run dev:client       # Frontend only
npm run dev:server       # Backend only

# Database
npm run db:generate          # Generate migrations
npm run db:push              # Push schema to database
npm run db:studio            # Open Drizzle Studio (DB GUI)
npm run db:seed              # Seed Titan100 org & rubric
npm run db:seed:applications # Seed sample applications

# Build & Deploy
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

## 🏆 Titan100 Integration

### Program Overview

The **Titan100** program recognizes 100 outstanding CEOs and C-level executives in Chicago who demonstrate:

- Exceptional Leadership
- Visionary Thinking
- Passion for Excellence
- Industry Influence

### Eligibility Requirements

- ✅ Business founded 3+ years ago
- ✅ Revenue over $1M
- ✅ C-suite title

### Judging Criteria (All weighted 25%)

1. **Entrepreneurial Journey** - Career timeline, obstacles overcome
2. **Company Vision** - 5-year goals and aspirations
3. **What Makes Them a Titan** - Unique qualities and contributions
4. **Accomplishments** - Awards, publications, achievements

### Scoring Scale

- 1 = Poor
- 2 = Needs Improvement
- 3 = Satisfactory
- 4 = Good
- 5 = Outstanding

**Maximum Score**: 25 points

## 🤖 AI Agents System

### SoTruth Scoring Agent

AI-powered evaluation that provides objective, consistent scoring.

```typescript
import { createSoTruthAgent } from './ai-agents/agents/sotruth-scoring-agent';

const agent = createSoTruthAgent();
const evaluation = await agent.scoreApplication({
  applicationId: 1,
  rubricId: 1,
  application: applicationData,
  rubric: rubricDefinition,
});
```

### Bias Analysis Agent

Compares human vs AI scores to detect bias patterns.

```typescript
import { createBiasAnalysisAgent } from './ai-agents/agents/bias-analysis-agent';

const agent = createBiasAnalysisAgent();
const analysis = await agent.analyzeBias({
  humanEvaluations,
  aiEvaluations,
  rubric,
});
```

See [ai-agents/README.md](./ai-agents/README.md) for detailed documentation.

## 📊 New Features

### Dual-Track System

- **Human Scoring App**: Judge dashboard, rubric-based scoring, workflow tracking
- **SoTruth AI App**: Automated evaluation, evidence-based reasoning, confidence scores
- **Comparison Dashboard**: Side-by-side analysis, bias detection, governance reporting

### Extended Database Schema

New tables:
- `pdf_documents` - Store organizational documents
- `ai_evaluations` - AI scoring results
- `bias_analyses` - Bias analysis reports
- `scoring_workflows` - Track evaluation progress
- `titan100_org_data` - Titan100-specific config
- `judge_performance` - Judge consistency metrics
- `comparison_dashboard_data` - Pre-computed analytics

### API Endpoints

New routes in `/api`:
- `/ai-evaluations` - AI scoring management
- `/bias-analyses` - Bias analysis
- `/scoring-workflows` - Workflow tracking
- `/titan100-data/:id` - Organization config
- `/pdf-documents` - Document management
- `/judge-performance` - Judge metrics
- `/dashboard/comparison` - Dashboard data

## 👨‍⚖️ Judge Portal Features

The Judge Portal (`/judge?org=2`) provides a complete interface for human judges to score applications:

### Features

- **Judge Dashboard**
  - View all applications for an organization
  - Track which applications have been evaluated
  - See pending applications requiring review
  - Summary statistics (total, evaluated, pending)

- **Application Scoring Interface**
  - **Application Tab**: Read full candidate responses
  - **Scoring Tab**: Interactive rubric with 1-5 scale for each criterion
  - **Context Tab**: Program guidelines, Titan definition, eligibility requirements

- **Rubric-Based Scoring**
  - 4 equally-weighted criteria (25% each)
  - Detailed descriptions for each score level (1-5)
  - Optional reasoning fields for documentation
  - Real-time total score calculation
  - Overall comments section

- **Evaluation Management**
  - Submit evaluations to database
  - View/update previous evaluations
  - Track evaluation status per application

### How to Access

1. **From Home Page**: Click the "Judge Portal" card
2. **Direct URL**: Navigate to `/judge?org=2`
3. **URL Parameter**: `org=2` specifies Titan100 organization

### Sample Data

Three realistic sample applications are included:
1. **Sarah Chen** - Technology (TechVentures Inc)
2. **Michael Rodriguez** - Financial Services (Finance Solutions Group)
3. **Jennifer Thompson** - Healthcare Technology (HealthTech Solutions)

Run `npm run db:seed:applications` to load them.

## 📖 Documentation

- **[UX Improvements](./UX_IMPROVEMENTS.md)** - Professional UX enhancements & design rationale ⭐ NEW
- **[Judge Guide](./JUDGE_GUIDE.md)** - Complete guide for using the judge portal
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and data flow
- **[Quick Reference](./QUICK_REFERENCE.md)** - Commands, URLs, and quick troubleshooting
- [AI Agents Documentation](./ai-agents/README.md) - Complete AI system docs
- [Project Brief](./Project_Brief_Judging_App_09.22.25.pdf) - Technical specification
- [Judging Instructions](./Titan100.pdf) - Titan100 judging guide

## 🤝 Contact

- **Technical Issues**: Development team
- **Titan100 Specific**: Brennan Jones (bjones@titanceo.com)
- **Platform**: Karla Gamier (Karlag@titanceo.com)

## 📄 License

© 2025 VisualMedia, LTD. All Rights Reserved. CONFIDENTIAL.
