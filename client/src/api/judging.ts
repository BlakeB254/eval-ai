/**
 * API client functions for judging workflow
 */

import { apiClient } from './client';
import {
  getMockApplications,
  getMockApplication,
  getMockOrganization,
  getMockRubric,
  getMockTitan100Data,
  getMockEvaluations,
} from './mockData';

export interface Application {
  id: number;
  organizationId: number;
  applicantId: number;
  submittedAt: Date;
  submissionData: Record<string, any>;
}

export interface Rubric {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  criteria: Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
    ratingDescriptions: Record<string, string>;
  }>;
  scoringType: string;
  scoringConfig: {
    minScore: number;
    maxScore: number;
    maxTotalScore: number;
    passingScore?: number;
  };
}

export interface Evaluation {
  id?: number;
  applicationId: number;
  rubricId: number;
  judgeName: string;
  criterionScores: Array<{
    criterionId: string;
    score: number;
    reasoning?: string;
  }>;
  totalScore: number;
  comments?: string;
  evaluatedAt?: Date;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  applicationStructure: any;
}

export interface Titan100OrgData {
  id: number;
  organizationId: number;
  programName: string;
  programYear: number;
  location: string;
  titanDefinition: {
    definition: string;
    qualities: string[];
    examples: string[];
  };
  eligibilityRequirements: {
    businessAge: number;
    revenue: number;
    cSuiteRole: boolean;
  };
  judgingInstructionsUrl?: string;
}

/**
 * Fetch all applications for an organization
 */
export async function getApplications(organizationId: number): Promise<Application[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Application[] }>(
      `/applications?organizationId=${organizationId}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return getMockApplications();
  }
}

/**
 * Fetch a specific application by ID
 */
export async function getApplication(id: number): Promise<Application> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Application }>(
      `/applications/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    const app = getMockApplication(id);
    if (!app) {
      throw new Error(`Application ${id} not found`);
    }
    return app;
  }
}

/**
 * Fetch rubrics for an organization
 */
export async function getRubrics(organizationId: number): Promise<Rubric[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Rubric[] }>(
      `/rubrics?organizationId=${organizationId}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return [getMockRubric()];
  }
}

/**
 * Fetch a specific rubric
 */
export async function getRubric(id: number): Promise<Rubric> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Rubric }>(`/rubrics/${id}`);
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return getMockRubric();
  }
}

/**
 * Submit a new evaluation
 */
export async function submitEvaluation(evaluation: Evaluation): Promise<Evaluation> {
  try {
    const response = await apiClient.post<{ success: boolean; data: Evaluation }>(
      '/evaluations',
      evaluation
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, evaluation not saved (demo mode)');
    // Return the evaluation with a mock ID
    return { ...evaluation, id: Date.now(), evaluatedAt: new Date() };
  }
}

/**
 * Fetch evaluations for an application
 */
export async function getEvaluations(applicationId: number): Promise<Evaluation[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Evaluation[] }>(
      `/evaluations?applicationId=${applicationId}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return getMockEvaluations(applicationId);
  }
}

/**
 * Fetch organization details
 */
export async function getOrganization(id: number): Promise<Organization> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Organization }>(
      `/organizations/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return getMockOrganization();
  }
}

/**
 * Fetch Titan100-specific organization data
 */
export async function getTitan100Data(organizationId: number): Promise<Titan100OrgData> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Titan100OrgData }>(
      `/titan100-data/${organizationId}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    return getMockTitan100Data();
  }
}
