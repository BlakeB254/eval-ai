# Judge Guide - TitanScores Platform

## Overview

The **TitanScores Judging Platform** is a dual-track bias-minimized judging system designed for the Titan100 awards program. It combines human expertise with AI-powered objective scoring to ensure fairness and transparency in the evaluation process.

## Table of Contents

1. [Accessing the System](#accessing-the-system)
2. [How the Judge Portal Works](#how-the-judge-portal-works)
3. [Scoring Applications](#scoring-applications)
4. [Understanding the Rubric](#understanding-the-rubric)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Accessing the System

### Starting the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Access the Application**:
   - Open your browser to: **http://localhost:5174** (or the port shown in terminal)
   - You'll see the TitanScores home page

3. **Navigate to Judge Portal**:
   - Click the **"Judge Portal"** card on the home page
   - OR navigate directly to: **http://localhost:5174/judge?org=2**

### URL Parameters Explained

- **`/judge`** - The judge dashboard route
- **`?org=2`** - The organization ID parameter (2 = Titan100)
  - This tells the system which organization's applications to load
  - You can change this to score for different organizations

---

## How the Judge Portal Works

### 1. Judge Dashboard (`/judge?org=2`)

**What you see:**
- **Summary Statistics**: Total applications, evaluated count, pending count
- **Applications List**: All applications available for scoring

**What you can do:**
- View all applications for the organization
- See which applications you've already evaluated (marked with green "Evaluated" badge)
- Click "Score Application" to begin evaluating
- Click "View Evaluation" to review your previous scores

**How it works:**
- The system queries the database for all applications where `organizationId = 2` (Titan100)
- It checks if you've already submitted evaluations for each application
- Applications are sorted by submission date

### 2. Application Scoring Page (`/judge/score/:applicationId?org=2`)

**The Three-Tab Interface:**

#### **Tab 1: Application**
- Displays the full application with all candidate responses
- Shows 4 sections based on Titan100 criteria:
  1. Entrepreneurial Story
  2. Company Vision (Next 5 Years)
  3. What Makes This Individual a Titan
  4. Accomplishments

**Purpose**: Read and review the application thoroughly before scoring

#### **Tab 2: Scoring**
- **Interactive Rubric Form** with 4 criteria
- Each criterion has:
  - Score selection (1-5 radio buttons)
  - Detailed descriptions for each score level
  - Optional reasoning field (for your notes)
- **Overall Comments** (optional)
- **Total Score** displayed prominently
- **Submit Button** (enabled when all criteria are scored)

**How scoring works:**
1. Select a score (1-5) for each of the 4 criteria
2. Each criterion is weighted equally at 25%
3. Total score is calculated automatically (max 25 points)
4. Click "Submit Evaluation" to save

**What happens when you submit:**
```
1. Form validates all criteria are scored
2. Creates an evaluation object with:
   - applicationId: The application being scored
   - rubricId: The Titan100 rubric ID
   - judgeName: Your judge identifier
   - criterionScores: Array of scores for each criterion
   - totalScore: Calculated total
   - comments: Your overall feedback
3. Sends POST request to /api/evaluations
4. Saves to database
5. Redirects to summary view
```

#### **Tab 3: Context & Guidelines**
- **Titan Definition**: What makes someone a Titan
- **Eligibility Requirements**: Business age, revenue, C-suite title
- **Judging Guidelines**: Score scale explanations
- **Program Information**: Titan100 details

**Purpose**: Reference material to ensure consistent, informed scoring

---

## Scoring Applications

### Step-by-Step Process

**Step 1: Access the Judge Dashboard**
```
Navigate to: http://localhost:5174/judge?org=2
```

**Step 2: Select an Application**
```
Click "Score Application" on any pending application
```

**Step 3: Review the Application**
```
- Switch to "Application" tab
- Read through all 4 response sections
- Take notes if needed
```

**Step 4: Review Context (First Time)**
```
- Switch to "Context & Guidelines" tab
- Familiarize yourself with Titan definition
- Review scoring scale
```

**Step 5: Score the Application**
```
- Switch to "Scoring" tab
- For each criterion:
  1. Read the rating descriptions
  2. Select the score that best matches the response
  3. Add reasoning (optional but recommended)
- Add overall comments if needed
- Review total score
- Click "Submit Evaluation"
```

**Step 6: Confirmation**
```
- Success message appears
- Application marked as "Evaluated" on dashboard
- Can return later to view/update evaluation
```

---

## Understanding the Rubric

### The Titan100 Rubric

**4 Equally Weighted Criteria** (25% each):

#### 1. Entrepreneurial Journey
**What to evaluate:**
- Clear career timeline
- Obstacles overcome
- Demonstrated commitment to industry
- Track record of success

**Score Guide:**
- **1 (Poor)**: No clear story, lacks detail, incomplete
- **2 (Needs Improvement)**: Disjointed timeline, vague obstacles
- **3 (Satisfactory)**: Basic story, mentions obstacles, some detail
- **4 (Good)**: Clear story, addresses challenges, solid accomplishments
- **5 (Outstanding)**: Engaging story, significant obstacles overcome, inspiring

#### 2. Company Vision (5 Years)
**What to evaluate:**
- Clarity of long-term goals
- Forward-thinking aspirations
- Specificity of vision
- Inspirational quality

**Score Guide:**
- **1 (Poor)**: No clear vision, vague or absent
- **2 (Needs Improvement)**: Unclear, lacks specifics
- **3 (Satisfactory)**: Some goals outlined, somewhat generic
- **4 (Good)**: Clear goals, well-articulated, measurable
- **5 (Outstanding)**: Inspiring, vivid, specific, motivating

#### 3. What Makes Them a Titan
**What to evaluate:**
- Unique qualities and expertise
- Industry contributions
- What sets them apart from competitors
- Conviction and confidence

**Score Guide:**
- **1 (Poor)**: No compelling details, lacks conviction
- **2 (Needs Improvement)**: Limited information, vague qualities
- **3 (Satisfactory)**: General reasons, some contribution mentioned
- **4 (Good)**: Solid examples, clear differentiation
- **5 (Outstanding)**: Specific achievements, measurable impact, unmatched expertise

#### 4. Accomplishments
**What to evaluate:**
- Specific achievements listed
- Significance explained
- Uniqueness and inspiration
- Multiple examples provided

**Score Guide:**
- **1 (Poor)**: No specific accomplishments
- **2 (Needs Improvement)**: Few examples, unclear significance
- **3 (Satisfactory)**: Some accomplishments, lacking detail
- **4 (Good)**: Several accomplishments, significance explained
- **5 (Outstanding)**: Multiple specific achievements, highly inspiring, unique impact

### Scoring Formula

```
Total Score = (Score1 × 0.25) + (Score2 × 0.25) + (Score3 × 0.25) + (Score4 × 0.25)

Example:
Criterion 1: 5 → 5 × 0.25 = 1.25
Criterion 2: 4 → 4 × 0.25 = 1.00
Criterion 3: 5 → 5 × 0.25 = 1.25
Criterion 4: 4 → 4 × 0.25 = 1.00
Total = 4.5 out of 5.0 (or 22.5 out of 25)
```

---

## Best Practices

### For Consistent Scoring

1. **Read Completely**: Review the entire application before scoring
2. **Use the Rubric**: Always reference the detailed score descriptions
3. **Be Objective**: Base scores on evidence in the application, not assumptions
4. **Document Reasoning**: Use the reasoning fields to note specific examples
5. **Stay Calibrated**: Review the Context tab periodically to maintain standards
6. **Take Breaks**: Score in batches to maintain focus and consistency

### Evidence-Based Evaluation

**Good Practice:**
```
Score: 5
Reasoning: "Candidate provided specific timeline from 2019-2024 with
3 major obstacles (pandemic pivot, funding rejection, near-bankruptcy)
and concrete solutions for each. Built company from $50K to $15M ARR."
```

**Avoid:**
```
Score: 5
Reasoning: "Good story"
```

### Common Pitfalls

❌ **Don't:**
- Score based on company size or revenue alone
- Let one strong criterion influence others (halo effect)
- Rush through applications
- Give benefit of doubt without evidence

✅ **Do:**
- Score each criterion independently
- Look for specific, measurable achievements
- Consider the quality of the response, not just quantity
- Be consistent across all applications

---

## Troubleshooting

### Common Issues

**Issue: Can't see any applications**
- **Check**: Are you using the correct organization ID? (`?org=2` for Titan100)
- **Solution**: Ensure sample applications are seeded: `npm run db:seed:applications`

**Issue: Submit button is disabled**
- **Check**: Have you scored all 4 criteria?
- **Solution**: Make sure every criterion has a score selected (1-5)

**Issue: Evaluation not saving**
- **Check**: Is the backend server running? Check terminal for errors
- **Solution**: Restart the dev server: `npm run dev`

**Issue: Previous evaluation not showing**
- **Check**: The system loads the first evaluation found for that application
- **Solution**: Refresh the page, check browser console for errors

### Getting Help

**Backend Logs:**
```bash
# Check server terminal for errors
# Look for lines starting with ❌ or Error:
```

**Frontend Errors:**
```
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Network tab for failed API calls
```

**Database Issues:**
```bash
# Check database connection
npm run db:studio

# Reseed data
npm run db:seed
npm run db:seed:applications
```

---

## Technical Details for Developers

### API Endpoints Used

```
GET  /api/organizations/:id          - Get organization details
GET  /api/applications?organizationId=X - Get all applications
GET  /api/rubrics?organizationId=X     - Get judging rubrics
GET  /api/titan100-data/:orgId         - Get Titan100 config
GET  /api/evaluations?applicationId=X  - Get evaluations for app
POST /api/evaluations                   - Submit new evaluation
```

### Database Tables Involved

- **organizations** - Award programs (Titan100, etc.)
- **applications** - Candidate submissions
- **applicants** - Candidate information
- **rubrics** - Scoring criteria and config
- **evaluations** - Judge scores and feedback
- **titan100_org_data** - Titan100-specific config

### State Management

The judging interface uses React hooks for state:
- `useState` for form data and UI state
- `useEffect` for data loading
- React Router for navigation

---

## Future Features

🔜 **Coming Soon:**
- **Comparison Dashboard** - View human vs AI scores side-by-side
- **Bias Analysis** - Identify scoring patterns and inconsistencies
- **Judge Performance Metrics** - Track your scoring consistency
- **Export Reports** - Download evaluation summaries
- **Multi-Judge Consensus** - Compare scores across judges

---

## Quick Reference

### URLs
- **Home**: http://localhost:5174
- **Judge Dashboard**: http://localhost:5174/judge?org=2
- **Score Application**: http://localhost:5174/judge/score/:id?org=2

### Score Scale
- **1** = Poor
- **2** = Needs Improvement
- **3** = Satisfactory
- **4** = Good
- **5** = Outstanding

### Total Score Range
- **Minimum**: 1.0 (all 1s)
- **Maximum**: 5.0 (all 5s)
- **Passing**: ~3.0 (approximate threshold)

---

## Support

For technical issues or questions:
- Review the main [README.md](./README.md) for setup instructions
- Check the [AI Agents documentation](./ai-agents/README.md) for AI system details
- Contact the development team for assistance
