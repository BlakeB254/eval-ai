/**
 * Extended API Routes
 *
 * Routes for PDF documents, AI evaluations, bias analysis,
 * scoring workflows, and Titan100-specific functionality.
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import {
  pdfDocuments,
  aiEvaluations,
  biasAnalyses,
  scoringWorkflows,
  titan100OrgData,
  judgePerformance,
  comparisonDashboardData,
} from '../../db';
import { createSoTruthAgent } from '../../ai-agents/agents/sotruth-scoring-agent';
import { createBiasAnalysisAgent } from '../../ai-agents/agents/bias-analysis-agent';

const router = Router();

// ==================== PDF Documents Routes ====================

/**
 * GET /api/pdf-documents
 * Get all PDF documents, optionally filtered by organization
 */
router.get('/pdf-documents', async (req: Request, res: Response) => {
  try {
    const { organizationId, documentType } = req.query;

    let query = db.select().from(pdfDocuments);

    if (organizationId) {
      query = query.where(
        eq(pdfDocuments.organizationId, parseInt(organizationId as string))
      );
    }

    if (documentType) {
      query = query.where(eq(pdfDocuments.documentType, documentType as string));
    }

    const results = await query.orderBy(desc(pdfDocuments.uploadedAt));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching PDF documents:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch PDF documents' });
  }
});

/**
 * POST /api/pdf-documents
 * Upload a new PDF document
 */
router.post('/pdf-documents', async (req: Request, res: Response) => {
  try {
    const document = await db.insert(pdfDocuments).values(req.body).returning();
    res.status(201).json({ success: true, data: document[0] });
  } catch (error) {
    console.error('Error creating PDF document:', error);
    res.status(500).json({ success: false, error: 'Failed to create PDF document' });
  }
});

// ==================== AI Evaluations Routes ====================

/**
 * GET /api/ai-evaluations
 * Get AI evaluations, optionally filtered by application
 */
router.get('/ai-evaluations', async (req: Request, res: Response) => {
  try {
    const { applicationId, rubricId } = req.query;
    let query = db.select().from(aiEvaluations);

    if (applicationId) {
      query = query.where(
        eq(aiEvaluations.applicationId, parseInt(applicationId as string))
      );
    }

    if (rubricId) {
      query = query.where(
        eq(aiEvaluations.rubricId, parseInt(rubricId as string))
      );
    }

    const results = await query.orderBy(desc(aiEvaluations.evaluatedAt));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching AI evaluations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch AI evaluations' });
  }
});

/**
 * POST /api/ai-evaluations/score
 * Trigger AI scoring for an application
 */
router.post('/ai-evaluations/score', async (req: Request, res: Response) => {
  try {
    const { applicationId, rubricId } = req.body;

    if (!applicationId || !rubricId) {
      return res.status(400).json({
        success: false,
        error: 'applicationId and rubricId are required',
      });
    }

    // This would typically be handled by a background job
    // For now, we'll return a pending status
    res.json({
      success: true,
      message: 'AI scoring initiated',
      status: 'pending',
    });
  } catch (error) {
    console.error('Error initiating AI scoring:', error);
    res.status(500).json({ success: false, error: 'Failed to initiate AI scoring' });
  }
});

// ==================== Bias Analysis Routes ====================

/**
 * GET /api/bias-analyses
 * Get bias analyses for an organization
 */
router.get('/bias-analyses', async (req: Request, res: Response) => {
  try {
    const { organizationId, rubricId } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId is required',
      });
    }

    let query = db
      .select()
      .from(biasAnalyses)
      .where(
        eq(biasAnalyses.organizationId, parseInt(organizationId as string))
      );

    if (rubricId) {
      query = query.where(
        and(
          eq(biasAnalyses.organizationId, parseInt(organizationId as string)),
          eq(biasAnalyses.rubricId, parseInt(rubricId as string))
        )
      );
    }

    const results = await query.orderBy(desc(biasAnalyses.analyzedAt));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching bias analyses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bias analyses' });
  }
});

/**
 * POST /api/bias-analyses/run
 * Run bias analysis for a set of applications
 */
router.post('/bias-analyses/run', async (req: Request, res: Response) => {
  try {
    const { organizationId, rubricId, applicationIds } = req.body;

    if (!organizationId || !rubricId || !applicationIds) {
      return res.status(400).json({
        success: false,
        error: 'organizationId, rubricId, and applicationIds are required',
      });
    }

    // This would typically be handled by a background job
    res.json({
      success: true,
      message: 'Bias analysis initiated',
      status: 'pending',
    });
  } catch (error) {
    console.error('Error initiating bias analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate bias analysis',
    });
  }
});

// ==================== Scoring Workflows Routes ====================

/**
 * GET /api/scoring-workflows
 * Get scoring workflow status for applications
 */
router.get('/scoring-workflows', async (req: Request, res: Response) => {
  try {
    const { applicationId, status } = req.query;
    let query = db.select().from(scoringWorkflows);

    if (applicationId) {
      query = query.where(
        eq(scoringWorkflows.applicationId, parseInt(applicationId as string))
      );
    }

    if (status) {
      query = query.where(eq(scoringWorkflows.status, status as string));
    }

    const results = await query.orderBy(desc(scoringWorkflows.updatedAt));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching scoring workflows:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch scoring workflows' });
  }
});

/**
 * POST /api/scoring-workflows
 * Create or update a scoring workflow
 */
router.post('/scoring-workflows', async (req: Request, res: Response) => {
  try {
    const workflow = await db
      .insert(scoringWorkflows)
      .values({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json({ success: true, data: workflow[0] });
  } catch (error) {
    console.error('Error creating scoring workflow:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to create scoring workflow' });
  }
});

/**
 * PUT /api/scoring-workflows/:id
 * Update a scoring workflow status
 */
router.put('/scoring-workflows/:id', async (req: Request, res: Response) => {
  try {
    const workflow = await db
      .update(scoringWorkflows)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(scoringWorkflows.id, parseInt(req.params.id)))
      .returning();

    if (!workflow.length) {
      return res
        .status(404)
        .json({ success: false, error: 'Workflow not found' });
    }

    res.json({ success: true, data: workflow[0] });
  } catch (error) {
    console.error('Error updating scoring workflow:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to update scoring workflow' });
  }
});

// ==================== Titan100 Organization Data Routes ====================

/**
 * GET /api/titan100-data/:organizationId
 * Get Titan100-specific data for an organization
 */
router.get('/titan100-data/:organizationId', async (req: Request, res: Response) => {
  try {
    const orgData = await db
      .select()
      .from(titan100OrgData)
      .where(
        eq(titan100OrgData.organizationId, parseInt(req.params.organizationId))
      )
      .limit(1);

    if (!orgData.length) {
      return res.status(404).json({
        success: false,
        error: 'Titan100 data not found for this organization',
      });
    }

    res.json({ success: true, data: orgData[0] });
  } catch (error) {
    console.error('Error fetching Titan100 data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Titan100 data' });
  }
});

// ==================== Judge Performance Routes ====================

/**
 * GET /api/judge-performance
 * Get judge performance metrics
 */
router.get('/judge-performance', async (req: Request, res: Response) => {
  try {
    const { organizationId, rubricId, judgeName } = req.query;
    let query = db.select().from(judgePerformance);

    if (organizationId) {
      query = query.where(
        eq(judgePerformance.organizationId, parseInt(organizationId as string))
      );
    }

    if (rubricId) {
      query = query.where(
        and(
          eq(judgePerformance.organizationId, parseInt(organizationId as string)),
          eq(judgePerformance.rubricId, parseInt(rubricId as string))
        )
      );
    }

    if (judgeName) {
      query = query.where(eq(judgePerformance.judgeName, judgeName as string));
    }

    const results = await query.orderBy(desc(judgePerformance.computedAt));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching judge performance:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch judge performance' });
  }
});

// ==================== Comparison Dashboard Routes ====================

/**
 * GET /api/dashboard/comparison
 * Get comparison dashboard data
 */
router.get('/dashboard/comparison', async (req: Request, res: Response) => {
  try {
    const { organizationId, rubricId, dashboardType } = req.query;

    if (!organizationId || !rubricId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId and rubricId are required',
      });
    }

    let query = db
      .select()
      .from(comparisonDashboardData)
      .where(
        and(
          eq(
            comparisonDashboardData.organizationId,
            parseInt(organizationId as string)
          ),
          eq(comparisonDashboardData.rubricId, parseInt(rubricId as string))
        )
      );

    if (dashboardType) {
      query = query.where(
        and(
          eq(
            comparisonDashboardData.organizationId,
            parseInt(organizationId as string)
          ),
          eq(comparisonDashboardData.rubricId, parseInt(rubricId as string)),
          eq(comparisonDashboardData.dashboardType, dashboardType as string)
        )
      );
    }

    const results = await query
      .orderBy(desc(comparisonDashboardData.computedAt))
      .limit(1);

    if (!results.length) {
      return res.json({
        success: true,
        data: null,
        message: 'No dashboard data available yet',
      });
    }

    res.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

export default router;
