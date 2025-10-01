/**
 * Application Display Component
 *
 * Displays application responses in a readable format for judges to review.
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Application, Organization } from '@/api/judging';
import { format } from 'date-fns';

interface ApplicationDisplayProps {
  application: Application;
  organization: Organization;
}

export function ApplicationDisplay({ application, organization }: ApplicationDisplayProps) {
  // Get application structure from organization
  const applicationStructure = organization.applicationStructure || [];

  return (
    <div className="space-y-6">
      {/* Application Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application #{application.id}</CardTitle>
              <CardDescription>
                Submitted on {format(new Date(application.submittedAt), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <Badge>Under Review</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Application Responses */}
      {applicationStructure.map((field: any) => {
        const response = application.submissionData[field.id];

        if (!response) return null;

        return (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle className="text-lg">{field.label}</CardTitle>
              {field.description && (
                <CardDescription>{field.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{response}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Fallback for responses without structure */}
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
  );
}
