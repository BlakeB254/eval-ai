/**
 * Bias Analysis Agent
 *
 * Analyzes scoring patterns to detect and quantify potential bias between
 * human judges and AI scoring.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { biasAnalysisAgentConfig, toSDKOptions } from '../config/agent-config';
import {
  type BiasAnalysisInput,
  type BiasAnalysis,
  type ScoreDiscrepancy,
  type Evaluation,
  BiasAnalysisSchema,
} from '../types';

/**
 * Bias Analysis Agent
 *
 * Compares human and AI evaluations to identify bias patterns and provide
 * recommendations for improving fairness.
 */
export class BiasAnalysisAgent {
  private readonly config = biasAnalysisAgentConfig;

  /**
   * Analyze bias between human and AI evaluations
   */
  async analyzeBias(input: BiasAnalysisInput): Promise<BiasAnalysis> {
    const { humanEvaluations, aiEvaluations, rubric } = input;

    // Calculate statistical metrics
    const discrepancies = this.calculateDiscrepancies(
      humanEvaluations,
      aiEvaluations
    );
    const correlation = this.calculateCorrelation(
      humanEvaluations,
      aiEvaluations
    );
    const avgDifference = this.calculateAverageDifference(discrepancies);

    // Build analysis prompt
    const analysisPrompt = this.buildAnalysisPrompt(
      humanEvaluations,
      aiEvaluations,
      discrepancies,
      correlation,
      rubric.name
    );

    // Execute the agent
    const sdkOptions = {
      ...toSDKOptions(this.config),
      permissionMode: 'bypassPermissions' as const,
      settingSources: [] as const,
    };

    let fullResponse = '';
    const queryResult = query({
      prompt: analysisPrompt,
      options: sdkOptions,
    });

    for await (const message of queryResult) {
      if (message.type === 'assistant' && message.message.content) {
        for (const content of message.message.content) {
          if (content.type === 'text') {
            fullResponse += content.text;
          }
        }
      }
    }

    // Parse the agent's response
    const analysis = this.parseAnalysisResponse(
      fullResponse,
      correlation,
      avgDifference,
      discrepancies
    );

    return BiasAnalysisSchema.parse(analysis);
  }

  /**
   * Calculate score discrepancies for each criterion
   */
  private calculateDiscrepancies(
    humanEvals: Evaluation[],
    aiEvals: Evaluation[]
  ): ScoreDiscrepancy[] {
    const discrepancies: ScoreDiscrepancy[] = [];

    // Match evaluations by application ID
    for (const humanEval of humanEvals) {
      const aiEval = aiEvals.find(
        (ae) => ae.applicationId === humanEval.applicationId
      );
      if (!aiEval) continue;

      // Compare each criterion
      for (const humanScore of humanEval.criterionScores) {
        const aiScore = aiEval.criterionScores.find(
          (cs) => cs.criterionId === humanScore.criterionId
        );
        if (!aiScore) continue;

        const difference = humanScore.score - aiScore.score;
        const percentDiff =
          aiScore.score !== 0
            ? (difference / aiScore.score) * 100
            : difference * 100;

        discrepancies.push({
          applicationId: humanEval.applicationId,
          criterionId: humanScore.criterionId,
          humanScore: humanScore.score,
          aiScore: aiScore.score,
          difference,
          percentDifference: Math.round(percentDiff * 10) / 10,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Calculate correlation coefficient between human and AI scores
   */
  private calculateCorrelation(
    humanEvals: Evaluation[],
    aiEvals: Evaluation[]
  ): number {
    const pairs: Array<[number, number]> = [];

    for (const humanEval of humanEvals) {
      const aiEval = aiEvals.find(
        (ae) => ae.applicationId === humanEval.applicationId
      );
      if (aiEval) {
        pairs.push([humanEval.totalScore, aiEval.totalScore]);
      }
    }

    if (pairs.length === 0) return 0;

    // Pearson correlation coefficient
    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Calculate average score difference
   */
  private calculateAverageDifference(
    discrepancies: ScoreDiscrepancy[]
  ): number {
    if (discrepancies.length === 0) return 0;
    const sum = discrepancies.reduce(
      (acc, d) => acc + Math.abs(d.difference),
      0
    );
    return Math.round((sum / discrepancies.length) * 100) / 100;
  }

  /**
   * Build the analysis prompt
   */
  private buildAnalysisPrompt(
    humanEvals: Evaluation[],
    aiEvals: Evaluation[],
    discrepancies: ScoreDiscrepancy[],
    correlation: number,
    rubricName: string
  ): string {
    // Get significant discrepancies (difference > 1 point)
    const significant = discrepancies.filter(
      (d) => Math.abs(d.difference) > 1
    );

    return `# Bias Analysis Task

You are analyzing the scoring patterns between human judges and an AI scoring system for the **${rubricName}** program.

## Statistical Summary

- **Total Applications Analyzed:** ${humanEvals.length}
- **Correlation Coefficient:** ${correlation.toFixed(3)} (1.0 = perfect agreement, 0 = no correlation, -1.0 = inverse)
- **Average Absolute Score Difference:** ${this.calculateAverageDifference(discrepancies).toFixed(2)} points
- **Significant Discrepancies (>1 point):** ${significant.length} out of ${discrepancies.length} criterion scores

## Score Discrepancies

${this.formatDiscrepancies(significant.slice(0, 20))} ${significant.length > 20 ? `\n... and ${significant.length - 20} more` : ''}

## Your Task

Analyze these scoring patterns and identify potential bias indicators. Consider:

1. **Systematic Bias Patterns**: Are humans consistently scoring higher or lower than AI?
2. **Criterion-Specific Bias**: Do certain criteria show more discrepancy than others?
3. **Potential Bias Types**:
   - **Halo Effect**: Overall positive/negative impression affecting individual criteria
   - **Leniency/Severity Bias**: Tendency to score higher or lower than rubric indicates
   - **Recency Bias**: More recent applications scored differently
   - **Demographic Bias**: Scores varying based on applicant characteristics
   - **Industry Bias**: Certain industries receiving preferential treatment

4. **Root Causes**: What might explain the observed discrepancies?
5. **Recommendations**: How can we improve scoring consistency and fairness?

## Output Format

Respond in JSON format:

\`\`\`json
{
  "biasIndicators": [
    {
      "type": "bias_type",
      "description": "What pattern was observed",
      "affectedApplications": [1, 2, 3],
      "severity": "low|medium|high"
    }
  ],
  "recommendations": [
    "Specific, actionable recommendation",
    "Another recommendation"
  ]
}
\`\`\`

Begin your analysis now.`;
  }

  /**
   * Format discrepancies for the prompt
   */
  private formatDiscrepancies(discrepancies: ScoreDiscrepancy[]): string {
    return discrepancies
      .map(
        (d) =>
          `- App ${d.applicationId}, Criterion ${d.criterionId}: Human=${d.humanScore}, AI=${d.aiScore}, Diff=${d.difference > 0 ? '+' : ''}${d.difference}`
      )
      .join('\n');
  }

  /**
   * Parse the agent's analysis response
   */
  private parseAnalysisResponse(
    response: string,
    correlation: number,
    avgDifference: number,
    discrepancies: ScoreDiscrepancy[]
  ): BiasAnalysis {
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Could not parse analysis response: No JSON found');
    }

    const parsed = JSON.parse(jsonMatch[1]);

    // Get significant discrepancies
    const significantDiscrepancies = discrepancies
      .filter((d) => Math.abs(d.difference) > 1)
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
      .slice(0, 50); // Top 50

    return {
      overallCorrelation: Math.round(correlation * 1000) / 1000,
      averageScoreDifference: avgDifference,
      significantDiscrepancies,
      biasIndicators: parsed.biasIndicators || [],
      recommendations: parsed.recommendations || [],
      analyzedAt: new Date(),
    };
  }

  /**
   * Generate a human-readable report
   */
  generateReport(analysis: BiasAnalysis): string {
    return `# Bias Analysis Report

Generated: ${analysis.analyzedAt.toLocaleString()}

## Executive Summary

- **Overall Correlation**: ${analysis.overallCorrelation.toFixed(3)} (${this.interpretCorrelation(analysis.overallCorrelation)})
- **Average Score Difference**: ${analysis.averageScoreDifference.toFixed(2)} points
- **Significant Discrepancies**: ${analysis.significantDiscrepancies.length}
- **Bias Indicators Found**: ${analysis.biasIndicators.length}

## Bias Indicators

${analysis.biasIndicators
  .map(
    (indicator, i) => `### ${i + 1}. ${indicator.type} (${indicator.severity.toUpperCase()} severity)

${indicator.description}

**Affected Applications**: ${indicator.affectedApplications.length}
`
  )
  .join('\n')}

## Recommendations

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Top Score Discrepancies

${analysis.significantDiscrepancies
  .slice(0, 10)
  .map(
    (d) =>
      `- Application ${d.applicationId}, Criterion ${d.criterionId}: Difference of ${d.difference > 0 ? '+' : ''}${d.difference} points (${d.percentDifference}%)`
  )
  .join('\n')}
`;
  }

  /**
   * Interpret correlation coefficient
   */
  private interpretCorrelation(r: number): string {
    const absR = Math.abs(r);
    if (absR >= 0.9) return 'Very strong agreement';
    if (absR >= 0.7) return 'Strong agreement';
    if (absR >= 0.5) return 'Moderate agreement';
    if (absR >= 0.3) return 'Weak agreement';
    return 'Very weak or no agreement';
  }
}

/**
 * Factory function to create a bias analysis agent
 */
export function createBiasAnalysisAgent(): BiasAnalysisAgent {
  return new BiasAnalysisAgent();
}
