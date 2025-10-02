# Backend Data Science Architecture & Integration Points

**Meta-Judge AI-Powered Evaluation Platform**
**Document Version:** 1.0
**Last Updated:** October 2, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Human Judge Layer](#human-judge-layer)
4. [LLM Judge Layer (SoTruth AI)](#llm-judge-layer-sotruth-ai)
5. [Comparison & Bias Analysis Layer](#comparison--bias-analysis-layer)
6. [Statistical Fairness Metrics](#statistical-fairness-metrics)
7. [Data Science Integration Points](#data-science-integration-points)
8. [Database Schema & Data Flow](#database-schema--data-flow)
9. [API Endpoints](#api-endpoints)
10. [Roadmap & Recommendations](#roadmap--recommendations)

---

## Executive Summary

The Meta-Judge platform implements a **Dual-Track Bias-Minimized Judging System** that combines human expert evaluation with AI-powered objective scoring to eliminate bias in award evaluation processes. The system currently operates with:

- **Human Judging Layer**: Interactive rubric-based scoring interface for 5+ judges
- **LLM Judging Layer**: Claude Sonnet 4.5-powered evidence-based evaluation (SoTruth Agent)
- **Comparison Layer**: Statistical analysis using Pearson correlation, with roadmap to implement Cohen's Kappa for inter-rater reliability

**Current State**: Production-ready with mock AI data. Real AI scoring integration is backend-ready but not yet activated in the UI.

---

## System Architecture Overview

### Technology Stack

**Frontend**
- React 18 + TypeScript + Vite
- Radix UI + Tailwind CSS (Atomic Design)
- TanStack React Table
- Zustand (State Management)
- React Hook Form + Zod (Validation)

**Backend**
- Express.js + TypeScript
- Drizzle ORM
- Neon PostgreSQL (Serverless)

**AI System**
- Anthropic Claude Sonnet 4.5
- Claude Agent SDK
- Custom agent orchestration framework

### Data Flow Architecture

```
┌─────────────────┐
│   Applications  │
│   Submission    │
└────────┬────────┘
         │
         ├──────────────────────┬────────────────────────┐
         │                      │                        │
         ▼                      ▼                        ▼
┌────────────────┐    ┌────────────────┐      ┌─────────────────┐
│  Human Judge   │    │  SoTruth AI    │      │  Organization   │
│    Scoring     │    │    Scoring     │      │   Context DB    │
│   (Manual UI)  │    │   (Automated)  │      │  (Rubrics/PDF)  │
└────────┬───────┘    └────────┬───────┘      └─────────────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Evaluation Storage  │
         │   (evaluations,      │
         │   ai_evaluations)    │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Bias Analysis       │
         │  Agent Processing    │
         │  - Correlation       │
         │  - Discrepancies     │
         │  - Bias Detection    │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Comparison          │
         │  Dashboard Data      │
         │  (Pre-computed)      │
         └──────────────────────┘
```

---

## Human Judge Layer

### Functionality

The human judge layer provides an interactive web-based interface for expert judges to evaluate applications using organization-specific rubrics.

#### Core Features

**1. Judge Dashboard** (`client/src/pages/JudgeDashboard.tsx`)
- Displays all applications for a specific organization
- Tracks evaluation status (evaluated vs. pending)
- Shows summary statistics
- Provides navigation to individual scoring interfaces

**2. Application Scoring Interface** (`client/src/pages/ScoringPage.tsx` - inferred)
- **Application Tab**: Full candidate submission data
- **Scoring Tab**: Interactive rubric with 1-5 scale per criterion
- **Context Tab**: Program guidelines and eligibility requirements

**3. Rubric-Based Scoring**
- 4 equally-weighted criteria (25% each) for Titan100:
  - Entrepreneurial Journey
  - Company Vision
  - What Makes Them a Titan
  - Accomplishments
- 5-point scale (1=Poor → 5=Outstanding)
- Evidence/reasoning fields for each criterion
- Overall comments section
- Real-time total score calculation

#### Database Integration

**Primary Table**: `evaluations`

```typescript
{
  id: serial,
  applicationId: integer,        // FK to applications
  rubricId: integer,             // FK to rubrics
  evaluatorName: text,           // Judge identifier
  scores: jsonb,                 // CriterionScore[]
  totalScore: real,              // Weighted total (0-25)
  grade: text,                   // Letter grade or category
  comments: text,                // Overall evaluation notes
  evaluatedAt: timestamp
}
```

**Score Structure** (JSONB):
```json
{
  "criterion_id": {
    "score": 4,
    "reasoning": "Evidence-based justification",
    "weight": 0.25
  }
}
```

#### API Endpoints

- `GET /api/applications` - Fetch applications for organization
- `GET /api/evaluations?applicationId={id}` - Get existing evaluations
- `POST /api/evaluations` - Submit new evaluation
- `PUT /api/evaluations/{id}` - Update existing evaluation

---

## LLM Judge Layer (SoTruth AI)

### Architecture

The SoTruth AI Scoring Agent (`ai-agents/agents/sotruth-scoring-agent.ts`) provides objective, evidence-based evaluation using Claude Sonnet 4.5 with rubric-anchored prompting.

#### Core Components

**1. SoTruthScoringAgent Class**

```typescript
class SoTruthScoringAgent {
  async scoreApplication(input: AIScoringInput): Promise<AIScoringOutput>
  async scoreApplicationsBatch(inputs: AIScoringInput[]): Promise<AIScoringOutput[]>
}
```

**Input Structure**:
```typescript
interface AIScoringInput {
  applicationId: number;
  rubricId: number;
  application: ApplicationSubmission;
  rubric: Rubric;
}
```

**Output Structure**:
```typescript
interface AIScoringOutput {
  applicationId: number;
  rubricId: number;
  evaluatorType: 'ai';
  evaluatorName: 'SoTruth AI Scoring Agent';
  criterionScores: CriterionScore[];  // Per-criterion evaluation
  totalScore: number;                  // Weighted total
  overallComments: string;
  flaggedConcerns: string[];           // Missing info, issues
  evaluatedAt: Date;
}

interface CriterionScore {
  criterionId: string;
  score: number;          // 1-5
  evidence: string;       // Quoted text from application
  reasoning: string;      // Rubric-based justification
  confidence: number;     // 0.0-1.0
}
```

#### Scoring Process

**Step 1: Prompt Construction**
- Injects application data (applicant info, responses)
- Formats rubric criteria with rating scales
- Provides structured JSON output template
- Enforces evidence-based reasoning

**Step 2: Agent Execution**
- Uses Claude Agent SDK with `bypassPermissions` mode
- Streams response from Claude Sonnet 4.5
- Collects full text response

**Step 3: Response Parsing**
- Extracts JSON from markdown code blocks
- Validates criterion scores against rubric
- Calculates weighted total score
- Returns validated `AIScoringOutput`

**Step 4: Validation**
- Zod schema validation (`EvaluationSchema`)
- Ensures all required fields present
- Confidence threshold checks

#### Key Features

**Evidence-Based Scoring**
- Agent must cite specific quotes/references
- Reasoning must align with rubric definitions
- Confidence scoring (0.0-1.0) per criterion

**Rubric Anchoring**
- Full rubric injected into system prompt
- Rating scale descriptions for each level (1-5)
- Weight distribution enforced

**Batch Processing**
- Supports scoring multiple applications
- Error handling per application
- Continues on individual failures

#### Database Integration

**Primary Table**: `ai_evaluations`

```typescript
{
  id: serial,
  applicationId: integer,
  rubricId: integer,
  modelName: text,               // e.g., "claude-sonnet-4-5"
  modelVersion: text,
  criterionScores: jsonb,        // CriterionScore[]
  totalScore: real,
  overallComments: text,
  flaggedConcerns: jsonb,        // string[]
  confidence: real,              // Average confidence
  evaluatedAt: timestamp
}
```

#### API Endpoints

- `POST /api/ai-evaluations/score` - Trigger AI scoring (currently returns pending status)
- `GET /api/ai-evaluations?applicationId={id}` - Fetch AI evaluations

---

## Comparison & Bias Analysis Layer

### Current Implementation

The comparison layer analyzes scoring patterns between human judges and AI to detect bias and ensure fairness.

#### Comparison Dashboard (`client/src/pages/ComparisonDashboard.tsx`)

**View Modes**:
1. **Organization Overall**: Aggregate statistics across all applications
2. **Applicant Focus**: Filter by specific application to see all judges' scores
3. **Judge Focus**: Filter by specific judge to see their scoring patterns

**Key Metrics Displayed**:
- Human Average Score
- AI Average Score
- Average Discrepancy (absolute difference)
- Correlation Coefficient (Pearson r)

**Bias Indicators**:
- Leniency Bias (human scores higher than AI)
- Strictness Bias (human scores lower than AI)
- Severity classification (low/medium/high)
- Affected applications/judges tracking

#### Bias Analysis Agent (`ai-agents/agents/bias-analysis-agent.ts`)

**Core Functionality**:

```typescript
class BiasAnalysisAgent {
  async analyzeBias(input: BiasAnalysisInput): Promise<BiasAnalysis>
  generateReport(analysis: BiasAnalysis): string
}
```

**Statistical Calculations**:

1. **Score Discrepancies**
   - Per-criterion comparison (human vs. AI)
   - Absolute and percentage differences
   - Identifies significant discrepancies (>1 point)

2. **Pearson Correlation Coefficient**
   ```typescript
   r = (n∑xy - ∑x∑y) / sqrt[(n∑x² - (∑x)²)(n∑y² - (∑y)²)]
   ```
   - Measures linear relationship between human and AI scores
   - Range: -1.0 (perfect inverse) to +1.0 (perfect agreement)
   - Interpretation:
     - r ≥ 0.9: Very strong agreement
     - r ≥ 0.7: Strong agreement
     - r ≥ 0.5: Moderate agreement
     - r < 0.5: Weak agreement

3. **Average Score Difference**
   ```typescript
   avgDiff = Σ|human_i - ai_i| / n
   ```

**Bias Detection Categories**:
- **Halo Effect**: Overall impression affecting individual criteria
- **Leniency/Severity Bias**: Systematic scoring higher/lower
- **Recency Bias**: More recent applications scored differently
- **Demographic Bias**: Scores varying by applicant characteristics
- **Industry Bias**: Certain industries receiving preferential treatment

**Output Structure**:
```typescript
interface BiasAnalysis {
  overallCorrelation: number;           // Pearson r
  averageScoreDifference: number;
  significantDiscrepancies: ScoreDiscrepancy[];  // Top 50
  biasIndicators: BiasIndicator[];
  recommendations: string[];
  analyzedAt: Date;
}
```

#### Database Integration

**Tables**:
1. `bias_analyses` - Stored analysis results
2. `judge_performance` - Per-judge metrics
3. `comparison_dashboard_data` - Pre-computed dashboard data

---

## Statistical Fairness Metrics

### Current Metrics

**1. Pearson Correlation (r)**
- **Purpose**: Measures linear relationship strength
- **Range**: -1.0 to +1.0
- **Limitation**: Doesn't account for systematic bias (e.g., one rater consistently scoring 1 point higher)

**2. Average Absolute Difference**
- **Purpose**: Quantifies average discrepancy magnitude
- **Limitation**: Doesn't distinguish between random error and systematic bias

**3. Percentage Difference**
- **Purpose**: Relative discrepancy per criterion
- **Calculation**: `(human - ai) / ai * 100`

### Recommended Addition: Cohen's Kappa (κ)

**Why Cohen's Kappa?**

Cohen's Kappa measures **inter-rater reliability** while accounting for agreement occurring by chance. It's particularly valuable for:
- Categorical/ordinal data (1-5 ratings)
- Multiple raters evaluating the same items
- Distinguishing true agreement from random agreement

**Formula**:

```
κ = (P_o - P_e) / (1 - P_e)

where:
P_o = Observed agreement probability
P_e = Expected agreement probability (by chance)
```

**Interpretation**:
- κ < 0: Less than chance agreement
- κ = 0.01-0.20: Slight agreement
- κ = 0.21-0.40: Fair agreement
- κ = 0.41-0.60: Moderate agreement
- κ = 0.61-0.80: Substantial agreement
- κ = 0.81-1.00: Almost perfect agreement

**Implementation Pseudocode**:

```typescript
function calculateCohenKappa(
  humanScores: number[],
  aiScores: number[]
): number {
  const n = humanScores.length;
  const k = 5; // Number of categories (1-5 scale)

  // Build confusion matrix
  const matrix = Array(k).fill(0).map(() => Array(k).fill(0));
  for (let i = 0; i < n; i++) {
    matrix[humanScores[i] - 1][aiScores[i] - 1]++;
  }

  // Calculate observed agreement (P_o)
  let observedAgreement = 0;
  for (let i = 0; i < k; i++) {
    observedAgreement += matrix[i][i];
  }
  const Po = observedAgreement / n;

  // Calculate expected agreement (P_e)
  let expectedAgreement = 0;
  for (let i = 0; i < k; i++) {
    const humanMargin = matrix[i].reduce((a, b) => a + b, 0) / n;
    const aiMargin = matrix.map(row => row[i]).reduce((a, b) => a + b, 0) / n;
    expectedAgreement += humanMargin * aiMargin;
  }
  const Pe = expectedAgreement;

  // Calculate kappa
  return (Po - Pe) / (1 - Pe);
}
```

**Weighted Cohen's Kappa**:

For ordinal scales (1-5 ratings), use weighted kappa to give partial credit for near-misses:

```typescript
// Quadratic weights (penalizes larger disagreements more)
const weight = 1 - ((i - j) ** 2) / (k - 1) ** 2;
```

---

## Data Science Integration Points

### Integration Point 1: Real-Time AI Scoring Pipeline

**Current State**: Mock data in UI
**Target State**: Automated AI scoring on application submission

**Implementation Path**:

```typescript
// server/routes/extended-routes.ts
router.post('/ai-evaluations/score', async (req, res) => {
  const { applicationId, rubricId } = req.body;

  // 1. Fetch application and rubric
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
    with: { applicant: true }
  });
  const rubric = await db.query.rubrics.findFirst({
    where: eq(rubrics.id, rubricId)
  });

  // 2. Execute AI scoring
  const agent = createSoTruthAgent();
  const evaluation = await agent.scoreApplication({
    applicationId,
    rubricId,
    application: formatApplicationForScoring(application),
    rubric: formatRubricForScoring(rubric)
  });

  // 3. Store in ai_evaluations table
  const result = await db.insert(aiEvaluations).values({
    applicationId: evaluation.applicationId,
    rubricId: evaluation.rubricId,
    modelName: 'claude-sonnet-4-5',
    modelVersion: '20250929',
    criterionScores: evaluation.criterionScores,
    totalScore: evaluation.totalScore,
    overallComments: evaluation.overallComments,
    flaggedConcerns: evaluation.flaggedConcerns,
    confidence: calculateAverageConfidence(evaluation.criterionScores)
  }).returning();

  res.json({ success: true, data: result[0] });
});
```

### Integration Point 2: Automated Bias Analysis Trigger

**Trigger Conditions**:
- When all judges complete evaluation for an application
- When AI scoring completes for an application
- On-demand via dashboard button

**Implementation**:

```typescript
// server/services/bias-analysis-service.ts
export async function triggerBiasAnalysis(
  organizationId: number,
  rubricId: number
) {
  // 1. Fetch all human and AI evaluations
  const humanEvals = await db.query.evaluations.findMany({
    where: and(
      eq(evaluations.rubricId, rubricId),
      // Join to applications to filter by organization
    )
  });

  const aiEvals = await db.query.aiEvaluations.findMany({
    where: eq(aiEvaluations.rubricId, rubricId)
  });

  // 2. Execute bias analysis
  const agent = createBiasAnalysisAgent();
  const analysis = await agent.analyzeBias({
    humanEvaluations: formatEvaluationsForAnalysis(humanEvals),
    aiEvaluations: formatEvaluationsForAnalysis(aiEvals),
    rubric: await fetchRubric(rubricId)
  });

  // 3. Store analysis results
  await db.insert(biasAnalyses).values({
    organizationId,
    rubricId,
    correlation: analysis.overallCorrelation,
    averageScoreDifference: analysis.averageScoreDifference,
    biasIndicators: analysis.biasIndicators,
    recommendations: analysis.recommendations,
    significantDiscrepancies: analysis.significantDiscrepancies
  });

  // 4. Update dashboard data
  await updateComparisonDashboard(organizationId, rubricId);

  return analysis;
}
```

### Integration Point 3: Cohen's Kappa Calculation

**Location**: `server/services/statistical-analysis.ts` (new file)

```typescript
export interface StatisticalMetrics {
  pearsonCorrelation: number;
  cohenKappa: number;
  weightedKappa: number;
  averageAbsoluteDifference: number;
  rootMeanSquareError: number;
  agreementMatrix: number[][];
}

export function calculateStatisticalMetrics(
  humanScores: number[],
  aiScores: number[],
  useWeighted: boolean = true
): StatisticalMetrics {
  return {
    pearsonCorrelation: calculatePearsonCorrelation(humanScores, aiScores),
    cohenKappa: calculateCohenKappa(humanScores, aiScores),
    weightedKappa: useWeighted
      ? calculateWeightedKappa(humanScores, aiScores)
      : 0,
    averageAbsoluteDifference: calculateMAE(humanScores, aiScores),
    rootMeanSquareError: calculateRMSE(humanScores, aiScores),
    agreementMatrix: buildConfusionMatrix(humanScores, aiScores, 5)
  };
}
```

### Integration Point 4: Judge Performance Tracking

**Metrics to Track**:
- Average score per judge
- Correlation with AI scores
- Consistency (standard deviation)
- Bias indicators per judge
- Cohen's Kappa per judge

**Implementation**:

```typescript
// server/services/judge-performance.ts
export async function computeJudgePerformance(
  judgeName: string,
  organizationId: number
) {
  const judgeEvals = await fetchJudgeEvaluations(judgeName, organizationId);
  const aiEvals = await fetchCorrespondingAIEvaluations(judgeEvals);

  const metrics = calculateStatisticalMetrics(
    judgeEvals.map(e => e.totalScore),
    aiEvals.map(e => e.totalScore)
  );

  await db.insert(judgePerformance).values({
    judgeName,
    organizationId,
    rubricId: judgeEvals[0].rubricId,
    totalEvaluations: judgeEvals.length,
    averageScore: calculateAverage(judgeEvals.map(e => e.totalScore)),
    standardDeviation: calculateStdDev(judgeEvals.map(e => e.totalScore)),
    correlationWithAI: metrics.pearsonCorrelation,
    cohenKappa: metrics.cohenKappa,
    biasIndicators: detectJudgeBias(judgeEvals, aiEvals)
  });
}
```

### Integration Point 5: Dashboard Data Pre-computation

**Purpose**: Optimize comparison dashboard performance

**Scheduled Job**:
```typescript
// server/jobs/compute-dashboard-data.ts
export async function computeComparisonDashboard(
  organizationId: number,
  rubricId: number
) {
  const data = await generateComparisonData(organizationId, rubricId);

  await db.insert(comparisonDashboardData).values({
    organizationId,
    rubricId,
    dashboardType: 'comparison',
    computedData: {
      totalApplications: data.totalApplications,
      averageHumanScore: data.averageHumanScore,
      averageAiScore: data.averageAiScore,
      correlation: data.correlation,
      cohenKappa: data.cohenKappa,  // NEW
      averageDiscrepancy: data.averageDiscrepancy,
      biasIndicators: data.biasIndicators,
      comparisons: data.comparisons,
      judgePerformance: data.judgePerformance
    }
  });
}
```

---

## Database Schema & Data Flow

### Extended Schema Tables

**1. ai_evaluations**
```sql
CREATE TABLE ai_evaluations (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  rubric_id INTEGER NOT NULL REFERENCES rubrics(id),
  model_name TEXT NOT NULL,
  model_version TEXT,
  criterion_scores JSONB NOT NULL,  -- CriterionScore[]
  total_score REAL NOT NULL,
  overall_comments TEXT,
  flagged_concerns JSONB,           -- string[]
  confidence REAL,                  -- 0.0-1.0
  evaluated_at TIMESTAMP DEFAULT NOW()
);
```

**2. bias_analyses**
```sql
CREATE TABLE bias_analyses (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  rubric_id INTEGER REFERENCES rubrics(id),
  correlation REAL NOT NULL,
  cohen_kappa REAL,                 -- NEW FIELD
  average_score_difference REAL,
  bias_indicators JSONB,
  recommendations JSONB,
  significant_discrepancies JSONB,
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

**3. judge_performance**
```sql
CREATE TABLE judge_performance (
  id SERIAL PRIMARY KEY,
  judge_name TEXT NOT NULL,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  rubric_id INTEGER REFERENCES rubrics(id),
  total_evaluations INTEGER,
  average_score REAL,
  standard_deviation REAL,
  correlation_with_ai REAL,
  cohen_kappa REAL,                 -- NEW FIELD
  bias_indicators JSONB,
  computed_at TIMESTAMP DEFAULT NOW()
);
```

**4. comparison_dashboard_data**
```sql
CREATE TABLE comparison_dashboard_data (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  rubric_id INTEGER REFERENCES rubrics(id),
  dashboard_type TEXT NOT NULL,     -- 'comparison', 'judge', 'applicant'
  computed_data JSONB NOT NULL,     -- Pre-computed metrics
  computed_at TIMESTAMP DEFAULT NOW()
);
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION SUBMISSION                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├──── Stored in 'applications' table
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  HUMAN JUDGE    │         │  AI SCORING     │
│  Scores via UI  │         │  (SoTruth Agent)│
└────────┬────────┘         └────────┬────────┘
         │                           │
         ├─ Stored in                ├─ Stored in
         │  'evaluations'            │  'ai_evaluations'
         │                           │
         └─────────┬─────────────────┘
                   ▼
         ┌──────────────────────┐
         │  BIAS ANALYSIS       │
         │  (When both complete)│
         └──────────┬───────────┘
                    │
                    ├─ Calculates:
                    │  • Pearson r
                    │  • Cohen's Kappa (proposed)
                    │  • Discrepancies
                    │  • Bias indicators
                    │
                    ├─ Stored in 'bias_analyses'
                    ├─ Stored in 'judge_performance'
                    │
                    ▼
         ┌──────────────────────┐
         │  DASHBOARD DATA      │
         │  Pre-computation     │
         └──────────┬───────────┘
                    │
                    └─ Stored in 'comparison_dashboard_data'
                    │
                    ▼
         ┌──────────────────────┐
         │  COMPARISON DASHBOARD│
         │  UI Rendering        │
         └──────────────────────┘
```

---

## API Endpoints

### Human Judging

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications?organizationId={id}` | Fetch applications for organization |
| GET | `/api/evaluations?applicationId={id}` | Get human evaluations for application |
| POST | `/api/evaluations` | Submit new human evaluation |
| PUT | `/api/evaluations/{id}` | Update existing evaluation |

### AI Scoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai-evaluations?applicationId={id}` | Fetch AI evaluations |
| POST | `/api/ai-evaluations/score` | Trigger AI scoring (currently mock) |
| GET | `/api/ai-evaluations?rubricId={id}` | Get all AI evaluations for rubric |

### Bias Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bias-analyses?organizationId={id}` | Get bias analyses |
| POST | `/api/bias-analyses/run` | Trigger bias analysis (currently mock) |

### Judge Performance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/judge-performance?organizationId={id}` | Get judge metrics |
| GET | `/api/judge-performance?judgeName={name}` | Get specific judge's performance |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/comparison?organizationId={id}&rubricId={id}` | Get comparison dashboard data |

---

## Roadmap & Recommendations

### Phase 1: Cohen's Kappa Integration (High Priority)

**Tasks**:
1. Implement `calculateCohenKappa()` function in new file `server/services/statistical-analysis.ts`
2. Add `cohen_kappa` field to `bias_analyses` table (migration)
3. Add `cohen_kappa` field to `judge_performance` table (migration)
4. Update `BiasAnalysisAgent` to calculate kappa alongside correlation
5. Update comparison dashboard to display kappa metric
6. Add kappa interpretation guide in UI tooltip

**Acceptance Criteria**:
- Kappa displayed alongside Pearson r in comparison dashboard
- Per-judge kappa available in judge performance view
- Confusion matrix visualized in detailed comparison view

### Phase 2: Real AI Scoring Activation (High Priority)

**Tasks**:
1. Activate `POST /api/ai-evaluations/score` endpoint with real agent execution
2. Implement background job queue for AI scoring (avoid blocking UI)
3. Add polling mechanism in UI to check AI scoring status
4. Replace mock data in `LLMScoringDashboard.tsx` with real API calls
5. Add error handling and retry logic

**Acceptance Criteria**:
- AI scores generated automatically on application submission
- Real-time status updates in LLM dashboard
- Evidence and reasoning displayed for each criterion

### Phase 3: Advanced Bias Detection (Medium Priority)

**Tasks**:
1. Implement demographic bias detection (requires applicant metadata)
2. Add industry bias detection
3. Implement temporal bias detection (recency effects)
4. Add judge clustering analysis (identify judge "profiles")
5. Implement anomaly detection for outlier scores

**Statistical Methods**:
- Chi-square tests for categorical bias
- ANOVA for group comparisons
- K-means clustering for judge profiling
- Z-score analysis for outlier detection

### Phase 4: Predictive Analytics (Low Priority)

**Tasks**:
1. Train ML model to predict final scores from partial evaluations
2. Implement judge recommendation system (assign judges to minimize bias)
3. Add confidence intervals to all metrics
4. Implement Bayesian updating as more evaluations come in

### Phase 5: Governance & Reporting (Medium Priority)

**Tasks**:
1. Generate PDF reports for bias analyses
2. Create audit logs for all evaluations
3. Implement data export (CSV, JSON) for external analysis
4. Add email notifications for bias alerts
5. Create admin dashboard for system monitoring

---

## Appendix: Cohen's Kappa Example

### Sample Calculation

**Scenario**: 10 applications scored by 1 human judge and AI (1-5 scale)

| App | Human | AI |
|-----|-------|-----|
| 1   | 4     | 4   |
| 2   | 5     | 4   |
| 3   | 3     | 3   |
| 4   | 4     | 5   |
| 5   | 2     | 2   |
| 6   | 5     | 5   |
| 7   | 3     | 4   |
| 8   | 4     | 4   |
| 9   | 3     | 3   |
| 10  | 5     | 5   |

**Confusion Matrix**:

|       | AI=1 | AI=2 | AI=3 | AI=4 | AI=5 |
|-------|------|------|------|------|------|
| **H=1** | 0    | 0    | 0    | 0    | 0    |
| **H=2** | 0    | 1    | 0    | 0    | 0    |
| **H=3** | 0    | 0    | 2    | 1    | 0    |
| **H=4** | 0    | 0    | 0    | 3    | 1    |
| **H=5** | 0    | 0    | 0    | 1    | 2    |

**Observed Agreement (P_o)**:
- Agreements on diagonal: 0 + 1 + 2 + 3 + 2 = 8
- P_o = 8/10 = 0.8

**Expected Agreement (P_e)**:
- P(H=1) × P(AI=1) = 0 × 0 = 0
- P(H=2) × P(AI=2) = 0.1 × 0.1 = 0.01
- P(H=3) × P(AI=3) = 0.3 × 0.2 = 0.06
- P(H=4) × P(AI=4) = 0.3 × 0.4 = 0.12
- P(H=5) × P(AI=5) = 0.3 × 0.3 = 0.09
- P_e = 0.28

**Cohen's Kappa**:
```
κ = (0.8 - 0.28) / (1 - 0.28) = 0.52 / 0.72 = 0.72
```

**Interpretation**: **Substantial agreement** (κ = 0.72)

Compare to **Pearson r = 0.91** (very strong linear relationship)

**Key Insight**: Pearson r is higher because it only measures linear trend, while kappa accounts for the fact that some agreement is expected by chance. Kappa provides a more conservative measure of true inter-rater reliability.

---

## Contact & Support

**Technical Lead**: Development Team
**Data Science**: [To be assigned]
**Titan100 Program**: Brennan Jones (bjones@titanceo.com)
**Platform Support**: Karla Gamier (Karlag@titanceo.com)

---

**Document Classification**: CONFIDENTIAL
**Copyright**: © 2025 VisualMedia, LTD. All Rights Reserved.
