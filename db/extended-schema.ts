/**
 * Extended Database Schema for Titan100 and AI Scoring
 *
 * This extends the base schema with additional tables for:
 * - PDF document storage
 * - AI evaluations
 * - Bias analysis
 * - Scoring workflow tracking
 * - Titan100-specific data
 */

import { pgTable, serial, text, timestamp, integer, real, jsonb, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations, rubrics, applications, evaluations } from './schema';

// ==================== PDF Documents Table ====================

export const pdfDocuments = pgTable('pdf_documents', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'instructions', 'rubric', 'letter', 'guidelines', 'other'
  title: text('title').notNull(),
  description: text('description'),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(), // URL or path to stored PDF
  fileSize: integer('file_size').notNull(), // Size in bytes
  uploadedBy: text('uploaded_by').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  metadata: jsonb('metadata'), // Additional metadata (tags, categories, etc.)
});

// ==================== AI Evaluations Table ====================

export const aiEvaluations = pgTable('ai_evaluations', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .notNull()
    .references(() => rubrics.id, { onDelete: 'cascade' }),
  agentName: text('agent_name').notNull(), // e.g., 'SoTruth AI Scoring Agent'
  agentVersion: text('agent_version').notNull(), // Track agent version for auditability
  criterionScores: jsonb('criterion_scores').notNull(), // Array of CriterionScore objects
  totalScore: real('total_score').notNull(),
  overallComments: text('overall_comments'),
  flaggedConcerns: jsonb('flagged_concerns'), // Array of concerns
  confidence: real('confidence'), // Overall confidence score (0-1)
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  executionTimeMs: integer('execution_time_ms'), // Track performance
});

// ==================== Bias Analysis Table ====================

export const biasAnalyses = pgTable('bias_analyses', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .notNull()
    .references(() => rubrics.id, { onDelete: 'cascade' }),
  analysisName: text('analysis_name').notNull(), // e.g., "Q1 2026 Bias Analysis"
  overallCorrelation: real('overall_correlation').notNull(),
  averageScoreDifference: real('average_score_difference').notNull(),
  significantDiscrepancies: jsonb('significant_discrepancies').notNull(), // Array of ScoreDiscrepancy objects
  biasIndicators: jsonb('bias_indicators').notNull(), // Array of bias indicator objects
  recommendations: jsonb('recommendations').notNull(), // Array of recommendation strings
  analyzedApplicationCount: integer('analyzed_application_count').notNull(),
  analyzedAt: timestamp('analyzed_at').defaultNow().notNull(),
  reportUrl: text('report_url'), // URL to detailed PDF report
});

// ==================== Scoring Workflow Table ====================

export const scoringWorkflows = pgTable('scoring_workflows', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  humanScoringComplete: boolean('human_scoring_complete').default(false).notNull(),
  aiScoringComplete: boolean('ai_scoring_complete').default(false).notNull(),
  biasAnalysisComplete: boolean('bias_analysis_complete').default(false).notNull(),
  governanceReviewRequired: boolean('governance_review_required').default(false).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'in_progress', 'completed', 'flagged'
  currentStep: text('current_step'), // Human-readable description of current step
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== Titan100 Organization Data Table ====================

export const titan100OrgData = pgTable('titan100_org_data', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  programName: text('program_name').notNull(), // e.g., "2026 Chicago Titan 100"
  programYear: integer('program_year').notNull(),
  location: text('location').notNull(), // e.g., "Chicago"
  awardsDate: timestamp('awards_date').notNull(),
  venue: text('venue').notNull(), // e.g., "The Geraghty"
  totalAwardsCount: integer('total_awards_count').notNull(), // e.g., 100
  titanDefinition: jsonb('titan_definition').notNull(), // TitanDefinition object
  eligibilityRequirements: jsonb('eligibility_requirements').notNull(), // Titan100Eligibility object
  judgingPlatform: text('judging_platform').notNull(), // e.g., "Awards Force"
  judgingInstructionsUrl: text('judging_instructions_url'), // Reference to PDF document
  contacts: jsonb('contacts').notNull(), // Array of contact objects
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== Comparison Dashboard Data Table ====================

/**
 * Stores pre-computed comparison data for dashboards to avoid
 * real-time computation on every page load
 */
export const comparisonDashboardData = pgTable('comparison_dashboard_data', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .notNull()
    .references(() => rubrics.id, { onDelete: 'cascade' }),
  dashboardType: varchar('dashboard_type', { length: 50 }).notNull(), // 'overview', 'criterion', 'judge', 'application'
  dataSnapshot: jsonb('data_snapshot').notNull(), // Pre-computed metrics and charts data
  computedAt: timestamp('computed_at').defaultNow().notNull(),
  validUntil: timestamp('valid_until').notNull(), // Cache expiration
});

// ==================== Judge Performance Table ====================

/**
 * Tracks individual judge performance and consistency metrics
 */
export const judgePerformance = pgTable('judge_performance', {
  id: serial('id').primaryKey(),
  judgeName: text('judge_name').notNull(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .notNull()
    .references(() => rubrics.id, { onDelete: 'cascade' }),
  applicationsScored: integer('applications_scored').notNull(),
  averageScore: real('average_score').notNull(),
  standardDeviation: real('standard_deviation').notNull(),
  correlationWithAI: real('correlation_with_ai'), // How well aligned with AI
  correlationWithPeers: real('correlation_with_peers'), // How well aligned with other judges
  leniencyBias: real('leniency_bias'), // Tendency to score high (+) or low (-)
  consistency: real('consistency'), // 0-1, how consistent are their scores
  completionRate: real('completion_rate'), // % of assigned applications completed
  averageTimePerApp: integer('average_time_per_app'), // Minutes
  lastActiveAt: timestamp('last_active_at'),
  notes: text('notes'),
  computedAt: timestamp('computed_at').defaultNow().notNull(),
});

// ==================== Relations ====================

export const pdfDocumentsRelations = relations(pdfDocuments, ({ one }) => ({
  organization: one(organizations, {
    fields: [pdfDocuments.organizationId],
    references: [organizations.id],
  }),
}));

export const aiEvaluationsRelations = relations(aiEvaluations, ({ one }) => ({
  application: one(applications, {
    fields: [aiEvaluations.applicationId],
    references: [applications.id],
  }),
  rubric: one(rubrics, {
    fields: [aiEvaluations.rubricId],
    references: [rubrics.id],
  }),
}));

export const biasAnalysesRelations = relations(biasAnalyses, ({ one }) => ({
  organization: one(organizations, {
    fields: [biasAnalyses.organizationId],
    references: [organizations.id],
  }),
  rubric: one(rubrics, {
    fields: [biasAnalyses.rubricId],
    references: [rubrics.id],
  }),
}));

export const scoringWorkflowsRelations = relations(scoringWorkflows, ({ one }) => ({
  application: one(applications, {
    fields: [scoringWorkflows.applicationId],
    references: [applications.id],
  }),
}));

export const titan100OrgDataRelations = relations(titan100OrgData, ({ one }) => ({
  organization: one(organizations, {
    fields: [titan100OrgData.organizationId],
    references: [organizations.id],
  }),
}));

export const comparisonDashboardDataRelations = relations(
  comparisonDashboardData,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [comparisonDashboardData.organizationId],
      references: [organizations.id],
    }),
    rubric: one(rubrics, {
      fields: [comparisonDashboardData.rubricId],
      references: [rubrics.id],
    }),
  })
);

export const judgePerformanceRelations = relations(judgePerformance, ({ one }) => ({
  organization: one(organizations, {
    fields: [judgePerformance.organizationId],
    references: [organizations.id],
  }),
  rubric: one(rubrics, {
    fields: [judgePerformance.rubricId],
    references: [rubrics.id],
  }),
}));
