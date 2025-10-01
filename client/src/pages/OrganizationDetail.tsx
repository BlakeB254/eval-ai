import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, FileText, GraduationCap, ClipboardList } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  applicationStructure: any[];
  createdAt: string;
  updatedAt: string;
}

interface Rubric {
  id: number;
  organizationId: number;
  name: string;
  description?: string;
  scoringType: string;
  criteria: any[];
  createdAt: string;
}

interface ExampleApplication {
  id: number;
  organizationId: number;
  title: string;
  sampleData: any;
  sampleEvaluation?: any;
  notes?: string;
  createdAt: string;
}

export default function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [examples, setExamples] = useState<ExampleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
    fetchRubrics();
    fetchExamples();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const response = await apiClient.get(`/organizations/${id}`);
      setOrganization(response.data.data);
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRubrics = async () => {
    try {
      const response = await apiClient.get(`/rubrics?organizationId=${id}`);
      setRubrics(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rubrics:', error);
    }
  };

  const fetchExamples = async () => {
    try {
      const response = await apiClient.get(`/example-applications?organizationId=${id}`);
      setExamples(response.data.data || []);
    } catch (error) {
      console.error('Error fetching examples:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-4">Organization not found</h2>
            <p className="text-muted-foreground mb-6">
              This organization may have been deleted or does not exist.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {organization.name}
              </h1>
              {organization.description && (
                <p className="text-lg text-muted-foreground">
                  {organization.description}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm">
              Edit Organization
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <ClipboardList className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="rubrics">
              <GraduationCap className="mr-2 h-4 w-4" />
              Rubrics ({rubrics.length})
            </TabsTrigger>
            <TabsTrigger value="examples">
              <FileText className="mr-2 h-4 w-4" />
              Example Applications ({examples.length})
            </TabsTrigger>
            <TabsTrigger value="application-form">
              <FileText className="mr-2 h-4 w-4" />
              Application Form
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Rubrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{rubrics.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Evaluation criteria sets
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Example Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{examples.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sample submissions for testing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Form Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {organization.applicationStructure.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Application form fields
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent activity to display
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rubrics Tab */}
          <TabsContent value="rubrics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Evaluation Rubrics</h2>
                <p className="text-muted-foreground">
                  Define scoring criteria and evaluation methods
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Rubric
              </Button>
            </div>

            {rubrics.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rubrics yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first rubric to start evaluating applications
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Rubric
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {rubrics.map((rubric) => (
                  <Card key={rubric.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{rubric.name}</CardTitle>
                          <CardDescription>{rubric.description}</CardDescription>
                        </div>
                        <Badge>{rubric.scoringType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {rubric.criteria.length} criteria
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Example Applications</h2>
                <p className="text-muted-foreground">
                  Sample applications for testing rubrics and training evaluators
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Example
              </Button>
            </div>

            {examples.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No examples yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add example applications to test your rubrics and train evaluators
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Example
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {examples.map((example) => (
                  <Card key={example.id}>
                    <CardHeader>
                      <CardTitle>{example.title}</CardTitle>
                      {example.notes && (
                        <CardDescription>{example.notes}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Sample Data</Badge>
                        {example.sampleEvaluation && (
                          <Badge variant="outline">Has Evaluation</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Application Form Tab */}
          <TabsContent value="application-form" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Application Form Structure</h2>
                <p className="text-muted-foreground">
                  Custom fields that applicants must complete
                </p>
              </div>
              <Button variant="outline">Edit Form</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Form Fields ({organization.applicationStructure.length})</CardTitle>
                <CardDescription>
                  These fields will be shown to applicants in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organization.applicationStructure.map((field: any, index: number) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{field.label}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{field.type}</Badge>
                            {field.required && (
                              <Badge variant="outline">Required</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
