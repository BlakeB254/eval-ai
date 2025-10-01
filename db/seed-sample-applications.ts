/**
 * Sample Applications Seed
 *
 * Creates sample applicants and applications for testing the judging system.
 */

import dotenv from 'dotenv';
dotenv.config();

import { db, applicants, applications } from './index';

const sampleApplicants = [
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@techventures.com',
    company: 'TechVentures Inc',
    title: 'CEO & Founder',
    metadata: {
      industry: 'Technology',
      yearsInBusiness: 5,
      revenue: 15000000,
    },
  },
  {
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael@financegroup.com',
    company: 'Finance Solutions Group',
    title: 'Chief Executive Officer',
    metadata: {
      industry: 'Financial Services',
      yearsInBusiness: 8,
      revenue: 25000000,
    },
  },
  {
    firstName: 'Jennifer',
    lastName: 'Thompson',
    email: 'jennifer.thompson@healthtech.com',
    company: 'HealthTech Solutions',
    title: 'CEO',
    metadata: {
      industry: 'Healthcare Technology',
      yearsInBusiness: 4,
      revenue: 8000000,
    },
  },
];

const sampleResponses = [
  {
    entrepreneurial_story: `I founded TechVentures in 2019 after spending 10 years in enterprise software development. The journey began when I noticed a critical gap in how mid-sized companies managed their data analytics. Starting with just $50,000 in savings and two co-founders, we built our first MVP in my garage.

The first two years were incredibly challenging. We faced constant rejection from investors, struggled to find product-market fit, and nearly ran out of money three times. In 2020, the pandemic forced us to pivot our entire business model from on-premise solutions to cloud-based SaaS. This pivot was terrifying but ultimately saved our company.

Our breakthrough came in 2021 when we secured our first enterprise client - a Fortune 500 company that took a chance on our innovative approach. This led to a Series A funding round of $5M and allowed us to scale our team from 5 to 50 employees. We've since grown to serve over 200 clients across North America, with annual recurring revenue exceeding $15M.

Throughout this journey, I've learned that resilience and adaptability are more valuable than perfection. Every obstacle taught me something crucial about leadership, product development, and building a sustainable business.`,
    company_vision: `In the next five years, TechVentures will become the leading data analytics platform for mid-market enterprises across North America. Our vision is to democratize enterprise-grade analytics, making sophisticated data insights accessible to companies that traditionally couldn't afford them.

By 2030, we aim to:
- Expand our client base to 1,000+ companies
- Achieve $100M in annual revenue
- Open offices in three additional cities
- Launch an AI-powered predictive analytics suite
- Build strategic partnerships with major cloud providers

We're not just building software; we're building a movement. Our platform will empower business leaders to make data-driven decisions with confidence, transforming how mid-sized companies compete in an increasingly data-centric world. We envision a future where every business, regardless of size, has access to the same powerful analytics tools that only enterprises can afford today.

Our success will be measured not just in revenue, but in the number of businesses we help grow and the jobs we help create through better decision-making.`,
    what_makes_titan: `What sets me apart as a leader is my unique combination of deep technical expertise and business acumen. I hold a PhD in Computer Science and an MBA, but more importantly, I've built products that users love and teams that thrive.

I'm recognized as a pioneer in cloud-based analytics, having published three peer-reviewed papers on distributed computing and spoken at major conferences including AWS re:Invent and Google Cloud Next. My approach to leadership emphasizes transparency, empowerment, and continuous learning.

Unlike many tech CEOs, I maintain an active role in product development, writing code weekly and reviewing every major architectural decision. This hands-on approach ensures our products remain technically excellent while meeting real business needs.

I've built a company culture that has achieved a 95% employee retention rate - virtually unheard of in tech. Our team consistently ranks us as one of the best places to work in Chicago, with particular praise for our commitment to work-life balance and professional development.

My industry contributions extend beyond my company. I mentor 15 early-stage founders, serve on the advisory board of two major universities, and actively advocate for increased diversity in tech leadership. I believe true titans lift others as they climb.`,
    accomplishments: `Professional Achievements:
- Named "Tech Innovator of the Year" by Chicago Tech Association (2023)
- Featured in Forbes "30 Under 40" list (2022)
- Published three peer-reviewed papers on distributed computing in top-tier journals
- Keynote speaker at AWS re:Invent, Google Cloud Next, and SaaStr Annual
- Holds two patents in data analytics technology

Company Achievements:
- Grew TechVentures from $0 to $15M ARR in 5 years
- Achieved profitability in Year 3 (rare in SaaS)
- Secured $12M in venture funding with oversubscribed rounds
- Built team of 50+ employees with 95% retention rate
- Served 200+ enterprise clients with 98% satisfaction rate

Community Impact:
- Founded "Women in Analytics" program, mentoring 50+ women in tech
- Donated $500K to STEM education programs in underserved communities
- Serve on advisory boards for Northwestern University and University of Chicago
- Active mentor for 15 early-stage founders through Techstars

Of all these accomplishments, I'm most proud of the Women in Analytics program. Seeing young women find their confidence in tech and watching their careers flourish has been more rewarding than any business metric. Several of my mentees have gone on to found their own companies or become senior leaders at major tech firms.`,
  },
  {
    entrepreneurial_story: `My path to founding Finance Solutions Group was unconventional. After 15 years climbing the corporate ladder at major investment banks, I reached a crossroads in 2016. I saw firsthand how traditional financial institutions were failing small to medium-sized businesses with outdated services and inflexible solutions.

I took the leap and founded FSG with a clear mission: bring institutional-grade financial services to the middle market. Starting with my life savings and a small team of former colleagues who believed in the vision, we faced immediate challenges. The financial services industry is heavily regulated, and breaking into an established market dominated by century-old institutions seemed impossible.

Our first year was brutal. We struggled to gain trust, faced regulatory hurdles, and watched our capital dwindle. The turning point came when we secured our first client - a $20M manufacturing company that took a chance on our innovative approach to cash management. Their success story became our calling card.

The 2020 pandemic tested us like never before. While many financial firms cut services, we doubled down on supporting our clients through the crisis. This commitment to client success during difficult times built unshakeable loyalty and positioned us for explosive growth as the economy recovered.

Today, FSG manages over $500M in assets for 150+ middle-market companies, providing the sophisticated financial services they need to compete globally.`,
    company_vision: `Finance Solutions Group will revolutionize financial services for middle-market companies over the next five years. Our vision is to become the premier financial partner for businesses with $10M-$100M in revenue, serving 500+ clients and managing $2B in assets by 2030.

We're building an integrated platform that combines:
- Treasury management and cash optimization
- Strategic CFO advisory services
- Risk management and hedging strategies
- M&A support and capital raising
- ESG financial planning

Our differentiator is technology-enabled service. We're investing heavily in AI and machine learning to provide real-time financial insights and predictive analytics, giving our clients the same tools that only Fortune 500 companies can afford.

Beyond growth, our vision includes expanding our social impact. We're launching a pro-bono financial advisory program for non-profits and minority-owned businesses, helping close the wealth gap through education and access to capital.

We envision a future where middle-market companies have access to world-class financial services, enabling them to grow, create jobs, and strengthen local economies. Success to us means our clients succeed, our employees thrive, and our communities prosper.`,
    what_makes_titan: `My distinction in the financial services industry stems from successfully bridging two worlds: Wall Street sophistication and Main Street relationships. With 15 years at Goldman Sachs and Morgan Stanley, followed by building FSG into a $50M revenue firm, I understand both institutional excellence and entrepreneurial agility.

I'm one of the few Hispanic CEOs in Chicago's financial services sector, and I use this position to advocate for diversity and inclusion. I've personally recruited and mentored 30+ professionals from underrepresented backgrounds, with many now in senior positions across the industry.

My expertise is recognized nationally:
- Regular contributor to Wall Street Journal and Bloomberg on middle-market finance
- Sought-after speaker at American Bankers Association conferences
- Serve on Federal Reserve advisory council for middle-market lending
- Certified in multiple financial specializations including CFA and CPA

What truly sets me apart is my client-centric philosophy. In an industry often focused on transactions, I build partnerships. Our average client relationship lasts 7+ years, with a 96% retention rate. I personally know every client CEO and have visited their facilities.

I measure success not by wealth created but by businesses saved, expansions funded, and jobs preserved. My greatest satisfaction comes from seeing a client's company thrive because of our strategic guidance.`,
    accomplishments: `Professional Recognition:
- Named "Financial Executive of the Year" by Chicago Financial Forum (2024)
- Recipient of Hispanic Business Leader Award (2023)
- Featured in Wall Street Journal's "Leaders in Middle-Market Finance"
- Certified Financial Analyst (CFA) and Certified Public Accountant (CPA)
- Serves on Federal Reserve Advisory Council

Business Achievements:
- Built FSG from startup to $50M annual revenue in 8 years
- Manage $500M+ in client assets across 150+ companies
- Achieved 96% client retention rate (industry average is 65%)
- Zero compliance violations in 8 years of operation
- Created 75 high-paying jobs in Chicago financial sector

Industry Leadership:
- Published thought leadership articles in WSJ, Bloomberg, and Forbes
- Regular keynote speaker at American Bankers Association events
- Founded "Finance for All" initiative providing free advisory to startups
- Board member of three industry associations

Community Impact:
- Donated $250K to financial literacy programs in Chicago Public Schools
- Pro-bono financial advisor to 10 non-profit organizations
- Mentor to 30+ young professionals from diverse backgrounds
- Active supporter of Hispanic Chamber of Commerce

The accomplishment I'm most proud of is our Finance for All initiative. We've provided free financial advisory to over 50 startups, many founded by minorities and women. Seeing these entrepreneurs succeed, create jobs, and build generational wealth makes every challenge worthwhile.`,
  },
  {
    entrepreneurial_story: `HealthTech Solutions was born from personal tragedy. In 2020, my mother struggled to coordinate her care across multiple specialists after a serious diagnosis. The inefficiency, miscommunication, and frustration she experienced opened my eyes to a massive gap in healthcare technology.

As a former nurse and software engineer, I had a unique perspective on the problem. I left my comfortable job at a major health system to build a solution. With $30K in savings and support from my family, I spent six months building the first version of our care coordination platform.

The journey has been incredibly challenging. Healthcare is notoriously difficult to disrupt - heavily regulated, resistant to change, and dominated by entrenched players. In our first year, we were rejected by 47 health systems. The feedback was consistent: "We like your product, but we're not ready for change."

Our breakthrough came when a progressive health system in Michigan agreed to pilot our platform. Within three months, they saw a 40% reduction in care coordination errors and a 25% improvement in patient satisfaction. This success attracted attention, and suddenly doors started opening.

We've grown from just me to a team of 35, secured $3M in funding, and now serve 20 health systems across the Midwest. Most importantly, we're improving outcomes for thousands of patients daily. Every time I hear a story about how our platform helped someone avoid a medical error or get timely care, I'm reminded why this work matters.`,
    company_vision: `HealthTech Solutions will transform how patients navigate complex healthcare over the next five years. Our vision is to become the standard care coordination platform for health systems nationwide, serving 100+ hospitals and improving outcomes for 1 million patients by 2030.

We're building the missing layer in healthcare technology:
- AI-powered care coordination across providers
- Personalized patient navigation and education
- Real-time communication between patients and care teams
- Predictive analytics to prevent care gaps
- Integration with existing EHR systems

Our platform will evolve beyond coordination to prevention. Using machine learning, we'll identify patients at risk of complications and proactively intervene. This shift from reactive to preventive care will save lives and reduce healthcare costs by millions.

Beyond technology, we're committed to addressing health equity. We're developing multilingual support and partnering with community health centers to ensure underserved populations have access to quality care coordination.

We envision a future where no patient falls through the cracks, where healthcare is truly coordinated, and where technology empowers both patients and providers. Success means better health outcomes, reduced costs, and a more humane healthcare experience for all.`,
    what_makes_titan: `My unique combination of clinical expertise and technical skills makes me exceptional in healthcare technology. As a registered nurse with 8 years of bedside experience and a computer science degree, I understand both the problems and the solutions in ways few others can.

I'm pioneering a new category in healthcare IT - patient-centric care coordination. While most health tech focuses on provider efficiency or billing, I'm solving the coordination challenges that directly impact patient outcomes. This patient-first approach is gaining recognition:
- Named "Healthcare Innovator to Watch" by HIMSS (2024)
- Featured in Modern Healthcare's "Top 40 Under 40"
- Published research in JAMA on care coordination technology
- Invited to speak at Mayo Clinic Innovation Summit

What distinguishes me is my deep empathy for both patients and providers. I've lived both sides - experiencing healthcare frustration as a family member and dealing with system inefficiencies as a nurse. This dual perspective shapes everything we build.

I've built a company where 60% of leadership comes from clinical backgrounds - rare in health tech. This clinical grounding ensures our solutions actually work in real-world healthcare settings, not just in theory.

My impact extends beyond my company. I mentor nurse entrepreneurs, advocate for clinician involvement in health IT, and regularly publish on improving healthcare through technology. I'm proving that you don't need to be a Silicon Valley insider to revolutionize healthcare.`,
    accomplishments: `Industry Recognition:
- Named "Healthcare Innovator to Watch" by HIMSS (2024)
- Featured in Modern Healthcare "Top 40 Under 40"
- Recipient of "Nurse Entrepreneur of the Year" Award (2023)
- Published research in Journal of American Medical Association (JAMA)
- Keynote speaker at Mayo Clinic Innovation Summit and HIMSS Conference

Company Achievements:
- Grew HealthTech from bootstrap to $8M ARR in 4 years
- Secured $3M in venture funding from prominent healthcare investors
- Deployed platform in 20 health systems across 8 states
- Coordinated care for 50,000+ patients with measurable outcome improvements
- Achieved 92% customer retention rate

Clinical Impact:
- Reduced care coordination errors by average of 40% across client sites
- Improved patient satisfaction scores by 25% on average
- Prevented an estimated 200+ adverse events through proactive coordination
- Reduced hospital readmissions by 18% for participating health systems

Professional Development:
- Registered Nurse (RN) with specialty certification in care coordination
- Bachelor's degree in Computer Science, Master's in Nursing Informatics
- Published 5 peer-reviewed articles on healthcare technology
- Active member of multiple healthcare innovation boards

The accomplishment I'm most proud of is the lives we've saved. Our platform has caught medication conflicts, identified care gaps, and ensured timely follow-ups that prevented serious complications. While we track business metrics, knowing that families have their loved ones because of our technology is what drives me every day.`,
  },
];

export async function seedSampleApplications() {
  console.log('🌱 Seeding sample applications...');

  try {
    // Titan100 org is ID 2 (from previous seed)
    const titan100OrgId = 2;

    const createdApplicants = [];
    const createdApplications = [];

    for (let i = 0; i < sampleApplicants.length; i++) {
      const applicantData = sampleApplicants[i];
      const responses = sampleResponses[i];

      // Create applicant
      const [applicant] = await db
        .insert(applicants)
        .values({
          ...applicantData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdApplicants.push(applicant);
      console.log(`✅ Created applicant: ${applicant.firstName} ${applicant.lastName}`);

      // Create application
      const [application] = await db
        .insert(applications)
        .values({
          organizationId: titan100OrgId,
          applicantId: applicant.id,
          submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          submissionData: responses,
        })
        .returning();

      createdApplications.push(application);
      console.log(`✅ Created application: #${application.id}`);
    }

    console.log('\n🎉 Sample applications successfully created!');
    console.log('\nSummary:');
    console.log(`  Applicants: ${createdApplicants.length}`);
    console.log(`  Applications: ${createdApplications.length}`);

    return {
      applicants: createdApplicants,
      applications: createdApplications,
    };
  } catch (error) {
    console.error('❌ Error seeding sample applications:', error);
    throw error;
  }
}

// Run the seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSampleApplications()
    .then(() => {
      console.log('\n✨ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seed failed:', error);
      process.exit(1);
    });
}
