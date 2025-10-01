/**
 * SoTruth AI Scoring Agent
 *
 * An AI-powered, rubric-anchored scoring system that provides objective,
 * unbiased evaluations of applications to complement human judging.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { soTruthAgentConfig, toSDKOptions } from '../config/agent-config';
import {
  type AIScoringInput,
  type AIScoringOutput,
  type Rubric,
  type ApplicationSubmission,
  type CriterionScore,
  EvaluationSchema,
} from '../types';

/**
 * SoTruth Scoring Agent
 *
 * Uses Claude with a specialized system prompt and rubric anchoring
 * to provide consistent, objective scoring.
 */
export class SoTruthScoringAgent {
  private readonly config = soTruthAgentConfig;

  /**
   * Score an application using the provided rubric
   */
  async scoreApplication(input: AIScoringInput): Promise<AIScoringOutput> {
    const { application, rubric, applicationId, rubricId } = input;

    // Build the scoring prompt
    const scoringPrompt = this.buildScoringPrompt(application, rubric);

    // Execute the agent
    const sdkOptions = {
      ...toSDKOptions(this.config),
      permissionMode: 'bypassPermissions' as const,
      settingSources: [] as const,
    };

    let fullResponse = '';
    const queryResult = query({
      prompt: scoringPrompt,
      options: sdkOptions,
    });

    // Collect the response
    for await (const message of queryResult) {
      if (message.type === 'assistant' && message.message.content) {
        for (const content of message.message.content) {
          if (content.type === 'text') {
            fullResponse += content.text;
          }
        }
      }
    }

    // Parse the agent's response into structured evaluation
    const evaluation = this.parseEvaluationResponse(
      fullResponse,
      applicationId,
      rubricId,
      rubric
    );

    // Validate using Zod
    return EvaluationSchema.parse(evaluation);
  }

  /**
   * Build the scoring prompt with rubric and application context
   */
  private buildScoringPrompt(
    application: ApplicationSubmission,
    rubric: Rubric
  ): string {
    return `# Scoring Task

You are evaluating an application for the **${rubric.name}** program.

## Application Information

**Applicant:** ${application.applicantInfo.firstName} ${application.applicantInfo.lastName}
**Title:** ${application.applicantInfo.title}
**Company:** ${application.companyInfo.name}
**Industry:** ${application.companyInfo.industry || 'Not specified'}
**Year Founded:** ${application.companyInfo.yearFounded}
${application.companyInfo.revenue ? `**Revenue:** $${application.companyInfo.revenue.toLocaleString()}` : ''}

## Application Responses

${Object.entries(application.responses)
  .map(([questionId, response]) => `### ${questionId}\n\n${response}\n`)
  .join('\n')}

## Scoring Rubric

${this.formatRubric(rubric)}

## Your Task

Score this application against each criterion in the rubric. For EACH criterion, provide:

1. **Score** (1-5): The numerical score based on the rubric definitions
2. **Evidence**: Specific quotes or references from the application that support your score
3. **Reasoning**: Clear explanation of why this score was assigned based on the rubric
4. **Confidence**: Your confidence level in this score (0.0-1.0)

## Output Format

Respond in the following JSON format:

\`\`\`json
{
  "criterionScores": [
    {
      "criterionId": "criterion_id_here",
      "score": 4,
      "evidence": "Quote or reference from application",
      "reasoning": "Explanation based on rubric",
      "confidence": 0.9
    }
  ],
  "totalScore": 20,
  "overallComments": "Overall assessment of the application",
  "flaggedConcerns": ["Any concerns or issues"]
}
\`\`\`

**Important Guidelines:**
- Be strictly objective and evidence-based
- Do not let personal bias influence scores
- Apply rubric criteria consistently
- Cite specific evidence for each score
- If information is missing, note it in flaggedConcerns

Begin your evaluation now.`;
  }

  /**
   * Format rubric for the prompt
   */
  private formatRubric(rubric: Rubric): string {
    return `**${rubric.name}**
${rubric.description}

**Maximum Score:** ${rubric.maxScore}
${rubric.passingScore ? `**Passing Score:** ${rubric.passingScore}` : ''}

### Criteria

${rubric.criteria
  .map(
    (criterion) => `
#### ${criterion.name} (Weight: ${criterion.weight})

${criterion.description}

**Rating Scale:**
${Object.entries(criterion.ratingDescriptions)
  .map(([rating, description]) => `- **${rating}**: ${description}`)
  .join('\n')}
`
  )
  .join('\n')}`;
  }

  /**
   * Parse the agent's JSON response into an Evaluation object
   */
  private parseEvaluationResponse(
    response: string,
    applicationId: number,
    rubricId: number,
    rubric: Rubric
  ): AIScoringOutput {
    // Extract JSON from the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Could not parse evaluation response: No JSON found');
    }

    const parsed = JSON.parse(jsonMatch[1]);

    // Validate criterion scores
    const criterionScores: CriterionScore[] = parsed.criterionScores.map(
      (cs: any) => ({
        criterionId: cs.criterionId,
        score: cs.score,
        evidence: cs.evidence,
        reasoning: cs.reasoning,
        confidence: cs.confidence || 0.8,
      })
    );

    // Calculate total score (weighted)
    const totalScore = rubric.criteria.reduce((sum, criterion) => {
      const score = criterionScores.find(
        (cs) => cs.criterionId === criterion.id
      );
      return sum + (score ? score.score * criterion.weight * 5 : 0); // Scale by weight
    }, 0);

    return {
      applicationId,
      rubricId,
      evaluatorType: 'ai',
      evaluatorName: 'SoTruth AI Scoring Agent',
      criterionScores,
      totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimals
      overallComments: parsed.overallComments,
      flaggedConcerns: parsed.flaggedConcerns || [],
      evaluatedAt: new Date(),
    };
  }

  /**
   * Batch score multiple applications
   */
  async scoreApplicationsBatch(
    inputs: AIScoringInput[]
  ): Promise<AIScoringOutput[]> {
    const results: AIScoringOutput[] = [];

    for (const input of inputs) {
      try {
        const evaluation = await this.scoreApplication(input);
        results.push(evaluation);
      } catch (error) {
        console.error(
          `Error scoring application ${input.applicationId}:`,
          error
        );
        // Continue with other applications
      }
    }

    return results;
  }
}

/**
 * Factory function to create a scoring agent instance
 */
export function createSoTruthAgent(): SoTruthScoringAgent {
  return new SoTruthScoringAgent();
}
