export interface Application {
  id: number;
  applicantId: number;
  organizationId: number;
  submissionData: Record<string, any>;
  submittedAt: Date;
}

export interface CreateApplicationInput {
  applicantId: number;
  organizationId: number;
  submissionData: Record<string, any>;
}
