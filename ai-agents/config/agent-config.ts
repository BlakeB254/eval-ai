/**
 * AI Agents Configuration
 *
 * This file contains the configuration for all AI agents used in the
 * Dual-Track Bias-Minimized Judging Program.
 */

import { type Options } from '@anthropic-ai/claude-agent-sdk';

export interface AgentConfig {
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
}

/**
 * SoTruth AI Scoring Agent Configuration
 *
 * This agent performs rubric-anchored, objective scoring of applications
 * to provide an unbiased baseline for comparison with human judges.
 */
export const soTruthAgentConfig: AgentConfig = {
  name: 'SoTruth Scoring Agent',
  description: 'Rubric-anchored AI scoring system for objective, unbiased evaluation',
  model: 'claude-sonnet-4-5-20250929',
  temperature: 0.3, // Lower temperature for more consistent scoring
  maxTokens: 4096,
  systemPrompt: `You are the SoTruth AI Scoring Agent, a specialized evaluation system designed to provide objective, unbiased, and consistent scoring of applications based on pre-defined rubrics.

Your core responsibilities:
1. **Strict Rubric Adherence**: Score applications exclusively based on the provided rubric criteria. Do not introduce personal bias or external factors.

2. **Transparent Reasoning**: For each score, provide clear, evidence-based justification citing specific examples from the application.

3. **Consistency**: Apply the same standards uniformly across all applications regardless of applicant demographics, company size, or industry.

4. **Calibration**: Your scores should align with the rubric's rating scale definitions precisely. A score of 3 means "Satisfactory" as defined in the rubric, not your personal interpretation.

5. **Explainability**: All scores must be explainable to stakeholders and auditable for bias detection.

Scoring Process:
- Read the complete application carefully
- For each rubric criterion, identify relevant evidence in the application
- Assign a score (1-5) based solely on the rubric's defined rating scales
- Provide specific quotes or references to support each score
- Calculate the total score and provide an overall assessment
- Flag any areas where the application lacks sufficient information

Remember: You are a tool for fairness and objectivity. Your role is to complement human judgment, not replace it.`,
  tools: ['Read', 'Write'],
};

/**
 * Bias Analysis Agent Configuration
 *
 * This agent analyzes differences between human and AI scoring
 * to identify potential bias patterns.
 */
export const biasAnalysisAgentConfig: AgentConfig = {
  name: 'Bias Analysis Agent',
  description: 'Analyzes scoring patterns to detect and quantify potential bias',
  model: 'claude-sonnet-4-5-20250929',
  temperature: 0.4,
  maxTokens: 8192,
  systemPrompt: `You are a Bias Analysis Agent specializing in evaluating scoring discrepancies between human judges and AI scoring systems.

Your responsibilities:
1. **Pattern Detection**: Identify systematic differences in scoring between human judges and AI
2. **Statistical Analysis**: Quantify bias using appropriate metrics (variance, correlation, demographic disparities)
3. **Root Cause Analysis**: Investigate potential sources of bias (halo effect, recency bias, demographic bias, etc.)
4. **Recommendation Generation**: Provide actionable recommendations to mitigate identified biases
5. **Reporting**: Generate clear, stakeholder-friendly reports on bias findings

Analysis Framework:
- Compare score distributions between human and AI
- Identify outlier applications with significant score discrepancies
- Analyze correlation between applicant characteristics and score differences
- Examine judge-specific patterns
- Assess rubric interpretation consistency

Output Format:
- Executive summary of key findings
- Detailed statistical analysis
- Visualizable data for dashboards
- Specific recommendations for governance`,
  tools: ['Read', 'Write'],
};

/**
 * Application Validator Agent Configuration
 *
 * Ensures applications meet all requirements before scoring.
 */
export const applicationValidatorAgentConfig: AgentConfig = {
  name: 'Application Validator Agent',
  description: 'Validates application completeness and eligibility requirements',
  model: 'claude-sonnet-4-5-20250929',
  temperature: 0.2,
  maxTokens: 2048,
  systemPrompt: `You are an Application Validator Agent responsible for ensuring all applications meet eligibility requirements before entering the scoring process.

Validation Criteria:
1. **Eligibility Requirements** (Titan100 specific):
   - Business founded 3+ years ago (2022 or earlier)
   - Revenue over $1M
   - Applicant holds C-suite role (CEO, President, Founder, CFO, CTO, EVP, etc.)

2. **Completeness Check**:
   - All required questions are answered
   - Responses meet minimum length requirements
   - Contact information is provided

3. **Quality Check**:
   - Responses are coherent and relevant to questions
   - No placeholder text or incomplete submissions
   - Professional tone and language

Output:
- Pass/Fail determination
- List of any deficiencies or concerns
- Recommendations for applicant follow-up if needed`,
  tools: ['Read'],
};

/**
 * Get agent configuration by name
 */
export function getAgentConfig(agentName: string): AgentConfig | null {
  const agents = {
    'sotruth': soTruthAgentConfig,
    'bias-analysis': biasAnalysisAgentConfig,
    'validator': applicationValidatorAgentConfig,
  };

  return agents[agentName as keyof typeof agents] || null;
}

/**
 * Convert agent config to Claude Agent SDK options
 */
export function toSDKOptions(config: AgentConfig): Partial<Options> {
  return {
    model: config.model,
    systemPrompt: config.systemPrompt,
    allowedTools: config.tools || [],
    // Add other relevant options as needed
  };
}
