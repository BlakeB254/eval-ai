/**
 * Reports Page
 *
 * Bias analysis reports and governance documentation for audit trails.
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
} from 'lucide-react';

export default function Reports() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'bias-summary',
      title: 'Bias Analysis Summary',
      description: 'Statistical analysis of scoring patterns and potential bias indicators',
      type: 'Bias Analysis',
      date: '2025-10-01',
      status: 'Ready',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'amber',
    },
    {
      id: 'governance-report',
      title: 'Governance & Audit Trail',
      description: 'Complete audit trail of all scoring decisions and system actions',
      type: 'Governance',
      date: '2025-10-01',
      status: 'Ready',
      icon: <Shield className="h-5 w-5" />,
      color: 'blue',
    },
    {
      id: 'judge-performance',
      title: 'Judge Performance Metrics',
      description: 'Consistency analysis and scoring patterns by judge',
      type: 'Analytics',
      date: '2025-10-01',
      status: 'Ready',
      icon: <Users className="h-5 w-5" />,
      color: 'green',
    },
    {
      id: 'statistical-analysis',
      title: 'Statistical Analysis Report',
      description: 'Correlation coefficients, distributions, and variance analysis',
      type: 'Statistics',
      date: '2025-10-01',
      status: 'Ready',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'purple',
    },
  ];

  const biasAnalysisContent = {
    executiveSummary: {
      totalApplications: 3,
      humanEvaluations: 3,
      aiEvaluations: 3,
      overallCorrelation: 0.85,
      biasIndicatorsFound: 2,
      recommendation: 'Low Risk - Minor adjustments recommended',
    },
    keyFindings: [
      {
        finding: 'Leniency Bias Detected',
        severity: 'Low',
        description:
          'Human scores average 0.1 points lower than AI scores, suggesting slight leniency bias in human scoring.',
        recommendation: 'Review rubric descriptions with judges for calibration.',
      },
      {
        finding: 'Halo Effect in Application #4',
        severity: 'Medium',
        description:
          'Application #4 shows unusually consistent high scores (4) across all criteria, suggesting potential halo effect.',
        recommendation: 'Review this application independently to verify scoring.',
      },
      {
        finding: 'High Correlation on Criteria 2 & 4',
        severity: 'Low',
        description:
          'Company Vision and Accomplishments criteria show 0.95 correlation, indicating strong agreement between human and AI.',
        recommendation: 'No action needed - this indicates good rubric clarity.',
      },
    ],
    statisticalMetrics: [
      {
        metric: 'Pearson Correlation Coefficient',
        value: '0.85',
        interpretation: 'Strong positive correlation',
        benchmark: '> 0.70',
      },
      {
        metric: 'Mean Absolute Error (MAE)',
        value: '0.30',
        interpretation: 'Low discrepancy',
        benchmark: '< 0.50',
      },
      {
        metric: 'Standard Deviation (Human)',
        value: '0.42',
        interpretation: 'Moderate variance',
        benchmark: '0.30 - 0.60',
      },
      {
        metric: 'Standard Deviation (AI)',
        value: '0.38',
        interpretation: 'Moderate variance',
        benchmark: '0.30 - 0.60',
      },
    ],
  };

  const governanceContent = {
    auditTrail: [
      {
        timestamp: '2025-10-01 14:23:15',
        action: 'Evaluation Submitted',
        user: 'Judge Demo',
        details: 'Application #2 scored - Total: 4.2',
        status: 'Completed',
      },
      {
        timestamp: '2025-10-01 14:18:42',
        action: 'Draft Auto-Saved',
        user: 'Judge Demo',
        details: 'Application #2 - Progress: 3/4 criteria',
        status: 'Auto-Save',
      },
      {
        timestamp: '2025-10-01 14:15:30',
        action: 'Scoring Started',
        user: 'Judge Demo',
        details: 'Application #2 - Titan100 rubric loaded',
        status: 'In Progress',
      },
      {
        timestamp: '2025-10-01 13:45:12',
        action: 'AI Evaluation Completed',
        user: 'SoTruth AI Agent',
        details: 'Application #2 scored - Total: 4.5',
        status: 'Completed',
      },
    ],
    compliance: [
      {
        requirement: 'Dual-Track Evaluation',
        status: 'Compliant',
        details: 'All applications evaluated by both human and AI',
      },
      {
        requirement: 'Bias Analysis',
        status: 'Compliant',
        details: 'Automated bias detection run on all evaluations',
      },
      {
        requirement: 'Audit Trail',
        status: 'Compliant',
        details: 'Complete log of all actions with timestamps',
      },
      {
        requirement: 'Data Retention',
        status: 'Compliant',
        details: 'All evaluations stored with rationale and evidence',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Governance</h1>
              <p className="mt-2 text-gray-600">
                Bias analysis, audit trails, and compliance documentation
              </p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export All Reports
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Reports</CardTitle>
                <CardDescription>Generated for Titan100</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className={`cursor-pointer transition-all ${
                      selectedReport === report.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-${report.color}-100 text-${report.color}-700`}
                        >
                          {report.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{report.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {report.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-2">
            {!selectedReport ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a report to view details</p>
                </CardContent>
              </Card>
            ) : selectedReport === 'bias-summary' ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Bias Analysis Summary</CardTitle>
                      <CardDescription>Generated on October 1, 2025</CardDescription>
                    </div>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="findings">Findings</TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-4 space-y-4">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-900">
                          {biasAnalysisContent.executiveSummary.recommendation}
                        </AlertTitle>
                        <AlertDescription className="text-green-800">
                          Overall scoring shows strong correlation (
                          {biasAnalysisContent.executiveSummary.overallCorrelation}) with minor
                          bias indicators detected.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            Total Applications
                          </div>
                          <div className="text-2xl font-bold">
                            {biasAnalysisContent.executiveSummary.totalApplications}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Correlation</div>
                          <div className="text-2xl font-bold">
                            {biasAnalysisContent.executiveSummary.overallCorrelation.toFixed(2)}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            Human Evaluations
                          </div>
                          <div className="text-2xl font-bold">
                            {biasAnalysisContent.executiveSummary.humanEvaluations}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            Bias Indicators
                          </div>
                          <div className="text-2xl font-bold">
                            {biasAnalysisContent.executiveSummary.biasIndicatorsFound}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="findings" className="mt-4 space-y-4">
                      {biasAnalysisContent.keyFindings.map((finding, idx) => (
                        <Alert
                          key={idx}
                          className={
                            finding.severity === 'High'
                              ? 'border-red-200 bg-red-50'
                              : finding.severity === 'Medium'
                              ? 'border-amber-200 bg-amber-50'
                              : 'border-blue-200 bg-blue-50'
                          }
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle className="flex items-center gap-2">
                            {finding.finding}
                            <Badge
                              variant="secondary"
                              className={
                                finding.severity === 'High'
                                  ? 'bg-red-100 text-red-800'
                                  : finding.severity === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {finding.severity}
                            </Badge>
                          </AlertTitle>
                          <AlertDescription>
                            <p className="mb-2">{finding.description}</p>
                            <p className="text-sm font-medium">
                              <strong>Recommendation:</strong> {finding.recommendation}
                            </p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </TabsContent>

                    <TabsContent value="metrics" className="mt-4">
                      <div className="space-y-4">
                        {biasAnalysisContent.statisticalMetrics.map((metric, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{metric.metric}</h4>
                              <Badge variant="secondary">{metric.value}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {metric.interpretation}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Benchmark: {metric.benchmark}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : selectedReport === 'governance-report' ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Governance & Audit Trail</CardTitle>
                      <CardDescription>Complete system audit log</CardDescription>
                    </div>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="audit">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                      <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="audit" className="mt-4 space-y-2">
                      {governanceContent.auditTrail.map((entry, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{entry.action}</span>
                            <Badge variant="secondary" className="text-xs">
                              {entry.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {entry.details}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{entry.user}</span>
                            <span>•</span>
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="compliance" className="mt-4 space-y-4">
                      {governanceContent.compliance.map((item, idx) => (
                        <Alert key={idx} className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-900">{item.requirement}</AlertTitle>
                          <AlertDescription className="text-green-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-green-100 text-green-800">
                                {item.status}
                              </Badge>
                            </div>
                            {item.details}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Report content coming soon</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
