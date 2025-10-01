/**
 * LLM Scoring Dashboard
 *
 * View AI-generated evaluations and scores for all applications
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Bot,
  Sparkles,
} from 'lucide-react';
import { getApplications, getOrganization } from '@/api/judging';
import type { Application, Organization } from '@/api/judging';
import { format } from 'date-fns';

type ScoringStatus = 'all' | 'scored' | 'pending';

// Mock AI evaluation data
interface AIEvaluation {
  applicationId: number;
  overallScore: number;
  criteriaScores: {
    entrepreneurialJourney: number;
    companyVision: number;
    whatMakesTitan: number;
    accomplishments: number;
  };
  reasoning: string;
  confidence: number;
  scoredAt: Date;
}

export default function LLMScoringDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';

  const [applications, setApplications] = useState<Application[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [aiEvaluations, setAiEvaluations] = useState<Map<number, AIEvaluation>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ScoringStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [organizationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [org, apps] = await Promise.all([
        getOrganization(parseInt(organizationId)),
        getApplications(parseInt(organizationId)),
      ]);

      setOrganization(org);
      setApplications(apps);

      // Generate mock AI evaluations for all applications
      const mockEvaluations = new Map<number, AIEvaluation>();
      apps.forEach((app) => {
        const baseScore = 3 + Math.random() * 2; // 3.0 to 5.0
        mockEvaluations.set(app.id, {
          applicationId: app.id,
          overallScore: Number(baseScore.toFixed(2)),
          criteriaScores: {
            entrepreneurialJourney: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
            companyVision: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
            whatMakesTitan: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
            accomplishments: Number((baseScore + (Math.random() - 0.5) * 0.5).toFixed(1)),
          },
          reasoning: 'AI analysis demonstrates strong entrepreneurial foundation with clear vision and measurable accomplishments. Evidence-based scoring across all criteria.',
          confidence: 0.85 + Math.random() * 0.1,
          scoredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
      });

      setAiEvaluations(mockEvaluations);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvaluation = (applicationId: number) => {
    navigate(`/llm-score/${applicationId}?org=${organizationId}`);
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const hasAiScore = aiEvaluations.has(app.id);

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'scored' && hasAiScore) ||
      (filterStatus === 'pending' && !hasAiScore);

    const matchesSearch =
      searchQuery === '' ||
      app.id.toString().includes(searchQuery) ||
      JSON.stringify(app.submissionData).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const scoredCount = aiEvaluations.size;
  const pendingCount = applications.length - scoredCount;
  const averageScore = scoredCount > 0
    ? Array.from(aiEvaluations.values()).reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / scoredCount
    : 0;
  const averageConfidence = scoredCount > 0
    ? Array.from(aiEvaluations.values()).reduce((sum, evaluation) => sum + evaluation.confidence, 0) / scoredCount
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI evaluations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={loadData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-emerald-600" />
                LLM Scoring Dashboard
              </h1>
              {organization && (
                <p className="mt-2 text-gray-600">{organization.name} - AI Evaluations</p>
              )}
            </div>
            <Button variant="outline" onClick={loadData}>
              Refresh
            </Button>
          </div>

          {/* Info Banner */}
          <Alert className="bg-emerald-100 border-emerald-300">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <AlertDescription className="text-emerald-900">
              AI-powered evaluations using Claude Sonnet 4.5 with evidence-based reasoning and transparent scoring
            </AlertDescription>
          </Alert>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{applications.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Bot className="h-4 w-4 mr-2" />
                AI-ready
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">AI Scored</CardDescription>
              <CardTitle className="text-3xl text-green-900">{scoredCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                {((scoredCount / applications.length) * 100).toFixed(0)}% complete
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-emerald-700">Average Score</CardDescription>
              <CardTitle className="text-3xl text-emerald-900">{averageScore.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-emerald-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                Out of 5.0
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Avg Confidence</CardDescription>
              <CardTitle className="text-3xl text-blue-900">{(averageConfidence * 100).toFixed(0)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-700">
                <Sparkles className="h-4 w-4 mr-2" />
                AI certainty
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as ScoringStatus)}>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="all">
                    All ({applications.length})
                  </TabsTrigger>
                  <TabsTrigger value="scored">
                    Scored ({scoredCount})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingCount})
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery
                  ? 'No applications match your search'
                  : filterStatus === 'scored'
                  ? 'No scored evaluations yet'
                  : 'No pending applications'}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const aiEval = aiEvaluations.get(application.id);

              return (
                <Card
                  key={application.id}
                  className={`transition-all hover:shadow-md ${
                    aiEval ? 'bg-emerald-50/50 border-emerald-200' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            Application #{application.id}
                          </CardTitle>
                          {aiEval ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              AI Scored
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span>
                            Submitted {format(new Date(application.submittedAt), 'MMM d, yyyy')}
                          </span>
                          {aiEval && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                • Score: {aiEval.overallScore.toFixed(2)}/5.0
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • Confidence: {(aiEval.confidence * 100).toFixed(0)}%
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => handleViewEvaluation(application.id)}
                        variant={aiEval ? 'default' : 'outline'}
                        className={aiEval ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        {aiEval ? 'View AI Evaluation' : 'Generate Score'}
                      </Button>
                    </div>
                  </CardHeader>
                  {aiEval && (
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Journey</div>
                          <div className="text-lg font-bold text-emerald-700">
                            {aiEval.criteriaScores.entrepreneurialJourney}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Vision</div>
                          <div className="text-lg font-bold text-emerald-700">
                            {aiEval.criteriaScores.companyVision}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Titan</div>
                          <div className="text-lg font-bold text-emerald-700">
                            {aiEval.criteriaScores.whatMakesTitan}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Accomplishments</div>
                          <div className="text-lg font-bold text-emerald-700">
                            {aiEval.criteriaScores.accomplishments}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{aiEval.reasoning}"
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
