# Meta-Judge - Cloudflare Pages Deployment Guide

## Application Overview

**Meta-Judge** is an AI-powered bias detection and evaluation quality assurance platform that helps you "judge the judges" by comparing human scoring against AI analysis.

## Quick Deploy to Cloudflare Pages

### Build Location
The static files are located in: `dist/public/`

### Deployment Steps

1. **Login to Cloudflare Pages**
   - Go to https://dash.cloudflare.com/
   - Navigate to Pages

2. **Create New Project**
   - Click "Create a project"
   - Choose "Direct Upload"

3. **Upload Build Files**
   - Upload the contents of `dist/public/` folder
   - Or use Wrangler CLI:
   ```bash
   npx wrangler pages deploy dist/public --project-name=meta-judge
   ```

4. **Configure Settings**
   - Build output directory: `dist/public`
   - Root directory: `/`

## What Works in Static Build

✅ **Fully Functional (Demo Data)**:
- **Home Page** - Application overview and navigation
- **Comparison Dashboard** - Human vs AI score analysis with demo data
- **Reports Page** - Bias analysis and governance reports with demo data

⚠️ **Requires Backend API**:
- **Judge Portal** - Needs live database connection for scoring
- **Real-time Data** - Live applications and evaluations require backend

## Demo Features Available

### 1. Comparison Dashboard (`/comparison?org=2`)
- Overall statistics (correlation, averages, discrepancies)
- Application-by-application breakdown
- Criterion-level analysis
- **Judge-specific performance metrics**
- Bias indicator detection

### 2. Reports Page (`/reports?org=2`)
- Bias Analysis Summary
- Statistical metrics (Pearson correlation, MAE, standard deviation)
- Governance & audit trail
- Compliance documentation
- Key findings and recommendations

### 3. Judge Performance Analysis
Three demo judges with different bias patterns:
- **Sarah Johnson** - Leniency bias (0.92 correlation)
- **Michael Chen** - Strictness bias (0.78 correlation)
- **Emily Rodriguez** - Halo effect (0.85 correlation)

## Environment Variables (Optional)

For production with live backend, set:
```
VITE_API_URL=https://your-backend-api.com
```

## Local Preview

To test the production build locally:
```bash
npm run preview
```

## Rebuilding

To create a fresh build:
```bash
npm run build
```

## Notes for Client Demo

- The static build showcases the **analysis and reporting capabilities**
- All comparison and reporting features work with realistic demo data
- Judge-specific bias detection is fully functional
- Perfect for demonstrating the platform's analytical power
- For live judging functionality, a backend deployment is required

## Support

For questions or issues with deployment, contact your development team.

---

**Meta-Judge** - Judge the Judges
AI-Powered Bias Detection & Evaluation Quality Assurance
