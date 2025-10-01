/**
 * API client functions for comparison dashboard
 */

import { apiClient } from './client';

export interface ComparisonData {
  applicationId: number;
  judgeName: string;
  humanScore: number;
  aiScore: number;
  discrepancy: number;
  criterionBreakdown: Array<{
    criterionId: string;
    criterionName: string;
    humanScore: number;
    aiScore: number;
    difference: number;
  }>;
}

export interface BiasIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedApplications: number[];
  affectedJudges?: string[];
}

export interface JudgePerformance {
  judgeName: string;
  totalEvaluations: number;
  averageScore: number;
  averageAiScore: number;
  correlation: number;
  averageDiscrepancy: number;
  consistency: number;
  biasIndicators: BiasIndicator[];
}

export interface ComparisonSummary {
  totalApplications: number;
  averageHumanScore: number;
  averageAiScore: number;
  correlation: number;
  averageDiscrepancy: number;
  biasIndicators: BiasIndicator[];
  comparisons: ComparisonData[];
  judgePerformance: JudgePerformance[];
}

/**
 * Get comparison data for an organization
 */
export async function getComparisonData(
  organizationId: number,
  rubricId?: number
): Promise<ComparisonSummary> {
  const params = new URLSearchParams({ organizationId: organizationId.toString() });
  if (rubricId) params.append('rubricId', rubricId.toString());

  const response = await apiClient.get<{ success: boolean; data: ComparisonSummary }>(
    `/dashboard/comparison?${params}`
  );
  return response.data.data;
}

/**
 * Generate mock comparison data (temporary until AI scoring is implemented)
 */
export async function generateMockComparisonData(
  organizationId: number
): Promise<ComparisonSummary> {
  // This simulates what the real data would look like
  return {
    totalApplications: 3,
    averageHumanScore: 3.8,
    averageAiScore: 3.9,
    correlation: 0.85,
    averageDiscrepancy: 0.3,
    biasIndicators: [
      {
        type: 'Leniency Bias',
        severity: 'low',
        description: 'Human scores tend to be slightly lower than AI scores',
        affectedApplications: [2, 3],
        affectedJudges: ['Sarah Johnson', 'Michael Chen'],
      },
      {
        type: 'Halo Effect',
        severity: 'medium',
        description: 'Application #4 shows unusually consistent high scores across criteria',
        affectedApplications: [4],
        affectedJudges: ['Emily Rodriguez'],
      },
    ],
    comparisons: [
      {
        applicationId: 2,
        judgeName: 'Sarah Johnson',
        humanScore: 4.2,
        aiScore: 4.5,
        discrepancy: 0.3,
        criterionBreakdown: [
          {
            criterionId: 'entrepreneurial_journey',
            criterionName: 'Entrepreneurial Journey',
            humanScore: 4,
            aiScore: 5,
            difference: 1,
          },
          {
            criterionId: 'company_vision',
            criterionName: 'Company Vision',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
          {
            criterionId: 'what_makes_titan',
            criterionName: 'What Makes a Titan',
            humanScore: 5,
            aiScore: 5,
            difference: 0,
          },
          {
            criterionId: 'accomplishments',
            criterionName: 'Accomplishments',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
        ],
      },
      {
        applicationId: 3,
        judgeName: 'Michael Chen',
        humanScore: 3.5,
        aiScore: 3.8,
        discrepancy: 0.3,
        criterionBreakdown: [
          {
            criterionId: 'entrepreneurial_journey',
            criterionName: 'Entrepreneurial Journey',
            humanScore: 3,
            aiScore: 4,
            difference: 1,
          },
          {
            criterionId: 'company_vision',
            criterionName: 'Company Vision',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
          {
            criterionId: 'what_makes_titan',
            criterionName: 'What Makes a Titan',
            humanScore: 3,
            aiScore: 3,
            difference: 0,
          },
          {
            criterionId: 'accomplishments',
            criterionName: 'Accomplishments',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
        ],
      },
      {
        applicationId: 4,
        judgeName: 'Emily Rodriguez',
        humanScore: 3.8,
        aiScore: 3.5,
        discrepancy: 0.3,
        criterionBreakdown: [
          {
            criterionId: 'entrepreneurial_journey',
            criterionName: 'Entrepreneurial Journey',
            humanScore: 4,
            aiScore: 3,
            difference: -1,
          },
          {
            criterionId: 'company_vision',
            criterionName: 'Company Vision',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
          {
            criterionId: 'what_makes_titan',
            criterionName: 'What Makes a Titan',
            humanScore: 4,
            aiScore: 4,
            difference: 0,
          },
          {
            criterionId: 'accomplishments',
            criterionName: 'Accomplishments',
            humanScore: 3,
            aiScore: 3,
            difference: 0,
          },
        ],
      },
    ],
    judgePerformance: [
      {
        judgeName: 'Sarah Johnson',
        totalEvaluations: 1,
        averageScore: 4.2,
        averageAiScore: 4.5,
        correlation: 0.92,
        averageDiscrepancy: 0.3,
        consistency: 0.88,
        biasIndicators: [
          {
            type: 'Leniency Bias',
            severity: 'low',
            description: 'Tends to score 0.3 points lower than AI on average',
            affectedApplications: [2],
          },
        ],
      },
      {
        judgeName: 'Michael Chen',
        totalEvaluations: 1,
        averageScore: 3.5,
        averageAiScore: 3.8,
        correlation: 0.78,
        averageDiscrepancy: 0.3,
        consistency: 0.85,
        biasIndicators: [
          {
            type: 'Strictness Bias',
            severity: 'low',
            description: 'Consistently scores lower than AI, particularly on technical criteria',
            affectedApplications: [3],
          },
        ],
      },
      {
        judgeName: 'Emily Rodriguez',
        totalEvaluations: 1,
        averageScore: 3.8,
        averageAiScore: 3.5,
        correlation: 0.85,
        averageDiscrepancy: 0.3,
        consistency: 0.75,
        biasIndicators: [
          {
            type: 'Halo Effect',
            severity: 'medium',
            description: 'Shows unusually consistent high scores across all criteria',
            affectedApplications: [4],
          },
        ],
      },
    ],
  };
}
