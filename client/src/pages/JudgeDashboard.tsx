/**
 * Judge Dashboard Page
 *
 * Main landing page for judges to view and select applications for scoring.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, FileText } from 'lucide-react';
import { getApplications, getOrganization, getEvaluations } from '@/api/judging';
import type { Application, Organization } from '@/api/judging';
import { format } from 'date-fns';

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('org') || '2'; // Default to Titan100

  const [applications, setApplications] = useState<Application[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [evaluatedIds, setEvaluatedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Check which applications have already been evaluated
      const evaluated = new Set<number>();
      await Promise.all(
        apps.map(async (app) => {
          const evals = await getEvaluations(app.id);
          if (evals.length > 0) {
            evaluated.add(app.id);
          }
        })
      );
      setEvaluatedIds(evaluated);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreApplication = (applicationId: number) => {
    navigate(`/judge/score/${applicationId}?org=${organizationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
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
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Judge Dashboard</h1>
          {organization && (
            <p className="mt-2 text-gray-600">{organization.name}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{applications.length}</CardTitle>
              <CardDescription>Total Applications</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{evaluatedIds.size}</CardTitle>
              <CardDescription>Evaluated</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {applications.length - evaluatedIds.size}
              </CardTitle>
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications to Review</CardTitle>
            <CardDescription>
              Select an application to begin scoring or review your previous evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const isEvaluated = evaluatedIds.has(application.id);

                  return (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            Application #{application.id}
                          </h3>
                          {isEvaluated && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Evaluated
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Submitted {format(new Date(application.submittedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button onClick={() => handleScoreApplication(application.id)}>
                        {isEvaluated ? 'View Evaluation' : 'Score Application'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
