import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building2, Scale, FileText, BarChart3 } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/organizations');
      setOrganizations(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch organizations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Meta-Judge
              </h1>
              <p className="text-muted-foreground">
                Judge the Judges - AI-Powered Bias Detection & Evaluation Quality Assurance
              </p>
            </div>
          </div>
        </header>

        {/* Quick Access Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20" onClick={() => navigate('/judge?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Judge Portal
                </CardTitle>
                <CardDescription>
                  Score applications and submit evaluations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Go to Judge Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20" onClick={() => navigate('/comparison?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Comparison Dashboard
                </CardTitle>
                <CardDescription>
                  Compare human vs AI scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  View Comparisons
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20" onClick={() => navigate('/reports?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Reports
                </CardTitle>
                <CardDescription>
                  View bias analysis and governance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <main>
          <h2 className="text-2xl font-semibold mb-4">Organizations</h2>
          {loading && <p className="text-muted-foreground">Loading...</p>}

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && organizations.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first organization to get started
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && organizations.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {org.name}
                    </CardTitle>
                    {org.description && (
                      <CardDescription>{org.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
