/**
 * Application Scoring Page
 *
 * Full scoring interface with application review, rubric, and context.
 * Uses a tabbed interface to organize information.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ApplicationDisplay } from '@/components/judging/ApplicationDisplay';
import { ScoringForm } from '@/components/judging/ScoringForm';
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

export default function ApplicationScoring() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2';

  const [application, setApplication] = useState<Application | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [titan100Data, setTitan100Data] = useState<Titan100OrgData | null>(null);
  const [existingEvaluation, setExistingEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('application');

  // Simulated judge name (in production, this would come from auth)
  const judgeName = 'Judge Demo';

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
      setRubric(rubrics[0] || null); // Use first rubric
      setTitan100Data(titan100);
      setExistingEvaluation(evaluations[0] || null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load application data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvaluation = async (evaluation: Evaluation) => {
    await submitEvaluation(evaluation);
    // Reload to get updated evaluation
    await loadData();
    // Switch to summary tab
    setActiveTab('summary');
  };

  const handleBackToDashboard = () => {
    navigate(`/judge?org=${organizationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="border-l h-6"></div>
              <div>
                <h1 className="text-xl font-bold">Application #{application.id}</h1>
                <p className="text-sm text-gray-600">{organization.name}</p>
              </div>
            </div>
            {existingEvaluation && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Already Evaluated
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="context">Context & Guidelines</TabsTrigger>
          </TabsList>

          {/* Application Tab */}
          <TabsContent value="application" className="space-y-6">
            <ApplicationDisplay application={application} organization={organization} />
          </TabsContent>

          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-6">
            <ScoringForm
              rubric={rubric}
              applicationId={application.id}
              judgeName={judgeName}
              onSubmit={handleSubmitEvaluation}
              existingEvaluation={existingEvaluation || undefined}
            />
          </TabsContent>

          {/* Context Tab */}
          <TabsContent value="context" className="space-y-6">
            <Titan100Context organization={organization} titan100Data={titan100Data} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
