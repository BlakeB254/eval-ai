/**
 * Comparison Dashboard
 *
 * Side-by-side comparison of Human vs AI scoring with bias analysis.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  Bot,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { generateMockComparisonData, type ComparisonSummary } from '@/api/comparison';

export default function ComparisonDashboard() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';

  const [data, setData] = useState<ComparisonSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [organizationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Using mock data for now - will be replaced with real AI scoring later
      const comparisonData = await generateMockComparisonData(parseInt(organizationId));
      setData(comparisonData);
    } catch (error) {
      console.error('Failed to load comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  const scoreDifference = data.averageAiScore - data.averageHumanScore;
  const correlationQuality =
    data.correlation >= 0.9
      ? 'Excellent'
      : data.correlation >= 0.7
      ? 'Good'
      : data.correlation >= 0.5
      ? 'Fair'
      : 'Poor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comparison Dashboard</h1>
              <p className="mt-2 text-gray-600">Human vs AI Scoring Analysis</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {data.totalApplications} Applications Analyzed
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Human Average
              </CardDescription>
              <CardTitle className="text-3xl">{data.averageHumanScore.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Average
              </CardDescription>
              <CardTitle className="text-3xl">{data.averageAiScore.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card className={scoreDifference > 0.5 ? 'border-amber-200 bg-amber-50' : ''}>
            <CardHeader className="pb-3">
              <CardDescription>Average Discrepancy</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {data.averageDiscrepancy.toFixed(2)}
                {scoreDifference > 0 ? (
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI scores {scoreDifference > 0 ? 'higher' : 'lower'} by{' '}
                {Math.abs(scoreDifference).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className={data.correlation < 0.7 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <CardHeader className="pb-3">
              <CardDescription>Correlation</CardDescription>
              <CardTitle className="text-3xl">{data.correlation.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm font-medium ${data.correlation >= 0.7 ? 'text-green-700' : 'text-red-700'}`}>
                {correlationQuality} Agreement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bias Indicators */}
        {data.biasIndicators.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Bias Indicators Detected
              </CardTitle>
              <CardDescription>
                Potential scoring patterns that may indicate bias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.biasIndicators.map((indicator, idx) => (
                <Alert
                  key={idx}
                  className={
                    indicator.severity === 'high'
                      ? 'border-red-200 bg-red-50'
                      : indicator.severity === 'medium'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-blue-200 bg-blue-50'
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {indicator.type}
                    <Badge
                      variant="secondary"
                      className={
                        indicator.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : indicator.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {indicator.severity}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">{indicator.description}</p>
                    <p className="text-sm">
                      Affects {indicator.affectedApplications.length} application(s): #
                      {indicator.affectedApplications.join(', #')}
                    </p>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Detailed Comparisons */}
        <Card>
          <CardHeader>
            <CardTitle>Application-by-Application Comparison</CardTitle>
            <CardDescription>
              Detailed breakdown of human vs AI scores for each application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="criteria">By Criterion</TabsTrigger>
                <TabsTrigger value="judges">By Judge</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {data.comparisons.map((comparison) => {
                  const diff = comparison.aiScore - comparison.humanScore;
                  const diffPercentage = Math.abs((diff / comparison.humanScore) * 100);

                  return (
                    <Card
                      key={comparison.applicationId}
                      className={diffPercentage > 10 ? 'border-amber-200' : ''}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Application #{comparison.applicationId}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Judge: {comparison.judgeName}
                              </Badge>
                              {diffPercentage > 10 && (
                                <Badge variant="secondary" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {diffPercentage.toFixed(0)}% difference
                                </Badge>
                              )}
                            </div>
                          </div>
                          {Math.abs(diff) < 0.2 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Human Score</div>
                            <div className="text-2xl font-bold">{comparison.humanScore.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">AI Score</div>
                            <div className="text-2xl font-bold">{comparison.aiScore.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Difference</div>
                            <div className={`text-2xl font-bold ${diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-12">Human</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(comparison.humanScore / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">
                              {comparison.humanScore.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-12">AI</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${(comparison.aiScore / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">
                              {comparison.aiScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="criteria" className="space-y-4 mt-4">
                {data.comparisons.map((comparison) => (
                  <Card key={comparison.applicationId}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Application #{comparison.applicationId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {comparison.criterionBreakdown.map((criterion) => (
                          <div key={criterion.criterionId}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{criterion.criterionName}</span>
                              {criterion.difference !== 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {criterion.difference > 0 ? '+' : ''}{criterion.difference}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-16">Human:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${(criterion.humanScore / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-8">{criterion.humanScore}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-16">AI:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-purple-500 h-1.5 rounded-full"
                                    style={{ width: `${(criterion.aiScore / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-8">{criterion.aiScore}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="judges" className="space-y-4 mt-4">
                {data.judgePerformance.map((judge) => {
                  const correlationQuality =
                    judge.correlation >= 0.9
                      ? 'Excellent'
                      : judge.correlation >= 0.7
                      ? 'Good'
                      : judge.correlation >= 0.5
                      ? 'Fair'
                      : 'Poor';

                  return (
                    <Card key={judge.judgeName}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{judge.judgeName}</CardTitle>
                            <CardDescription>
                              {judge.totalEvaluations} evaluation{judge.totalEvaluations !== 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              judge.correlation >= 0.7
                                ? 'bg-green-100 text-green-800'
                                : judge.correlation >= 0.5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {correlationQuality} Correlation
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Avg Score</div>
                            <div className="text-xl font-bold">{judge.averageScore.toFixed(2)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Avg AI Score</div>
                            <div className="text-xl font-bold">{judge.averageAiScore.toFixed(2)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Correlation</div>
                            <div className="text-xl font-bold">{judge.correlation.toFixed(2)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Consistency</div>
                            <div className="text-xl font-bold">{(judge.consistency * 100).toFixed(0)}%</div>
                          </div>
                        </div>

                        {/* Bias Indicators */}
                        {judge.biasIndicators.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <h4 className="text-sm font-semibold mb-2">Bias Indicators</h4>
                            {judge.biasIndicators.map((indicator, idx) => (
                              <Alert
                                key={idx}
                                className={
                                  indicator.severity === 'high'
                                    ? 'border-red-200 bg-red-50'
                                    : indicator.severity === 'medium'
                                    ? 'border-amber-200 bg-amber-50'
                                    : 'border-blue-200 bg-blue-50'
                                }
                              >
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="flex items-center gap-2 text-sm">
                                  {indicator.type}
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      indicator.severity === 'high'
                                        ? 'bg-red-100 text-red-800'
                                        : indicator.severity === 'medium'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {indicator.severity}
                                  </Badge>
                                </AlertTitle>
                                <AlertDescription className="text-sm">
                                  {indicator.description}
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}

                        {judge.biasIndicators.length === 0 && (
                          <Alert className="bg-green-50 border-green-200 mt-4">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-900 text-sm">No Bias Detected</AlertTitle>
                            <AlertDescription className="text-green-800 text-sm">
                              This judge shows consistent and unbiased scoring patterns.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Notice */}
        <Alert className="mt-8 bg-blue-50 border-blue-200">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Demo Data</AlertTitle>
          <AlertDescription className="text-blue-800">
            This comparison uses simulated AI scores to demonstrate the dashboard functionality.
            Once AI scoring is activated, this will show real comparisons between human judges
            and the SoTruth AI scoring agent.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}
