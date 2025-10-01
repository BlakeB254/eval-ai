import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Scale, FileText, BarChart3, Users, Brain, ArrowDown, Layers } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

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

        {/* System Architecture */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Layers className="h-6 w-6" />
            System Architecture
          </h2>

          {/* Meta-Judge Layer (Top) */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                Meta-Judge Layer
              </div>
            </div>
            <Card className="cursor-pointer hover:shadow-xl transition-all border-4 border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50" onClick={() => navigate('/comparison?org=2')}>
              <CardHeader className="text-center pb-3">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <BarChart3 className="h-7 w-7 text-purple-600" />
                  Comparison Dashboard
                </CardTitle>
                <CardDescription className="text-base">
                  Analyzes and compares both scoring systems for bias detection and quality assurance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700">Bias Analysis</div>
                    <div className="text-xs text-muted-foreground">Score variance detection</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700">Quality Metrics</div>
                    <div className="text-xs text-muted-foreground">Consistency tracking</div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700">Governance</div>
                    <div className="text-xs text-muted-foreground">Audit trails & reports</div>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Open Comparison Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Visual Connection Arrows */}
            <div className="flex justify-center my-6">
              <div className="flex gap-8">
                <ArrowDown className="h-8 w-8 text-purple-400 animate-bounce" />
                <ArrowDown className="h-8 w-8 text-purple-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Dual Scoring Systems
              </div>
            </div>
          </div>

          {/* Two Scoring Systems (Bottom Layer) */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Human Graded Applicants */}
            <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50" onClick={() => navigate('/judge?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                  Human Graded Applicants
                </CardTitle>
                <CardDescription>
                  Expert judges evaluate applications using structured rubrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Multi-judge evaluation system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Structured scoring rubrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Independent evaluations</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Scale className="mr-2 h-4 w-4" />
                  Go to Judge Portal
                </Button>
              </CardContent>
            </Card>

            {/* LLM Scoring */}
            <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50" onClick={() => navigate('/llm-scoring?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-6 w-6 text-emerald-600" />
                  LLM Scoring
                </CardTitle>
                <CardDescription>
                  AI-powered objective evaluation with transparent reasoning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Consistent, objective scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Evidence-based reasoning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Automated evaluation pipeline</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Brain className="mr-2 h-4 w-4" />
                  View AI Evaluations
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reports?org=2')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Detailed Reports
                </CardTitle>
                <CardDescription>
                  Comprehensive bias analysis and governance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Organizations
                </CardTitle>
                <CardDescription>
                  Manage organizations and award programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
