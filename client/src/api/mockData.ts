/**
 * Mock data for demo/development when backend is unavailable
 */

import type { Application, Organization, Rubric, Evaluation, Titan100OrgData } from './judging';

// Mock Organization
export const mockOrganization: Organization = {
  id: 2,
  name: 'Titan100 Awards',
  description: 'Recognizing the top 100 CEOs and C-level executives in their local communities',
  logoUrl: 'https://titan100.com/logo.png',
  applicationStructure: {},
};

// Mock Titan100 Data
export const mockTitan100Data: Titan100OrgData = {
  id: 1,
  organizationId: 2,
  programName: 'Titan100 Denver',
  programYear: 2024,
  location: 'Denver, CO',
  titanDefinition: {
    definition: 'A Titan is a C-Suite executive who has demonstrated exceptional leadership and made significant impact in their industry and community.',
    qualities: [
      'Visionary leadership',
      'Innovation and adaptability',
      'Community impact',
      'Business growth and sustainability',
    ],
    examples: [
      'CEOs who have scaled their companies from startups to industry leaders',
      'Executives who have pioneered new business models or technologies',
      'Leaders who have made significant contributions to their local community',
    ],
  },
  eligibilityRequirements: {
    businessAge: 2,
    revenue: 1000000,
    cSuiteRole: true,
  },
  judgingInstructionsUrl: 'https://titan100.com/judging-guidelines',
};

// Mock Rubric
export const mockRubric: Rubric = {
  id: 1,
  organizationId: 2,
  name: 'Titan100 Evaluation Rubric',
  description: 'Comprehensive evaluation criteria for Titan100 candidates',
  criteria: [
    {
      id: 'entrepreneurial_journey',
      name: 'Entrepreneurial Journey',
      description: 'Evaluate the path, challenges overcome, and growth demonstrated',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'Limited entrepreneurial experience',
        '2': 'Some entrepreneurial activities',
        '3': 'Solid entrepreneurial background',
        '4': 'Strong entrepreneurial achievements',
        '5': 'Exceptional entrepreneurial journey',
      },
    },
    {
      id: 'company_vision',
      name: 'Company Vision',
      description: 'Assess clarity, innovation, and impact of company vision',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'Unclear or generic vision',
        '2': 'Basic vision statement',
        '3': 'Clear and focused vision',
        '4': 'Compelling and innovative vision',
        '5': 'Transformative industry-leading vision',
      },
    },
    {
      id: 'what_makes_titan',
      name: 'What Makes a Titan',
      description: 'Evaluate leadership qualities and impact that define a Titan',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'Does not demonstrate Titan qualities',
        '2': 'Shows some Titan characteristics',
        '3': 'Demonstrates several Titan qualities',
        '4': 'Strong embodiment of Titan principles',
        '5': 'Exemplary Titan leadership',
      },
    },
    {
      id: 'accomplishments',
      name: 'Accomplishments',
      description: 'Review measurable achievements and impact',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'Minimal documented accomplishments',
        '2': 'Some notable achievements',
        '3': 'Solid track record of success',
        '4': 'Impressive accomplishments',
        '5': 'Outstanding and transformative achievements',
      },
    },
  ],
  scoringType: 'weighted',
  scoringConfig: {
    minScore: 1,
    maxScore: 5,
    maxTotalScore: 5,
    passingScore: 3.5,
  },
};

// Mock Applications (IDs 5-14 from seed)
export const mockApplications: Application[] = [
  {
    id: 5,
    organizationId: 2,
    applicantId: 1,
    submittedAt: new Date('2024-01-15T10:00:00Z'),
    submissionData: {
      personalInfo: { name: 'John Smith', title: 'CEO', company: 'TechVentures Inc' },
      entrepreneurialJourney: 'Founded company in 2018, grew from 5 to 150 employees...',
      companyVision: 'Transforming the healthcare industry through AI-powered diagnostics...',
      titanQualities: 'Demonstrated leadership in innovation and community engagement...',
      accomplishments: 'Grew revenue from $500K to $25M in 4 years, Created 200+ jobs...',
    },
  },
  {
    id: 6,
    organizationId: 2,
    applicantId: 2,
    submittedAt: new Date('2024-01-16T11:30:00Z'),
    submissionData: {
      personalInfo: { name: 'Sarah Williams', title: 'CTO', company: 'InnovateSoft' },
      entrepreneurialJourney: 'Led technical transformation at 3 startups...',
      companyVision: 'Building the future of cloud infrastructure...',
      titanQualities: 'Pioneer in sustainable technology practices...',
      accomplishments: 'Filed 12 patents, Led team that built platform serving 1M+ users...',
    },
  },
  {
    id: 7,
    organizationId: 2,
    applicantId: 3,
    submittedAt: new Date('2024-01-17T09:15:00Z'),
    submissionData: {
      personalInfo: { name: 'Michael Chen', title: 'CEO', company: 'GreenEnergy Solutions' },
      entrepreneurialJourney: 'Pivoted from consulting to clean energy startup in 2019...',
      companyVision: 'Making renewable energy accessible to every business...',
      titanQualities: 'Champion of environmental sustainability and job creation...',
      accomplishments: 'Reduced carbon emissions by 50K tons, Powered 500+ businesses...',
    },
  },
  {
    id: 8,
    organizationId: 2,
    applicantId: 4,
    submittedAt: new Date('2024-01-18T14:00:00Z'),
    submissionData: {
      personalInfo: { name: 'Emily Rodriguez', title: 'COO', company: 'HealthFirst Clinics' },
      entrepreneurialJourney: 'Built healthcare network from single clinic to 25 locations...',
      companyVision: 'Affordable, accessible healthcare for underserved communities...',
      titanQualities: 'Community-focused leader with proven operational excellence...',
      accomplishments: 'Served 100K+ patients, Created 300 healthcare jobs...',
    },
  },
  {
    id: 9,
    organizationId: 2,
    applicantId: 5,
    submittedAt: new Date('2024-01-19T10:30:00Z'),
    submissionData: {
      personalInfo: { name: 'David Park', title: 'CEO', company: 'FinTech Innovations' },
      entrepreneurialJourney: 'Serial entrepreneur with 3 successful exits...',
      companyVision: 'Democratizing access to financial services through technology...',
      titanQualities: 'Visionary leader driving financial inclusion...',
      accomplishments: 'Processed $1B in transactions, Served 500K customers...',
    },
  },
  {
    id: 10,
    organizationId: 2,
    applicantId: 6,
    submittedAt: new Date('2024-01-20T13:45:00Z'),
    submissionData: {
      personalInfo: { name: 'Amanda Williams', title: 'CEO', company: 'EduTech Global' },
      entrepreneurialJourney: 'Transformed traditional education with online learning platform...',
      companyVision: 'Empowering lifelong learning through accessible technology...',
      titanQualities: 'Education advocate with global impact...',
      accomplishments: 'Reached 2M students across 50 countries, 95% completion rate...',
    },
  },
  {
    id: 11,
    organizationId: 2,
    applicantId: 7,
    submittedAt: new Date('2024-01-21T09:00:00Z'),
    submissionData: {
      personalInfo: { name: 'Robert Taylor', title: 'CTO', company: 'CyberShield Security' },
      entrepreneurialJourney: 'Built cybersecurity firm protecting Fortune 500 companies...',
      companyVision: 'Creating an unhackable digital world...',
      titanQualities: 'Security expert and thought leader...',
      accomplishments: 'Protected $50B in assets, Prevented 10K+ cyberattacks...',
    },
  },
  {
    id: 12,
    organizationId: 2,
    applicantId: 8,
    submittedAt: new Date('2024-01-22T11:15:00Z'),
    submissionData: {
      personalInfo: { name: 'Jessica Martinez', title: 'CEO', company: 'RetailRevolution' },
      entrepreneurialJourney: 'Disrupted retail with omnichannel shopping experience...',
      companyVision: 'Seamless shopping that blends online and offline...',
      titanQualities: 'Retail innovator with customer-first mindset...',
      accomplishments: 'Grew to 50 stores and $100M revenue, 98% customer satisfaction...',
    },
  },
  {
    id: 13,
    organizationId: 2,
    applicantId: 9,
    submittedAt: new Date('2024-01-23T15:30:00Z'),
    submissionData: {
      personalInfo: { name: 'Christopher Lee', title: 'COO', company: 'LogisticsPro' },
      entrepreneurialJourney: 'Scaled logistics operations to handle 1M packages daily...',
      companyVision: 'Same-day delivery for everyone, everywhere...',
      titanQualities: 'Operations excellence and efficiency expert...',
      accomplishments: 'Reduced delivery times by 60%, Achieved 99.5% on-time rate...',
    },
  },
  {
    id: 14,
    organizationId: 2,
    applicantId: 10,
    submittedAt: new Date('2024-01-24T08:45:00Z'),
    submissionData: {
      personalInfo: { name: 'Jennifer Brown', title: 'CEO', company: 'BioMed Innovations' },
      entrepreneurialJourney: 'Pioneered breakthrough medical device for early disease detection...',
      companyVision: 'Saving lives through early diagnosis technology...',
      titanQualities: 'Healthcare innovator with life-saving impact...',
      accomplishments: 'FDA approved device, Detected disease in 50K patients early...',
    },
  },
];

// Mock Evaluations
export const mockEvaluations: Record<number, Evaluation[]> = {
  5: [
    {
      id: 1,
      applicationId: 5,
      rubricId: 1,
      judgeName: 'Sarah Johnson',
      criterionScores: [
        { criterionId: 'entrepreneurial_journey', score: 4, reasoning: 'Strong growth trajectory' },
        { criterionId: 'company_vision', score: 5, reasoning: 'Innovative healthcare approach' },
        { criterionId: 'what_makes_titan', score: 4, reasoning: 'Demonstrated leadership' },
        { criterionId: 'accomplishments', score: 5, reasoning: 'Impressive revenue growth' },
      ],
      totalScore: 4.5,
      comments: 'Excellent candidate with strong track record',
      evaluatedAt: new Date('2024-01-25T10:00:00Z'),
    },
  ],
  6: [
    {
      id: 2,
      applicationId: 6,
      rubricId: 1,
      judgeName: 'Michael Chen',
      criterionScores: [
        { criterionId: 'entrepreneurial_journey', score: 5, reasoning: 'Multiple successful ventures' },
        { criterionId: 'company_vision', score: 4, reasoning: 'Clear technical vision' },
        { criterionId: 'what_makes_titan', score: 4, reasoning: 'Innovation leader' },
        { criterionId: 'accomplishments', score: 5, reasoning: 'Significant patents and user base' },
      ],
      totalScore: 4.5,
      comments: 'Technical excellence with business acumen',
      evaluatedAt: new Date('2024-01-25T11:00:00Z'),
    },
  ],
};

// Helper functions
export function getMockApplications(): Application[] {
  return mockApplications.map(app => ({
    ...app,
    submittedAt: new Date(app.submittedAt),
  }));
}

export function getMockApplication(id: number): Application | undefined {
  const app = mockApplications.find(a => a.id === id);
  return app ? { ...app, submittedAt: new Date(app.submittedAt) } : undefined;
}

export function getMockEvaluations(applicationId: number): Evaluation[] {
  return mockEvaluations[applicationId] || [];
}

export function getMockOrganization(): Organization {
  return mockOrganization;
}

export function getMockRubric(): Rubric {
  return mockRubric;
}

export function getMockTitan100Data(): Titan100OrgData {
  return mockTitan100Data;
}
