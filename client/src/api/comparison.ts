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
  try {
    const params = new URLSearchParams({ organizationId: organizationId.toString() });
    if (rubricId) params.append('rubricId', rubricId.toString());

    const response = await apiClient.get<{ success: boolean; data: ComparisonSummary }>(
      `/dashboard/comparison?${params}`
    );
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, using mock comparison data');
    return generateMockComparisonData(organizationId);
  }
}

/**
 * Generate mock comparison data (temporary until AI scoring is implemented)
 */
export async function generateMockComparisonData(
  organizationId: number
): Promise<ComparisonSummary> {
  // Real application IDs from seed (5-14) and judge names
  const applicationIds = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const judgeNames = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Park',
    'Amanda Williams',
  ];

  // Generate comparisons for each application (1-2 judges per application for demo)
  const comparisons: ComparisonData[] = [];

  applicationIds.forEach((appId, index) => {
    // Assign 1-2 judges per application
    const numJudges = index % 2 === 0 ? 2 : 1;
    const judgeSubset = judgeNames.slice(0, numJudges);

    judgeSubset.forEach((judgeName) => {
      const baseHumanScore = 3 + Math.random() * 2; // 3.0-5.0
      const baseAiScore = baseHumanScore + (Math.random() - 0.5) * 0.8; // Slight variation

      comparisons.push({
        applicationId: appId,
        judgeName: judgeName,
        humanScore: Number(baseHumanScore.toFixed(2)),
        aiScore: Number(baseAiScore.toFixed(2)),
        discrepancy: Number(Math.abs(baseAiScore - baseHumanScore).toFixed(2)),
        criterionBreakdown: [
          {
            criterionId: 'entrepreneurial_journey',
            criterionName: 'Entrepreneurial Journey',
            humanScore: Math.round(baseHumanScore),
            aiScore: Math.round(baseAiScore),
            difference: Math.round(baseAiScore) - Math.round(baseHumanScore),
          },
          {
            criterionId: 'company_vision',
            criterionName: 'Company Vision',
            humanScore: Math.round(baseHumanScore + (Math.random() - 0.5)),
            aiScore: Math.round(baseAiScore + (Math.random() - 0.5)),
            difference: 0,
          },
          {
            criterionId: 'what_makes_titan',
            criterionName: 'What Makes a Titan',
            humanScore: Math.round(baseHumanScore - (Math.random() * 0.5)),
            aiScore: Math.round(baseAiScore - (Math.random() * 0.5)),
            difference: 0,
          },
          {
            criterionId: 'accomplishments',
            criterionName: 'Accomplishments',
            humanScore: Math.round(baseHumanScore + (Math.random() * 0.5)),
            aiScore: Math.round(baseAiScore + (Math.random() * 0.5)),
            difference: 0,
          },
        ],
      });
    });
  });

  // Calculate statistics
  const avgHuman = comparisons.reduce((sum, c) => sum + c.humanScore, 0) / comparisons.length;
  const avgAi = comparisons.reduce((sum, c) => sum + c.aiScore, 0) / comparisons.length;
  const avgDiscrepancy = comparisons.reduce((sum, c) => sum + c.discrepancy, 0) / comparisons.length;

  // Calculate judge performance
  const judgePerformance: JudgePerformance[] = judgeNames.map((judgeName) => {
    const judgeComparisons = comparisons.filter((c) => c.judgeName === judgeName);
    const judgeAvgScore = judgeComparisons.reduce((sum, c) => sum + c.humanScore, 0) / judgeComparisons.length;
    const judgeAvgAiScore = judgeComparisons.reduce((sum, c) => sum + c.aiScore, 0) / judgeComparisons.length;
    const judgeDiscrepancy = Math.abs(judgeAvgScore - judgeAvgAiScore);

    return {
      judgeName,
      totalEvaluations: judgeComparisons.length,
      averageScore: Number(judgeAvgScore.toFixed(2)),
      averageAiScore: Number(judgeAvgAiScore.toFixed(2)),
      correlation: 0.75 + Math.random() * 0.2, // 0.75-0.95
      averageDiscrepancy: Number(judgeDiscrepancy.toFixed(2)),
      consistency: 0.8 + Math.random() * 0.15, // 0.8-0.95
      biasIndicators: judgeDiscrepancy > 0.4 ? [
        {
          type: judgeAvgScore > judgeAvgAiScore ? 'Leniency Bias' : 'Strictness Bias',
          severity: judgeDiscrepancy > 0.6 ? 'medium' : 'low',
          description: `Scores ${judgeAvgScore > judgeAvgAiScore ? 'higher' : 'lower'} than AI by ${judgeDiscrepancy.toFixed(2)} points on average`,
          affectedApplications: judgeComparisons.map((c) => c.applicationId),
        },
      ] : [],
    };
  });

  return {
    totalApplications: applicationIds.length,
    averageHumanScore: Number(avgHuman.toFixed(2)),
    averageAiScore: Number(avgAi.toFixed(2)),
    correlation: 0.85,
    averageDiscrepancy: Number(avgDiscrepancy.toFixed(2)),
    biasIndicators: [
      {
        type: 'Leniency Bias',
        severity: 'low',
        description: 'Some judges tend to score slightly higher than AI on technical criteria',
        affectedApplications: [5, 7, 9],
        affectedJudges: ['Sarah Johnson', 'David Park'],
      },
    ],
    comparisons: comparisons,
    judgePerformance: judgePerformance,
  };
}
