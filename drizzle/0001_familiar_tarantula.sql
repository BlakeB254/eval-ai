CREATE TABLE IF NOT EXISTS "ai_evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"rubric_id" integer NOT NULL,
	"agent_name" text NOT NULL,
	"agent_version" text NOT NULL,
	"criterion_scores" jsonb NOT NULL,
	"total_score" real NOT NULL,
	"overall_comments" text,
	"flagged_concerns" jsonb,
	"confidence" real,
	"evaluated_at" timestamp DEFAULT now() NOT NULL,
	"execution_time_ms" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bias_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"rubric_id" integer NOT NULL,
	"analysis_name" text NOT NULL,
	"overall_correlation" real NOT NULL,
	"average_score_difference" real NOT NULL,
	"significant_discrepancies" jsonb NOT NULL,
	"bias_indicators" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"analyzed_application_count" integer NOT NULL,
	"analyzed_at" timestamp DEFAULT now() NOT NULL,
	"report_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comparison_dashboard_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"rubric_id" integer NOT NULL,
	"dashboard_type" varchar(50) NOT NULL,
	"data_snapshot" jsonb NOT NULL,
	"computed_at" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "judge_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"judge_name" text NOT NULL,
	"organization_id" integer NOT NULL,
	"rubric_id" integer NOT NULL,
	"applications_scored" integer NOT NULL,
	"average_score" real NOT NULL,
	"standard_deviation" real NOT NULL,
	"correlation_with_ai" real,
	"correlation_with_peers" real,
	"leniency_bias" real,
	"consistency" real,
	"completion_rate" real,
	"average_time_per_app" integer,
	"last_active_at" timestamp,
	"notes" text,
	"computed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pdf_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scoring_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"human_scoring_complete" boolean DEFAULT false NOT NULL,
	"ai_scoring_complete" boolean DEFAULT false NOT NULL,
	"bias_analysis_complete" boolean DEFAULT false NOT NULL,
	"governance_review_required" boolean DEFAULT false NOT NULL,
	"status" varchar(50) NOT NULL,
	"current_step" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "titan100_org_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"program_name" text NOT NULL,
	"program_year" integer NOT NULL,
	"location" text NOT NULL,
	"awards_date" timestamp NOT NULL,
	"venue" text NOT NULL,
	"total_awards_count" integer NOT NULL,
	"titan_definition" jsonb NOT NULL,
	"eligibility_requirements" jsonb NOT NULL,
	"judging_platform" text NOT NULL,
	"judging_instructions_url" text,
	"contacts" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "titan100_org_data_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bias_analyses" ADD CONSTRAINT "bias_analyses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bias_analyses" ADD CONSTRAINT "bias_analyses_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comparison_dashboard_data" ADD CONSTRAINT "comparison_dashboard_data_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comparison_dashboard_data" ADD CONSTRAINT "comparison_dashboard_data_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "judge_performance" ADD CONSTRAINT "judge_performance_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "judge_performance" ADD CONSTRAINT "judge_performance_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdf_documents" ADD CONSTRAINT "pdf_documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scoring_workflows" ADD CONSTRAINT "scoring_workflows_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "titan100_org_data" ADD CONSTRAINT "titan100_org_data_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
