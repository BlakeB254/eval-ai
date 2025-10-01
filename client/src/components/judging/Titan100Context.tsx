/**
 * Titan100 Context Display Component
 *
 * Displays organization-specific context, judging guidelines,
 * eligibility requirements, and the Titan definition for judges.
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import type { Titan100OrgData, Organization } from '@/api/judging';

interface Titan100ContextProps {
  organization: Organization;
  titan100Data: Titan100OrgData;
}

export function Titan100Context({ organization, titan100Data }: Titan100ContextProps) {
  const { titanDefinition, eligibilityRequirements, programName, programYear, location } =
    titan100Data;

  return (
    <div className="space-y-6">
      {/* Program Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{organization.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {programName} • {location} • {programYear}
              </CardDescription>
            </div>
            {organization.logoUrl && (
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="h-16 w-auto object-contain"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{organization.description}</p>
        </CardContent>
      </Card>

      {/* Titan Definition */}
      <Card>
        <CardHeader>
          <CardTitle>What is a Titan?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{titanDefinition.definition}</p>

          <div>
            <h4 className="text-sm font-semibold mb-2">Key Qualities:</h4>
            <div className="flex flex-wrap gap-2">
              {titanDefinition.qualities.map((quality, index) => (
                <Badge key={index} variant="secondary">
                  {quality}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Examples of Titans:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              {titanDefinition.examples.map((example, index) => (
                <li key={index}>• {example}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Requirements */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Eligibility Requirements</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              • Business founded <strong>{eligibilityRequirements.businessAge}+ years ago</strong>
            </li>
            <li>
              • Annual revenue over{' '}
              <strong>${(eligibilityRequirements.revenue / 1000000).toFixed(1)}M</strong>
            </li>
            <li>
              • Applicant holds a <strong>C-suite title</strong>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Judging Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Judging Guidelines</CardTitle>
          <CardDescription>
            Score each criterion from 1-5 based on the quality and depth of the response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-5 gap-2 font-medium border-b pb-2">
              <div>1 - Poor</div>
              <div>2 - Needs Improvement</div>
              <div>3 - Satisfactory</div>
              <div>4 - Good</div>
              <div>5 - Outstanding</div>
            </div>
            <p className="text-muted-foreground pt-2">
              Each criterion is weighted equally at 25%. Maximum total score is 25 points.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
