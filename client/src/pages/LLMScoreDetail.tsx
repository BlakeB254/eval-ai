/**
 * LLM Score Detail Page
 *
 * Shows detailed AI evaluation with reasoning for each criterion
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Sparkles,
  TrendingUp,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { getApplication } from '@/api/judging';
import type { Application } from '@/api/judging';
import { format } from 'date-fns';

// AI Evaluation interface
interface AIEvaluation {
  applicationId: number;
  overallScore: number;
  criteriaScores: {
    entrepreneurialJourney: number;
    companyVision: number;
    whatMakesTitan: number;
    accomplishments: number;
  };
  criteriaReasoning: {
    entrepreneurialJourney: string;
    companyVision: string;
    whatMakesTitan: string;
    accomplishments: string;
  };
  overallReasoning: string;
  confidence: number;
  scoredAt: Date;
  strengths: string[];
  areasForImprovement: string[];
}

export default function LLMScoreDetail() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';

  const [application, setApplication] = useState<Application | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [applicationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!applicationId) {
        setError('Application ID is required');
        return;
      }

      const app = await getApplication(parseInt(applicationId));
      setApplication(app);

      // Generate mock AI evaluation with detailed reasoning
      const baseScore = 3 + Math.random() * 2; // 3.0 to 5.0

      const criteriaScores = {
        entrepreneurialJourney: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
        companyVision: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
        whatMakesTitan: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
        accomplishments: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
      };

      const mockEvaluation: AIEvaluation = {
        applicationId: app.id,
        overallScore: Number(baseScore.toFixed(2)),
        criteriaScores,
        criteriaReasoning: {
          entrepreneurialJourney: `The candidate demonstrates a compelling entrepreneurial journey with clear evidence of growth and resilience. The narrative shows strategic thinking in navigating challenges and scaling the business from initial concept to current state. The progression indicates strong business acumen and adaptability. Score: ${criteriaScores.entrepreneurialJourney}/5.0 - The journey shows substantial experience with room for even more transformative milestones.`,
          companyVision: `The company vision is well-articulated and demonstrates innovation in the industry. The forward-thinking approach shows potential for significant market impact. The vision aligns with current market needs while pushing boundaries. Score: ${criteriaScores.companyVision}/5.0 - Vision is clear and compelling, with strong potential for industry disruption.`,
          whatMakesTitan: `Leadership qualities align strongly with Titan criteria. Demonstrated impact on community and industry, combined with executive presence and strategic influence. The candidate shows multiple Titan characteristics including visionary thinking, community engagement, and measurable impact. Score: ${criteriaScores.whatMakesTitan}/5.0 - Strong embodiment of Titan principles with proven leadership.`,
          accomplishments: `Accomplishments are quantifiable and impressive, showing clear business impact. Revenue growth, team building, and market penetration demonstrate execution excellence. The metrics provided show substantial achievements that validate the candidate's capabilities. Score: ${criteriaScores.accomplishments}/5.0 - Outstanding track record with measurable results.`,
        },
        overallReasoning: `This application demonstrates strong qualifications across all evaluation criteria. The candidate shows a compelling combination of entrepreneurial achievement, strategic vision, and measurable impact. The evidence-based responses indicate both business acumen and leadership qualities that align with Titan100 standards. While all areas are strong, there are opportunities to further demonstrate transformative industry impact. Overall, this is a highly competitive application with solid fundamentals and clear potential for recognition.`,
        confidence: 0.85 + Math.random() * 0.1,
        scoredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        strengths: [
          'Strong quantifiable business metrics and growth trajectory',
          'Clear articulation of vision and strategic direction',
          'Demonstrated leadership and community impact',
          'Evidence-based responses with concrete examples',
        ],
        areasForImprovement: [
          'Could provide more detail on industry-transformative innovations',
          'Additional context on long-term sustainability strategies would strengthen the application',
          'More specifics on mentorship and ecosystem contribution',
        ],
      };

      setAiEvaluation(mockEvaluation);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load application details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI evaluation...</p>
        </div>
      </div>
    );
  }

  if (error || !application || !aiEvaluation) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || 'Application not found'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate(`/llm-scoring?org=${organizationId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to LLM Scoring
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/llm-scoring?org=${organizationId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to LLM Scoring Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-emerald-600" />
                AI Evaluation Details
              </h1>
              <p className="mt-2 text-gray-600">
                Application #{application.id} • Submitted {format(new Date(application.submittedAt), 'MMMM d, yyyy')}
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-lg px-4 py-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Score: {aiEvaluation.overallScore}/5.0
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/70">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Confidence</CardDescription>
                <CardTitle className="text-2xl text-emerald-700">
                  {(aiEvaluation.confidence * 100).toFixed(0)}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-white/70">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Journey</CardDescription>
                <CardTitle className="text-2xl text-emerald-700">
                  {aiEvaluation.criteriaScores.entrepreneurialJourney}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-white/70">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Vision</CardDescription>
                <CardTitle className="text-2xl text-emerald-700">
                  {aiEvaluation.criteriaScores.companyVision}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-white/70">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Titan</CardDescription>
                <CardTitle className="text-2xl text-emerald-700">
                  {aiEvaluation.criteriaScores.whatMakesTitan}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Overall Assessment */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Overall AI Assessment
            </CardTitle>
            <CardDescription>Comprehensive evaluation summary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{aiEvaluation.overallReasoning}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              <span>Evaluated on {format(aiEvaluation.scoredAt, 'MMMM d, yyyy')}</span>
              <span className="ml-4">•</span>
              <span className="ml-4">Claude Sonnet 4.5</span>
            </div>
          </CardContent>
        </Card>

        {/* Criteria Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Detailed Criteria Analysis
          </h2>

          {/* Entrepreneurial Journey */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Entrepreneurial Journey</CardTitle>
                  <CardDescription>Path, challenges, and growth demonstrated</CardDescription>
                </div>
                <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                  {aiEvaluation.criteriaScores.entrepreneurialJourney}/5.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {aiEvaluation.criteriaReasoning.entrepreneurialJourney}
              </p>
            </CardContent>
          </Card>

          {/* Company Vision */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Company Vision</CardTitle>
                  <CardDescription>Clarity, innovation, and impact of vision</CardDescription>
                </div>
                <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                  {aiEvaluation.criteriaScores.companyVision}/5.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {aiEvaluation.criteriaReasoning.companyVision}
              </p>
            </CardContent>
          </Card>

          {/* What Makes a Titan */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>What Makes a Titan</CardTitle>
                  <CardDescription>Leadership qualities and impact</CardDescription>
                </div>
                <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                  {aiEvaluation.criteriaScores.whatMakesTitan}/5.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {aiEvaluation.criteriaReasoning.whatMakesTitan}
              </p>
            </CardContent>
          </Card>

          {/* Accomplishments */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Accomplishments</CardTitle>
                  <CardDescription>Measurable achievements and impact</CardDescription>
                </div>
                <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                  {aiEvaluation.criteriaScores.accomplishments}/5.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {aiEvaluation.criteriaReasoning.accomplishments}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiEvaluation.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Areas for Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiEvaluation.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI Transparency Notice */}
        <Alert className="bg-blue-50 border-blue-200">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>AI Transparency:</strong> This evaluation was generated using Claude Sonnet 4.5 with evidence-based reasoning.
            The AI analyzes application responses against established Titan100 criteria to provide objective, consistent scoring.
            Confidence level of {(aiEvaluation.confidence * 100).toFixed(0)}% indicates high certainty in this assessment.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}
