export interface Evaluation {
  id: number;
  applicationId: number;
  rubricId: number;
  evaluatorName: string;
  scores: Record<string, any>;
  totalScore: number;
  grade: string;
  comments?: string;
  evaluatedAt: Date;
}

export interface CreateEvaluationInput {
  applicationId: number;
  rubricId: number;
  evaluatorName: string;
  scores: Record<string, any>;
  totalScore: number;
  grade: string;
  comments?: string;
}
