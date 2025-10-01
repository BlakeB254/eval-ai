import { pgTable, serial, text, timestamp, integer, real, jsonb, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Organizations Table
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  contactInfo: jsonb('contact_info'),
  applicationStructure: jsonb('application_structure').notNull(), // Array of FormField
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Rubrics Table
export const rubrics = pgTable('rubrics', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  criteria: jsonb('criteria').notNull(), // Array of Criterion
  scoringType: varchar('scoring_type', { length: 50 }).notNull(),
  scoringConfig: jsonb('scoring_config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Applicants Table
export const applicants = pgTable('applicants', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Applications Table
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  applicantId: integer('applicant_id')
    .notNull()
    .references(() => applicants.id, { onDelete: 'cascade' }),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  submissionData: jsonb('submission_data').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Evaluations Table
export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .notNull()
    .references(() => rubrics.id, { onDelete: 'cascade' }),
  evaluatorName: text('evaluator_name').notNull(),
  scores: jsonb('scores').notNull(),
  totalScore: real('total_score').notNull(),
  grade: text('grade').notNull(),
  comments: text('comments'),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
});

// Field Mappings Table
export const fieldMappings = pgTable('field_mappings', {
  id: serial('id').primaryKey(),
  sourceOrgId: integer('source_org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  targetOrgId: integer('target_org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  mappingConfig: jsonb('mapping_config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Example Applications Table
export const exampleApplications = pgTable('example_applications', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  rubricId: integer('rubric_id')
    .references(() => rubrics.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  sampleData: jsonb('sample_data').notNull(),
  sampleEvaluation: jsonb('sample_evaluation'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  rubrics: many(rubrics),
  applications: many(applications),
  exampleApplications: many(exampleApplications),
}));

export const rubricsRelations = relations(rubrics, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [rubrics.organizationId],
    references: [organizations.id],
  }),
  evaluations: many(evaluations),
}));

export const applicantsRelations = relations(applicants, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  applicant: one(applicants, {
    fields: [applications.applicantId],
    references: [applicants.id],
  }),
  organization: one(organizations, {
    fields: [applications.organizationId],
    references: [organizations.id],
  }),
  evaluations: many(evaluations),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  application: one(applications, {
    fields: [evaluations.applicationId],
    references: [applications.id],
  }),
  rubric: one(rubrics, {
    fields: [evaluations.rubricId],
    references: [rubrics.id],
  }),
}));
