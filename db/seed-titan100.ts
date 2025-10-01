/**
 * Titan100 Seed Data
 *
 * Seeds the database with Titan100 organization data, judging rubrics,
 * and organizational context from the provided PDF documents.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { db } from './index';
import {
  organizations,
  rubrics,
  titan100OrgData,
  pdfDocuments,
  exampleApplications,
} from './index';

/**
 * Titan100 definition from the judging instructions
 */
const titanDefinition = {
  definition:
    'A titan is a person of exceptional importance and reputation. The noun titan comes from Greek mythology, in which the Titans were a race of gods. Today, a titan is someone who is reputable, distinguished and preeminent in a certain field.',
  qualities: [
    'exceptional leadership',
    'vision',
    'passion',
    'influence in their field',
  ],
  examples: [
    'Albert Einstein - titan in the world of science',
    'Shakespeare - titan of literature',
    'Wayne Gretzky - titan of hockey',
  ],
};

/**
 * Eligibility requirements for Titan100
 */
const eligibilityRequirements = {
  businessAge: 3, // Must be in business for 3+ years (founded 2022 or earlier for 2026 program)
  revenue: 1000000, // Must have $1M+ revenue
  cSuiteRole: true, // Must hold C-suite title
};

/**
 * Titan100 Chicago 2026 judging rubric
 * Based on the first-year rubric matrix from the PDF
 */
const titan100Rubric = {
  name: 'Titan100 First Year Judging Rubric',
  description:
    'Comprehensive rubric for evaluating first-year Titan100 applicants based on entrepreneurial journey, company vision, industry impact, and accomplishments.',
  criteria: [
    {
      id: 'entrepreneurial_journey',
      name: 'Entrepreneurial Journey',
      description:
        'Response includes clear timeline of how nominee came to this point in their career or company, obstacles that were overcome to achieve success, demonstrated track record of time/energy/commitment to nominee\'s industry',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'No clear story or timeline. No mention of obstacles or solutions. Lacks any detail about industry experience or commitment to excellence in one\'s role or industry. Nominee\'s response is incomplete and difficult to follow.',
        '2': 'Disjointed or unclear story with an incomplete or confusing timeline. Little mention of obstacles or how they were overcome. Weak or vague industry experience or commitment to excellence in one\'s role.',
        '3': 'Basic story with a general timeline, but lacks detail or cohesion. Mentions obstacles, but solutions are underdeveloped. Industry experience or commitment to excellence in one\'s role is mentioned but not well-supported with examples.',
        '4': 'Clear, interesting story with a solid timeline. Addresses challenges and solutions but with less depth. Strong industry experience with some notable accomplishments, though lacking in detail or completeness.',
        '5': 'Engaging and well-structured story with a clear timeline of milestones. Highlights significant obstacles and creative solutions. Demonstrates a strong industry track record and commitment to excellence in one\'s role with specific achievements and impact. Inspiring and memorable.',
      },
    },
    {
      id: 'company_vision',
      name: 'Company Vision in the Next 5 Years',
      description:
        'Response describes the organization\'s long-term goals and aspirations for the future. It provides insight into what the company hopes to achieve or become in the future. An effective vision statement inspires by showing how success will look and feel.',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'There is no clear vision statement. The answer fails to articulate any long-term goals or aspirations. The response provides no insight into what the company hopes to achieve or become, and does not inspire or engage the team.',
        '2': 'The vision statement is unclear or lacking in detail. It provides little insight into the company\'s future aspirations or goals. The response does not effectively communicate what success will look like, and it fails to motivate or inspire the team.',
        '3': 'The vision statement outlines some general goals for the future, but lacks specificity or clarity. The response is somewhat forward-looking but may feel vague or generic. There is limited discussion of what success looks like, and the vision may not strongly inspire or align the team.',
        '4': 'The vision statement is clear and outlines key long-term goals, though it may lack some specific details or inspiration. The company\'s aspirations for the future are well-articulated, with some indication of how success will be measured, but it may not fully motivate or resonate as strongly with the team.',
        '5': 'The vision statement clearly outlines the company\'s long-term goals and aspirations. It is inspiring, forward-thinking, and paints a vivid picture of the future. The answer demonstrates how the company plans to achieve these goals and describes what success will look and feel like. It effectively motivates and aligns the team by showing the desired future state.',
      },
    },
    {
      id: 'what_makes_titan',
      name: 'What Makes This Individual a Titan in Their Industry',
      description:
        'Nominee response includes specific details about what makes them the best at what they do and how they are unique. It has conviction and shares how the nominee is a contributor to their industry. The response includes specific and measurable details about what sets them apart from their competition in their role or industry.',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'The response fails to provide any specific or compelling details about why the nominee is a leader in their industry. There is no mention of what makes them stand out or their unique qualities. The response lacks conviction and provides little to no insight into the nominee\'s impact or contribution to their industry.',
        '2': 'The response provides limited or vague information about what makes the nominee stand out. There is little to no mention of unique qualities or specific contributions to the industry. The response may lack conviction, making it difficult to understand why the nominee is exceptional compared to others.',
        '3': 'The response outlines general reasons why the nominee is effective in their role, but lacks specificity or unique qualities. There is some mention of the nominee\'s contributions to the industry, but it may feel vague or less impactful. The response shows that the nominee stands out, but it lacks concrete examples or a strong sense of uniqueness.',
        '4': 'The response provides solid examples of the nominee\'s expertise and uniqueness, but may lack the same level of depth or measurable details as a top-tier answer. The nominee is clearly a contributor to their industry and is distinguished from competitors, though the response could offer more specific or impactful achievements. The answer conveys confidence, but may not be as compelling or memorable.',
        '5': 'The response includes specific, detailed examples of why the nominee is the best at what they do. It clearly highlights what makes them unique and includes measurable achievements that set them apart from competitors. The nominee is shown to be a key contributor to their industry, with evidence of significant impact and leadership. The response is delivered with strong conviction and showcases the nominee\'s unmatched expertise and influence.',
      },
    },
    {
      id: 'accomplishments',
      name: 'Nominee\'s Accomplishments',
      description:
        'The response includes a list of specific accomplishments. It provides multiple examples and explains the significance of the most important accolade. The response is unique and inspiring.',
      weight: 0.25,
      ratingDescriptions: {
        '1': 'The response provides no specific or meaningful accomplishments. There is little to no explanation of what the nominee has achieved or why it matters. The answer lacks inspiration and fails to showcase any significant accolades or contributions.',
        '2': 'The response provides limited or vague information about accomplishments. There may be few examples, and the significance is unclear or not explained well. The accomplishments mentioned are either generic or not inspiring, making it hard to see the nominee\'s unique impact.',
        '3': 'The response mentions a few accomplishments, but they are more general or lacking in detail. The significance of the accomplishments may not be fully explained, and while the examples are positive, they lack the inspiration or uniqueness needed to stand out. The answer provides some insight into the nominee\'s achievements but feels incomplete.',
        '4': 'The response provides several specific accomplishments, though it may lack some of the inspiring or unique elements seen in top-tier responses. The significance of the accomplishments is explained, but with slightly less depth. The overall answer is solid, but may not be as fully compelling or memorable.',
        '5': 'The response includes multiple specific accomplishments that are both unique and highly inspiring. Each example is well-explained with context and significance, showing why the accolades are meaningful and impactful. The response is compelling and highlights exceptional achievements that set the nominee apart.',
      },
    },
  ],
  scoringType: 'weighted',
  scoringConfig: {
    minScore: 1,
    maxScore: 5,
    maxTotalScore: 25, // 4 criteria × 5 points × equal weight
    passingScore: 15, // Approximate passing threshold
  },
};

/**
 * Titan100 contacts from the PDF
 */
const titan100Contacts = [
  {
    name: 'Brennan Jones',
    role: 'Program & Alumni Director',
    email: 'bjones@titanceo.com',
  },
  {
    name: 'Karla Gamier',
    role: 'Coordinator',
    email: 'Karlag@titanceo.com',
  },
];

/**
 * Seed the Titan100 organization
 */
export async function seedTitan100() {
  console.log('🌱 Seeding Titan100 organization data...');

  try {
    // 1. Create the Titan100 organization
    const [titan100Org] = await db
      .insert(organizations)
      .values({
        name: 'Titan CEO - Chicago Titan 100',
        description:
          'The Titan100 program recognizes a premier group of 100 CEO\'s and C-level executives in the greater Chicago metropolitan area who demonstrate exceptional leadership, vision, passion, and influence in their field.',
        logoUrl: '/assets/titan100-logo.png',
        contactInfo: {
          website: 'https://titan100.biz',
          email: 'info@titanceo.com',
          phone: '720-799-5888',
        },
        applicationStructure: [
          {
            id: 'entrepreneurial_story',
            label: 'Entrepreneurial Story',
            type: 'textarea',
            required: true,
            description:
              'Tell us the entrepreneurial story that led this individual to launch, start or build their company. This also includes individuals who have ascended the ranks to their current position or individuals who have been brought into an organization to lead it to the next level.',
          },
          {
            id: 'company_vision',
            label: 'Company Vision (Next 5 Years)',
            type: 'textarea',
            required: true,
            description:
              'Share the vision for your company, what will your company look like in the next 5 years.',
          },
          {
            id: 'what_makes_titan',
            label: 'What Makes This Individual a Titan',
            type: 'textarea',
            required: true,
            description: 'What makes this individual a Titan in their industry?',
          },
          {
            id: 'accomplishments',
            label: 'Accomplishments',
            type: 'textarea',
            required: true,
            description:
              'Tell us about the nominee\'s accomplishments, both individually and any he/she helped the company achieve. These can include any honors, awards, published articles or speaking opportunities, etc. Of the nominee\'s accomplishments, which are they most proud of and why?',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log('✅ Created Titan100 organization:', titan100Org.id);

    // 2. Create the Titan100 judging rubric
    const [rubric] = await db
      .insert(rubrics)
      .values({
        organizationId: titan100Org.id,
        name: titan100Rubric.name,
        description: titan100Rubric.description,
        criteria: titan100Rubric.criteria,
        scoringType: titan100Rubric.scoringType,
        scoringConfig: titan100Rubric.scoringConfig,
        createdAt: new Date(),
      })
      .returning();

    console.log('✅ Created Titan100 rubric:', rubric.id);

    // 3. Create Titan100-specific organization data
    const [orgData] = await db
      .insert(titan100OrgData)
      .values({
        organizationId: titan100Org.id,
        programName: '2026 Chicago Titan 100',
        programYear: 2026,
        location: 'Chicago',
        awardsDate: new Date('2026-02-19'),
        venue: 'The Geraghty',
        totalAwardsCount: 100,
        titanDefinition,
        eligibilityRequirements,
        judgingPlatform: 'Awards Force',
        judgingInstructionsUrl: '/documents/titan100-judging-instructions.pdf',
        contacts: titan100Contacts,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log('✅ Created Titan100 organization data:', orgData.id);

    // 4. Store PDF documents
    const pdfDocs = await db
      .insert(pdfDocuments)
      .values([
        {
          organizationId: titan100Org.id,
          documentType: 'instructions',
          title: 'Titan 100 Judging Detailed Instructions',
          description: 'Complete judging instructions for the 2026 Chicago Titan 100',
          fileName: 'Titan100.pdf',
          fileUrl: '/Users/codexmetatron/Documents/websites/eval-ai/Titan100.pdf',
          fileSize: 666 * 1024, // Approximate size
          uploadedBy: 'System',
          uploadedAt: new Date(),
          metadata: {
            sender: 'Brennan Jones',
            date: 'September 10, 2025',
            pages: 6,
          },
        },
        {
          organizationId: titan100Org.id,
          documentType: 'guidelines',
          title: 'Project Brief - TitanScores Judging App',
          description: 'Technical specification for the dual-track bias-minimized judging program',
          fileName: 'Project_Brief_Judging_App_09.22.25.pdf',
          fileUrl:
            '/Users/codexmetatron/Documents/websites/eval-ai/Project_Brief_Judging_App_09.22.25.pdf',
          fileSize: 199 * 1024, // Approximate size
          uploadedBy: 'System',
          uploadedAt: new Date(),
          metadata: {
            projectName: 'TitanScores',
            date: 'September 22, 2025',
            pages: 6,
          },
        },
      ])
      .returning();

    console.log(`✅ Stored ${pdfDocs.length} PDF documents`);

    console.log('\n🎉 Titan100 seed data successfully created!');
    console.log('\nSummary:');
    console.log(`  Organization ID: ${titan100Org.id}`);
    console.log(`  Rubric ID: ${rubric.id}`);
    console.log(`  PDF Documents: ${pdfDocs.length}`);

    return {
      organization: titan100Org,
      rubric,
      organizationData: orgData,
      pdfDocuments: pdfDocs,
    };
  } catch (error) {
    console.error('❌ Error seeding Titan100 data:', error);
    throw error;
  }
}

// Run the seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTitan100()
    .then(() => {
      console.log('\n✨ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seed failed:', error);
      process.exit(1);
    });
}
