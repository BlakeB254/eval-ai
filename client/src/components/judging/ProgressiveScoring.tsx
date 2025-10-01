/**
 * Progressive Scoring Component
 *
 * Two-column layout with application on left and progressive criterion scoring on right.
 * Industry standard for evaluation platforms.
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import type { Rubric, Evaluation } from '@/api/judging';

interface ProgressiveScoringProps {
  rubric: Rubric;
  applicationId: number;
  judgeName: string;
  onSubmit: (evaluation: Evaluation) => Promise<void>;
  existingEvaluation?: Evaluation;
}

export function ProgressiveScoring({
  rubric,
  applicationId,
  judgeName,
  onSubmit,
  existingEvaluation,
}: ProgressiveScoringProps) {
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const currentCriterion = rubric.criteria[currentCriterionIndex];
  const progress = Object.keys(scores).length / rubric.criteria.length;
  const isLastCriterion = currentCriterionIndex === rubric.criteria.length - 1;
  const isFirstCriterion = currentCriterionIndex === 0;

  // Auto-save to localStorage
  useEffect(() => {
    const draft = {
      applicationId,
      scores,
      reasoning,
      comments,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`draft-${applicationId}`, JSON.stringify(draft));
    setLastSaved(new Date());
  }, [scores, reasoning, comments, applicationId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `draft-${applicationId}`;
    const saved = localStorage.getItem(draftKey);
    if (saved && !existingEvaluation) {
      const draft = JSON.parse(saved);
      setScores(draft.scores || {});
      setReasoning(draft.reasoning || {});
      setComments(draft.comments || '');
    }
  }, [applicationId, existingEvaluation]);

  const handleScoreChange = (score: number) => {
    setScores((prev) => ({ ...prev, [currentCriterion.id]: score }));
  };

  const handleReasoningChange = (text: string) => {
    setReasoning((prev) => ({ ...prev, [currentCriterion.id]: text }));
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

  const handleNext = () => {
    if (currentCriterionIndex < rubric.criteria.length - 1) {
      setCurrentCriterionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCriterionIndex > 0) {
      setCurrentCriterionIndex((prev) => prev - 1);
    }
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
      localStorage.removeItem(`draft-${applicationId}`);
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
    <div className="space-y-4">
      {/* Progress Header */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Criterion {currentCriterionIndex + 1} of {rubric.criteria.length}
              </div>
              <div className="text-2xl font-bold">{currentCriterion.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Score</div>
              <div className="text-3xl font-bold text-primary">
                {totalScore.toFixed(1)}<span className="text-xl text-muted-foreground">/{maxScore}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex gap-2 mt-3">
              {rubric.criteria.map((criterion, idx) => (
                <button
                  key={criterion.id}
                  onClick={() => setCurrentCriterionIndex(idx)}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    scores[criterion.id]
                      ? 'bg-green-500'
                      : idx === currentCriterionIndex
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                  title={criterion.name}
                />
              ))}
            </div>
          </div>

          {lastSaved && (
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Save className="h-3 w-3" />
              Draft auto-saved {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Criterion Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentCriterion.name}</CardTitle>
          <CardDescription>{currentCriterion.description}</CardDescription>
          <div className="mt-2">
            <Badge variant="secondary">
              Weight: {(currentCriterion.weight * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Score</Label>
            <RadioGroup
              value={scores[currentCriterion.id]?.toString() || ''}
              onValueChange={(value) => handleScoreChange(parseInt(value))}
            >
              <div className="space-y-3">
                {Object.entries(currentCriterion.ratingDescriptions).map(([score, description]) => (
                  <div
                    key={score}
                    className={`flex items-start space-x-3 border rounded-lg p-4 transition-all ${
                      scores[currentCriterion.id]?.toString() === score
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <RadioGroupItem value={score} id={`score-${score}`} className="mt-1" />
                    <Label
                      htmlFor={`score-${score}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold">{score}</span>
                        <span className="text-sm font-semibold">
                          {score === '1' && '- Poor'}
                          {score === '2' && '- Needs Improvement'}
                          {score === '3' && '- Satisfactory'}
                          {score === '4' && '- Good'}
                          {score === '5' && '- Outstanding'}
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

          {/* Reasoning Field */}
          <div className="space-y-2">
            <Label htmlFor="reasoning">
              Notes & Reasoning <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="reasoning"
              placeholder="Document specific examples from the application that support your score..."
              value={reasoning[currentCriterion.id] || ''}
              onChange={(e) => handleReasoningChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Overall Comments (shown on last criterion) */}
      {isLastCriterion && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Comments</CardTitle>
            <CardDescription>
              Provide any additional feedback about this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="General observations, standout qualities, areas of concern..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      )}

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstCriterion}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex-1 text-center text-sm text-muted-foreground">
          {isFormComplete() ? (
            <span className="text-green-600 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              All criteria scored
            </span>
          ) : (
            <span>
              {Object.keys(scores).length} of {rubric.criteria.length} criteria scored
            </span>
          )}
        </div>

        {!isLastCriterion ? (
          <Button onClick={handleNext}>
            Next Criterion
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete() || isSubmitting}
            size="lg"
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
          </Button>
        )}
      </div>

      {/* Status Messages */}
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
    </div>
  );
}
