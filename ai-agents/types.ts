/**
 * AI Agents Type Definitions
 *
 * Core types for the Dual-Track Bias-Minimized Judging Program
 */

import { z } from 'zod';

// ==================== Rubric Schemas ====================

/**
 * Rating scale for rubric criteria (1-5)
 */
export const RatingScaleSchema = z.enum(['1', '2', '3', '4', '5']);
export type RatingScale = z.infer<typeof RatingScaleSchema>;

/**
 * Rubric criterion with rating descriptions
 */
export const RubricCriterionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number().min(0).max(1),
  ratingDescriptions: z.record(RatingScaleSchema, z.string()),
});
export type RubricCriterion = z.infer<typeof RubricCriterionSchema>;

/**
 * Complete rubric definition
 */
export const RubricSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  criteria: z.array(RubricCriterionSchema),
  maxScore: z.number(),
  passingScore: z.number().optional(),
});
export type Rubric = z.infer<typeof RubricSchema>;

// ==================== Application Schemas ====================

/**
 * Titan100 specific application questions
 */
export enum Titan100Question {
  ENTREPRENEURIAL_STORY = 'entrepreneurial_story',
  COMPANY_VISION = 'company_vision',
  WHAT_MAKES_TITAN = 'what_makes_titan',
  ACCOMPLISHMENTS = 'accomplishments',
}

/**
 * Application submission data
 */
export const ApplicationSubmissionSchema = z.object({
  applicantId: z.number(),
  organizationId: z.number(),
  responses: z.record(z.string(), z.string()), // question_id -> response
  companyInfo: z.object({
    name: z.string(),
    website: z.string().url().optional(),
    yearFounded: z.number(),
    revenue: z.number().optional(),
    industry: z.string().optional(),
  }),
  applicantInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    title: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  submittedAt: z.date().optional(),
});
export type ApplicationSubmission = z.infer<typeof ApplicationSubmissionSchema>;

// ==================== Scoring Schemas ====================

/**
 * Individual criterion score with justification
 */
export const CriterionScoreSchema = z.object({
  criterionId: z.string(),
  score: z.number().min(1).max(5),
  evidence: z.string(), // Specific quotes or references from application
  reasoning: z.string(), // Why this score was assigned
  confidence: z.number().min(0).max(1).optional(), // AI confidence level
});
export type CriterionScore = z.infer<typeof CriterionScoreSchema>;

/**
 * Complete evaluation result
 */
export const EvaluationSchema = z.object({
  applicationId: z.number(),
  rubricId: z.number(),
  evaluatorType: z.enum(['human', 'ai']),
  evaluatorName: z.string(),
  criterionScores: z.array(CriterionScoreSchema),
  totalScore: z.number(),
  overallComments: z.string().optional(),
  flaggedConcerns: z.array(z.string()).optional(),
  evaluatedAt: z.date(),
});
export type Evaluation = z.infer<typeof EvaluationSchema>;

// ==================== Bias Analysis Schemas ====================

/**
 * Score discrepancy between human and AI
 */
export const ScoreDiscrepancySchema = z.object({
  applicationId: z.number(),
  criterionId: z.string(),
  humanScore: z.number(),
  aiScore: z.number(),
  difference: z.number(),
  percentDifference: z.number(),
});
export type ScoreDiscrepancy = z.infer<typeof ScoreDiscrepancySchema>;

/**
 * Bias analysis result
 */
export const BiasAnalysisSchema = z.object({
  overallCorrelation: z.number(),
  averageScoreDifference: z.number(),
  significantDiscrepancies: z.array(ScoreDiscrepancySchema),
  biasIndicators: z.array(z.object({
    type: z.string(), // e.g., "halo_effect", "leniency_bias", "demographic_bias"
    description: z.string(),
    affectedApplications: z.array(z.number()),
    severity: z.enum(['low', 'medium', 'high']),
  })),
  recommendations: z.array(z.string()),
  analyzedAt: z.date(),
});
export type BiasAnalysis = z.infer<typeof BiasAnalysisSchema>;

// ==================== Workflow Schemas ====================

/**
 * Dual-track scoring workflow status
 */
export const ScoringWorkflowStatusSchema = z.object({
  applicationId: z.number(),
  humanScoringComplete: z.boolean(),
  aiScoringComplete: z.boolean(),
  biasAnalysisComplete: z.boolean(),
  governanceReviewRequired: z.boolean(),
  status: z.enum(['pending', 'in_progress', 'completed', 'flagged']),
  updatedAt: z.date(),
});
export type ScoringWorkflowStatus = z.infer<typeof ScoringWorkflowStatusSchema>;

// ==================== PDF Document Schemas ====================

/**
 * Stored PDF document (org instructions, letters, etc.)
 */
export const PDFDocumentSchema = z.object({
  id: z.number(),
  organizationId: z.number(),
  documentType: z.enum(['instructions', 'rubric', 'letter', 'guidelines', 'other']),
  title: z.string(),
  description: z.string().optional(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number(), // bytes
  uploadedBy: z.string(),
  uploadedAt: z.date(),
  metadata: z.record(z.any()).optional(),
});
export type PDFDocument = z.infer<typeof PDFDocumentSchema>;

// ==================== Agent Tool Schemas ====================

/**
 * Input for AI scoring agent
 */
export const AIScoringInputSchema = z.object({
  applicationId: z.number(),
  rubricId: z.number(),
  application: ApplicationSubmissionSchema,
  rubric: RubricSchema,
});
export type AIScoringInput = z.infer<typeof AIScoringInputSchema>;

/**
 * Output from AI scoring agent
 */
export const AIScoringOutputSchema = EvaluationSchema;
export type AIScoringOutput = z.infer<typeof AIScoringOutputSchema>;

/**
 * Input for bias analysis agent
 */
export const BiasAnalysisInputSchema = z.object({
  applicationIds: z.array(z.number()),
  humanEvaluations: z.array(EvaluationSchema),
  aiEvaluations: z.array(EvaluationSchema),
  rubric: RubricSchema,
});
export type BiasAnalysisInput = z.infer<typeof BiasAnalysisInputSchema>;

// ==================== Titan100 Specific Schemas ====================

/**
 * Titan100 eligibility requirements
 */
export const Titan100EligibilitySchema = z.object({
  businessAge: z.number().min(3), // Must be in business 3+ years
  revenue: z.number().min(1000000), // Must have $1M+ revenue
  cSuiteRole: z.boolean(), // Must hold C-suite title
});
export type Titan100Eligibility = z.infer<typeof Titan100EligibilitySchema>;

/**
 * Titan definition context
 */
export const TitanDefinitionSchema = z.object({
  definition: z.string(),
  qualities: z.array(z.string()), // e.g., ["exceptional leadership", "vision", "passion", "influence"]
  examples: z.array(z.string()), // Historical examples like Einstein, Shakespeare, etc.
});
export type TitanDefinition = z.infer<typeof TitanDefinitionSchema>;

/**
 * Titan100 organization-specific data
 */
export const Titan100OrgDataSchema = z.object({
  programName: z.string(),
  year: z.number(),
  location: z.string(), // e.g., "Chicago"
  awardsDate: z.date(),
  venue: z.string(),
  totalAwardsCount: z.number(), // e.g., 100
  titanDefinition: TitanDefinitionSchema,
  eligibilityRequirements: Titan100EligibilitySchema,
  judgingPlatform: z.string(), // e.g., "Awards Force"
  judgingInstructions: z.string(), // Full text or reference to PDF
  contacts: z.array(z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email(),
  })),
});
export type Titan100OrgData = z.infer<typeof Titan100OrgDataSchema>;
