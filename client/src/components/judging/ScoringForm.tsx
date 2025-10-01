/**
 * Scoring Form Component
 *
 * Form for judges to score applications based on rubric criteria.
 * Uses Radix UI components for accessible form inputs.
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Rubric, Evaluation } from '@/api/judging';

interface ScoringFormProps {
  rubric: Rubric;
  applicationId: number;
  judgeName: string;
  onSubmit: (evaluation: Evaluation) => Promise<void>;
  existingEvaluation?: Evaluation;
}

export function ScoringForm({
  rubric,
  applicationId,
  judgeName,
  onSubmit,
  existingEvaluation,
}: ScoringFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    existingEvaluation?.criterionScores.reduce(
      (acc, cs) => ({ ...acc, [cs.criterionId]: cs.score }),
      {}
    ) || {}
  );
  const [reasoning, setReasoning] = useState<Record<string, string>>(
    existingEvaluation?.criterionScores.reduce(
      (acc, cs) => ({ ...acc, [cs.criterionId]: cs.reasoning || '' }),
      {}
    ) || {}
  );
  const [comments, setComments] = useState(existingEvaluation?.comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleScoreChange = (criterionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [criterionId]: score }));
  };

  const handleReasoningChange = (criterionId: string, text: string) => {
    setReasoning((prev) => ({ ...prev, [criterionId]: text }));
  };

  const calculateTotal = (): number => {
    return rubric.criteria.reduce((total, criterion) => {
      const score = scores[criterion.id] || 0;
      return total + score * criterion.weight;
    }, 0);
  };

  const isFormComplete = (): boolean => {
    return rubric.criteria.every((criterion) => scores[criterion.id] > 0);
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Please score all criteria before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const evaluation: Evaluation = {
        applicationId,
        rubricId: rubric.id,
        judgeName,
        criterionScores: rubric.criteria.map((criterion) => ({
          criterionId: criterion.id,
          score: scores[criterion.id],
          reasoning: reasoning[criterion.id] || undefined,
        })),
        totalScore: calculateTotal(),
        comments: comments || undefined,
      };

      await onSubmit(evaluation);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Failed to submit evaluation:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalScore = calculateTotal();
  const maxScore = rubric.scoringConfig.maxTotalScore;

  return (
    <div className="space-y-6">
      {/* Rubric Header */}
      <Card>
        <CardHeader>
          <CardTitle>{rubric.name}</CardTitle>
          <CardDescription>{rubric.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Scoring Criteria */}
      {rubric.criteria.map((criterion) => (
        <Card key={criterion.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{criterion.name}</CardTitle>
                <CardDescription className="mt-1">{criterion.description}</CardDescription>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Weight: {(criterion.weight * 100).toFixed(0)}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score Selection */}
            <div className="space-y-3">
              <Label className="text-base">Score (1-5)</Label>
              <RadioGroup
                value={scores[criterion.id]?.toString() || ''}
                onValueChange={(value) => handleScoreChange(criterion.id, parseInt(value))}
              >
                <div className="grid gap-3">
                  {Object.entries(criterion.ratingDescriptions).map(([score, description]) => (
                    <div
                      key={score}
                      className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem value={score} id={`${criterion.id}-${score}`} />
                      <Label
                        htmlFor={`${criterion.id}-${score}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{score}</span>
                          <span className="text-xs text-muted-foreground">
                            {score === '1' && 'Poor'}
                            {score === '2' && 'Needs Improvement'}
                            {score === '3' && 'Satisfactory'}
                            {score === '4' && 'Good'}
                            {score === '5' && 'Outstanding'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {description}
                        </p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Optional Reasoning */}
            <div className="space-y-2">
              <Label htmlFor={`reasoning-${criterion.id}`}>
                Reasoning (Optional)
              </Label>
              <Textarea
                id={`reasoning-${criterion.id}`}
                placeholder="Provide specific examples from the application that support your score..."
                value={reasoning[criterion.id] || ''}
                onChange={(e) => handleReasoningChange(criterion.id, e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Overall Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Comments (Optional)</CardTitle>
          <CardDescription>
            Provide any additional feedback or observations about this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="General comments about the application..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Score Summary and Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Score</div>
              <div className="text-3xl font-bold">
                {totalScore.toFixed(1)} / {maxScore}
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!isFormComplete() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
            </Button>
          </div>

          {submitStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Evaluation submitted successfully!
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to submit evaluation. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
