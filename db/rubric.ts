import { ScoringType } from './enums';

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  weight: number;
  maxScore?: number;
}

export interface ScoringConfig {
  min?: number;
  max?: number;
  tiers?: string[];
  grades?: string[];
  passingScore?: number;
  customScale?: { value: string; min: number; max: number }[];
}

export interface Rubric {
  id: number;
  organizationId: number;
  name: string;
  description?: string;
  criteria: Criterion[];
  scoringType: ScoringType;
  scoringConfig: ScoringConfig;
  createdAt: Date;
}

export interface CreateRubricInput {
  organizationId: number;
  name: string;
  description?: string;
  criteria: Criterion[];
  scoringType: ScoringType;
  scoringConfig: ScoringConfig;
}
