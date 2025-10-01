/**
 * Improved Judge Dashboard
 *
 * Enhanced with filters, search, better progress tracking, and visual polish.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  User,
  Building2
} from 'lucide-react';
import { getApplications, getOrganization, getEvaluations } from '@/api/judging';
import type { Application, Organization } from '@/api/judging';
import { format } from 'date-fns';

type FilterStatus = 'all' | 'pending' | 'completed';

// Available organizations for demo
const ORGANIZATIONS = [
  { id: '2', name: 'Titan100 Awards' },
];

const JUDGE_PROFILES = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Rodriguez',
  'David Park',
  'Amanda Williams',
];

export default function JudgeDashboardImproved() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedOrg, setSelectedOrg] = useState<string>(
    searchParams.get('org') || '2'
  );
  const [selectedJudge, setSelectedJudge] = useState<string>(
    searchParams.get('judge') || ''
  );

  const [applications, setApplications] = useState<Application[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [evaluatedIds, setEvaluatedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedOrg, selectedJudge]);

  useEffect(() => {
    // Update URL when org or judge changes
    const params: Record<string, string> = { org: selectedOrg };
    if (selectedJudge) {
      params.judge = selectedJudge;
    }
    setSearchParams(params);
  }, [selectedOrg, selectedJudge]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [org, apps] = await Promise.all([
        getOrganization(parseInt(selectedOrg)),
        getApplications(parseInt(selectedOrg)),
      ]);

      setOrganization(org);
      setApplications(apps);

      // Check which applications have been evaluated by THIS judge (only if judge is selected)
      const evaluated = new Set<number>();
      if (selectedJudge) {
        await Promise.all(
          apps.map(async (app) => {
            const evals = await getEvaluations(app.id);
            // Check if THIS judge has evaluated this application
            const judgeHasEvaluated = evals.some(
              (evaluation) => evaluation.evaluatorName === selectedJudge
            );
            if (judgeHasEvaluated) {
              evaluated.add(app.id);
            }
          })
        );
      }
      setEvaluatedIds(evaluated);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreApplication = (applicationId: number) => {
    if (!selectedJudge) {
      // Don't allow scoring without selecting a judge
      return;
    }
    navigate(`/judge/score/${applicationId}?org=${selectedOrg}&judge=${selectedJudge}`);
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrg(orgId);
  };

  const handleJudgeChange = (judge: string) => {
    setSelectedJudge(judge);
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && evaluatedIds.has(app.id)) ||
      (filterStatus === 'pending' && !evaluatedIds.has(app.id));

    const matchesSearch =
      searchQuery === '' ||
      app.id.toString().includes(searchQuery) ||
      JSON.stringify(app.submissionData).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = applications.length - evaluatedIds.size;
  const completionPercentage = applications.length > 0
    ? Math.round((evaluatedIds.size / applications.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Judge Dashboard</h1>
              {organization && (
                <p className="mt-2 text-gray-600">{organization.name}</p>
              )}
            </div>
            <Button variant="outline" onClick={loadData}>
              Refresh
            </Button>
          </div>

          {/* Organization & Judge Profile Selectors */}
          <div className="space-y-3">
            {/* Organization Selector */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <label className="text-sm font-medium text-purple-900 mb-1 block">
                  Organization:
                </label>
                <Select value={selectedOrg} onValueChange={handleOrganizationChange}>
                  <SelectTrigger className="w-[280px] bg-white">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATIONS.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-purple-700">
                <p className="font-medium">{applications.length} Applications</p>
                <p className="text-xs">Available to review</p>
              </div>
            </div>

            {/* Judge Profile Selector */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <label className="text-sm font-medium text-blue-900 mb-1 block">
                  Judging As:
                </label>
                <Select value={selectedJudge} onValueChange={handleJudgeChange}>
                  <SelectTrigger className="w-[280px] bg-white">
                    <SelectValue placeholder="Select judge profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {JUDGE_PROFILES.map((judge) => (
                      <SelectItem key={judge} value={judge}>
                        {judge}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-blue-700">
                <p className="font-medium">Your Progress: {evaluatedIds.size}/{applications.length}</p>
                <p className="text-xs">Applications you've evaluated</p>
              </div>
            </div>
          </div>
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
                <FileText className="h-4 w-4 mr-2" />
                Ready to review
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Completed</CardDescription>
              <CardTitle className="text-3xl text-green-900">{evaluatedIds.size}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                {completionPercentage}% complete
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-amber-700">Pending</CardDescription>
              <CardTitle className="text-3xl text-amber-900">{pendingCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-amber-700">
                <Clock className="h-4 w-4 mr-2" />
                Awaiting review
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardDescription>Progress</CardDescription>
              <CardTitle className="text-3xl">{completionPercentage}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="all">
                    All ({applications.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({evaluatedIds.size})
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
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery
                  ? 'No applications match your search'
                  : filterStatus === 'completed'
                  ? 'No completed evaluations yet'
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
              const isEvaluated = evaluatedIds.has(application.id);

              // Extract preview text
              const firstResponse = Object.values(application.submissionData)[0] as string || '';
              const preview = firstResponse.slice(0, 150) + (firstResponse.length > 150 ? '...' : '');

              return (
                <Card
                  key={application.id}
                  className={`transition-all hover:shadow-md ${
                    isEvaluated ? 'bg-green-50/50 border-green-200' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            Application #{application.id}
                          </CardTitle>
                          {isEvaluated ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Evaluated
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
                          <span className="text-xs text-muted-foreground">
                            • ID: {application.id}
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => handleScoreApplication(application.id)}
                        disabled={!selectedJudge}
                      >
                        {isEvaluated ? 'Review Evaluation' : 'Score Application'}
                      </Button>
                    </div>
                  </CardHeader>
                  {preview && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {preview}
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom Stats */}
        {filteredApplications.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    Keep going! {pendingCount} application{pendingCount !== 1 ? 's' : ''} remaining
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredApplications.length} of {applications.length} applications
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
