/**
 * Improved Application Scoring Page
 *
 * Two-column layout: Application on left, Progressive scoring on right.
 * Professional evaluation platform UX.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import { ProgressiveScoring } from '@/components/judging/ProgressiveScoring';
import { Titan100Context } from '@/components/judging/Titan100Context';
import {
  getApplication,
  getOrganization,
  getRubrics,
  getTitan100Data,
  getEvaluations,
  submitEvaluation,
} from '@/api/judging';
import type {
  Application,
  Organization,
  Rubric,
  Titan100OrgData,
  Evaluation,
} from '@/api/judging';
import { format } from 'date-fns';

export default function ApplicationScoringImproved() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';
  const judgeName = searchParams.get('judge') || 'Judge Demo';

  const [application, setApplication] = useState<Application | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [titan100Data, setTitan100Data] = useState<Titan100OrgData | null>(null);
  const [existingEvaluation, setExistingEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);

  useEffect(() => {
    if (applicationId) {
      loadData();
    }
  }, [applicationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [app, org, rubrics, titan100, evaluations] = await Promise.all([
        getApplication(parseInt(applicationId!)),
        getOrganization(parseInt(organizationId)),
        getRubrics(parseInt(organizationId)),
        getTitan100Data(parseInt(organizationId)),
        getEvaluations(parseInt(applicationId!)),
      ]);

      setApplication(app);
      setOrganization(org);
      setRubric(rubrics[0] || null);
      setTitan100Data(titan100);

      // Find THIS judge's evaluation (if it exists)
      const judgeEvaluation = evaluations.find(
        (evaluation) => evaluation.evaluatorName === judgeName
      );
      setExistingEvaluation(judgeEvaluation || null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load application data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvaluation = async (evaluation: Evaluation) => {
    await submitEvaluation(evaluation);
    await loadData();
    // Show success and wait before navigating
    setTimeout(() => {
      navigate(`/judge?org=${organizationId}`);
    }, 2000);
  };

  const handleBackToDashboard = () => {
    navigate(`/judge?org=${organizationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application || !organization || !rubric || !titan100Data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || 'Failed to load required data'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={handleBackToDashboard}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const applicationStructure = organization.applicationStructure || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <div className="border-l h-6"></div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">Application #{application.id}</h1>
                  {existingEvaluation && (
                    <Badge className="bg-green-100 text-green-800">
                      Previously Evaluated
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{organization.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContext(!showContext)}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              {showContext ? 'Hide' : 'Show'} Guidelines
            </Button>
          </div>
        </div>
      </header>

      {/* Context Panel (Collapsible) */}
      {showContext && (
        <div className="bg-blue-50 border-b">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <Titan100Context organization={organization} titan100Data={titan100Data} />
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-6 items-start">

          {/* LEFT COLUMN: Application */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                      Review candidate responses while scoring
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submitted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(application.submittedAt), 'MMMM d, yyyy • h:mm a')}
                </p>
              </CardContent>
            </Card>

            {/* Application Responses */}
            {applicationStructure.map((field: any) => {
              const response = application.submissionData[field.id];
              if (!response) return null;

              return (
                <Card key={field.id} className="scroll-mt-24">
                  <CardHeader>
                    <CardTitle className="text-lg">{field.label}</CardTitle>
                    {field.description && (
                      <CardDescription>{field.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p
                        className="whitespace-pre-wrap leading-relaxed text-sm"
                        style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '15px',
                          lineHeight: '1.8',
                          maxWidth: '65ch',
                        }}
                      >
                        {response}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Fallback for applications without structure */}
            {Object.keys(application.submissionData).length > 0 &&
              applicationStructure.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Application Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(application.submissionData).map(([key, value]) => (
                      <div key={key} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-sm mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {value as string}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* RIGHT COLUMN: Progressive Scoring (Sticky) */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <ProgressiveScoring
              rubric={rubric}
              applicationId={application.id}
              judgeName={judgeName}
              onSubmit={handleSubmitEvaluation}
              existingEvaluation={existingEvaluation || undefined}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
