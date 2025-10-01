/**
 * Seed 10 Template Applications
 *
 * Creates 10 diverse, realistic Titan100 applications for multi-judge scoring.
 */

import dotenv from 'dotenv';
dotenv.config();

import { db, applicants, applications } from './index';

const applicantData = [
  {
    firstName: 'Marcus',
    lastName: 'Thompson',
    email: 'marcus@innovatesystems.com',
    phone: '312-555-0101',
    metadata: { company: 'Innovate Systems', title: 'CEO', industry: 'Software' },
  },
  {
    firstName: 'Lisa',
    lastName: 'Chang',
    email: 'lisa.chang@greentech.io',
    phone: '312-555-0102',
    metadata: { company: 'GreenTech Solutions', title: 'Founder & CEO', industry: 'CleanTech' },
  },
  {
    firstName: 'Roberto',
    lastName: 'Garcia',
    email: 'roberto@medicalai.com',
    phone: '312-555-0103',
    metadata: { company: 'Medical AI Inc', title: 'CEO', industry: 'Healthcare AI' },
  },
  {
    firstName: 'Jennifer',
    lastName: 'Park',
    email: 'jennifer@foodlogistics.com',
    phone: '312-555-0104',
    metadata: { company: 'Fresh Food Logistics', title: 'CEO & Founder', industry: 'Supply Chain' },
  },
  {
    firstName: 'David',
    lastName: 'O\'Connor',
    email: 'david@eduplatform.com',
    phone: '312-555-0105',
    metadata: { company: 'EduPlatform', title: 'CEO', industry: 'EdTech' },
  },
  {
    firstName: 'Samantha',
    lastName: 'Washington',
    email: 'sam@urbandev.com',
    phone: '312-555-0106',
    metadata: { company: 'Urban Development Co', title: 'CEO', industry: 'Real Estate' },
  },
  {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed@cyberdefense.com',
    phone: '312-555-0107',
    metadata: { company: 'CyberDefense Pro', title: 'Founder & CEO', industry: 'Cybersecurity' },
  },
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria@artisanfood.com',
    phone: '312-555-0108',
    metadata: { company: 'Artisan Foods Group', title: 'CEO', industry: 'Food & Beverage' },
  },
  {
    firstName: 'Kevin',
    lastName: 'Nguyen',
    email: 'kevin@techmanufacturing.com',
    phone: '312-555-0109',
    metadata: { company: 'Advanced Manufacturing Tech', title: 'CEO', industry: 'Manufacturing' },
  },
  {
    firstName: 'Rachel',
    lastName: 'Bennett',
    email: 'rachel@wellnesstech.com',
    phone: '312-555-0110',
    metadata: { company: 'Wellness Tech Solutions', title: 'Founder & CEO', industry: 'Health & Wellness' },
  },
];

const applicationResponses = [
  {
    entrepreneurial_story: `I founded Innovate Systems in 2018 after 12 years in enterprise software. The idea came from frustration with legacy systems holding businesses back. Starting with $75K savings, I built our first cloud migration platform in a Chicago co-working space.

The first year was brutal - 43 rejections from VCs, nearly bankrupted twice. Our breakthrough came when a mid-market manufacturer took a chance on us. We cut their infrastructure costs by 60%. That success opened doors.

We grew from 3 to 65 employees, secured $8M Series A, and now serve 150+ clients across the Midwest. Revenue hit $12M last year. Every challenge taught me resilience - from product pivots to team building to scaling operations.

The journey from rejected to respected has been incredible. We're proving that Midwest tech companies can compete globally.`,

    company_vision: `By 2030, Innovate Systems will be the leading cloud infrastructure platform for mid-market manufacturers and logistics companies. We'll serve 500+ clients and reach $50M ARR.

Our vision is democratizing enterprise-grade cloud infrastructure. We're building AI-powered migration tools that make digital transformation accessible and affordable. We'll expand beyond Midwest to national presence.

Success means helping traditional businesses compete in the digital age. We'll measure impact by jobs preserved through modernization, not just revenue. We're building the infrastructure backbone for America's industrial heartland.`,

    what_makes_titan: `I bridge two worlds others can't: deep technical expertise and manufacturing domain knowledge. My CS PhD combined with years working in factories gives unique perspective on real-world tech problems.

I've pioneered cloud-native solutions for legacy systems - published 4 papers, spoken at AWS Summit, hold 2 patents. Built 95% employee retention through culture of learning and ownership.

What sets me apart is commitment to industrial America. While others chase consumer tech, I'm modernizing the backbone of our economy. I mentor 12 founders in industrial tech and serve on manufacturing innovation boards.`,

    accomplishments: `- Grew company from $0 to $12M ARR in 5 years
- Secured $8M venture funding from Midwest VCs
- 150+ enterprise clients with 97% retention
- 2 US patents in cloud migration technology
- Featured in TechCrunch and Industrial Tech Magazine
- Keynote at AWS Midwest Summit 2024
- Built team of 65 with industry-leading retention
- Saved clients average 55% on infrastructure costs
- Mentor to 12 industrial tech founders
- Board member Chicago Tech Alliance`,
  },
  {
    entrepreneurial_story: `GreenTech Solutions was born from a solar panel installation that changed my life in 2019. As an environmental engineer, I saw massive inefficiencies in commercial sustainability. I quit my stable job to build better solutions.

Started with $50K loan and one client - a struggling grocery chain. Helped them cut energy costs 40% through smart HVAC and solar. They became our case study. Year one was harsh - maxed credit cards, worked 80-hour weeks, questioned everything.

Pandemic nearly killed us. Then businesses started caring about ESG. We exploded - 5 to 40 employees, $6M revenue, 80+ corporate clients. We're making sustainability profitable, not just ethical.`,

    company_vision: `We'll become the premier sustainability partner for Midwestern enterprises by 2030 - 300+ clients, $35M revenue. Beyond energy efficiency, we're building comprehensive ESG platforms.

Our technology will predict sustainability ROI with AI, integrate with existing operations seamlessly. We envision every mid-market company achieving net-zero profitably. Success means preventing 1M tons of CO2 emissions annually while creating jobs and profit.`,

    what_makes_titan: `I'm one of few female CEOs in industrial sustainability with PE background and engineering expertise. Built practical solutions that deliver financial returns, not just environmental impact.

Recognition includes "Top 30 Sustainability Leaders" and speaking at CleanTech Summit. Our client retention is 94% because we deliver measurable ROI. I've mentored 8 women in cleantech and donated $200K to environmental education.`,

    accomplishments: `- $6M revenue with 300% YoY growth
- Reduced client emissions by 45K tons CO2 annually
- 80+ enterprise clients across 6 states
- Named "Sustainability Leader of Year" 2024
- Featured in Forbes Sustainability 50
- Prevented $15M in client energy waste
- 94% client retention rate
- 40 employees with 50% women in leadership
- Mentored 8 women cleantech founders
- Board member Midwest CleanTech Association`,
  },
  {
    entrepreneurial_story: `Medical AI Inc started when my mother's misdiagnosis nearly cost her life. As a radiologist and ML researcher, I saw AI could prevent such tragedies. I left academic medicine in 2020 to build diagnostic AI tools.

First two years were education - hospitals are risk-averse. After 28 rejections, Mayo Clinic piloted our lung cancer detection AI. Results were stunning - 35% improvement in early detection. FDA clearance followed, then hospital contracts flooded in.

We're now in 30 hospitals across 12 states, helped detect 200+ early-stage cancers. From rejected to saving lives in 4 years.`,

    company_vision: `By 2029, our AI will assist 100+ hospitals, screening 500K patients annually. We're expanding beyond radiology to pathology and cardiology. Vision is making world-class diagnostic expertise accessible everywhere.

We'll reduce diagnostic errors 50%, detect cancers years earlier. Success measured in lives saved and healthcare costs reduced through early intervention.`,

    what_makes_titan: `Unique combination - board-certified radiologist, ML PhD, FDA regulatory expert. Published 12 peer-reviewed papers on medical AI. Built team of MDs and PhDs who understand both medicine and technology.

Hold 3 medical imaging patents. Keynote at RSNA 2024. What distinguishes me is patient-first approach - every algorithm is tested against "would this help my mother?"`,

    accomplishments: `- FDA cleared diagnostic AI in 3 modalities
- Deployed in 30 hospitals, 12 states
- Helped detect 200+ early cancers
- $4M NIH research grants
- 12 peer-reviewed publications
- 3 medical imaging patents
- Keynote RSNA Conference 2024
- 97% diagnostic accuracy rate
- Featured JAMA AI in Medicine
- Mentor to 5 physician entrepreneurs`,
  },
  {
    entrepreneurial_story: `Fresh Food Logistics emerged from frustration with food waste. Managing supply chain for restaurant group, I watched 30% of fresh food spoil in transit. Unacceptable. I built better cold chain logistics in 2019.

Started with 2 refrigerated trucks and IoT sensors I built myself. First clients were skeptical. Then we cut their waste from 30% to 5%. Word spread. Grew to 50-truck fleet, $10M revenue, serving 200+ restaurants and grocers.

Learned everything hard way - from refrigeration engineering to fleet management to food safety regulations. Every challenge made us stronger.`,

    company_vision: `We'll become the Midwest's leading fresh food logistics provider by 2030 - 200 trucks, $50M revenue, zero food waste through AI-powered route optimization and predictive maintenance.

Vision is eliminating food waste in supply chain while making fresh food affordable for everyone. Success means feeding more people while wasting less.`,

    what_makes_titan: `Only logistics CEO with both supply chain MBA and refrigeration engineering degree. Built proprietary IoT system that's now industry standard. Reduced industry waste average 70%.

Featured in Supply Chain Management Review. Active in food security advocacy. What sets me apart is obsession with measurement - we track waste to the ounce.`,

    accomplishments: `- $10M revenue with 80% gross margins
- 50-truck fleet with 99.7% on-time delivery
- Reduced client food waste 70% average
- 200+ restaurant and grocery clients
- Built IoT tracking system (patent pending)
- Featured Supply Chain Management Review
- Zero safety violations in 5 years
- Created 75 jobs with living wages
- Donated 100K meals through waste recovery
- Advisory board Food Logistics Association`,
  },
  {
    entrepreneurial_story: `EduPlatform was born from teaching underserved students. As high school teacher, I saw students fail not from lack of ability but lack of personalized support. Built adaptive learning software nights and weekends in 2020.

First version was rough. Convinced one principal to pilot it. Student math scores improved 25% in one semester. That principal became our advocate. Grew from side project to full-time venture to 50-person company.

Now in 300+ schools, helping 100K students annually. Education tech is hard - low budgets, high stakes. But watching struggling students succeed makes every challenge worthwhile.`,

    company_vision: `By 2030, we'll serve 1M students across 2,000 schools. Expanding beyond math to all core subjects. Vision is every student getting personalized education that adapts to their learning style.

We'll prove technology can close achievement gaps when designed for equity, not efficiency. Success measured in students who graduate ready for college or careers.`,

    what_makes_titan: `Only edtech CEO with 10 years classroom experience plus CS degree. Build software teachers actually want to use because I lived their challenges. Student outcomes improved 30% average.

Published research on adaptive learning. Speak at ISTE conference annually. Donated our platform to 50+ Title I schools. What distinguishes me is relentless focus on learning outcomes, not engagement metrics.`,

    accomplishments: `- 300+ schools, 100K students using platform
- Student outcomes improved 30% average
- $7M revenue with strong unit economics
- Featured Education Week and EdSurge
- Research published in EdTech Journal
- Keynote speaker ISTE 2024
- Donated platform to 50 Title I schools
- 50 employees, 60% former educators
- 92% teacher satisfaction rate
- Board member National EdTech Association`,
  },
  {
    entrepreneurial_story: `Urban Development Co started when I couldn't find affordable workspace for my first startup in 2018. I bought an abandoned warehouse, renovated it into creative offices. Other entrepreneurs wanted in.

Realized Chicago has hundreds of underutilized industrial buildings and thousands of entrepreneurs needing space. Built business model around affordable adaptive reuse. Started with $200K personal savings and SBA loan.

Now own/manage 8 properties, 500K sq ft, 150+ tenant companies. Created ecosystems where startups thrive through shared resources and community. From one building to mini-empire in 6 years.`,

    company_vision: `By 2030, we'll manage 30 properties across Midwest, 2M sq ft of creative workspace. Creating innovation districts in forgotten neighborhoods. Vision is making entrepreneurship accessible by providing affordable infrastructure.

Success means revitalized neighborhoods, thousand of jobs created, communities rebuilt through entrepreneurship.`,

    what_makes_titan: `Only developer focused exclusively on startup ecosystems with urban planning degree and startup operator experience. Created model that's 40% cheaper than traditional office while building community.

Featured in Urban Land Magazine. Mentored 100+ startup founders in our spaces. What sets me apart is commitment to neighborhood revitalization, not just profit.`,

    accomplishments: `- 8 properties, 500K sq ft managed
- 150+ tenant startups, 1,000+ jobs created
- $15M real estate portfolio value
- Revitalized 3 underserved neighborhoods
- Featured Urban Land and Crain's Chicago
- Created 1,000 jobs in tenant companies
- 97% occupancy rate
- Affordable rates 40% below market
- Mentored 100+ founders in residence
- Board member Chicago Urban Development`,
  },
  {
    entrepreneurial_story: `CyberDefense Pro emerged from a near-disaster. In 2019, ransomware almost destroyed my previous company. We survived but I saw thousands don't. Built better cybersecurity for mid-market companies that can't afford enterprise solutions.

Started with 2 partners and security credentials from military cyber command. First year was education - convincing companies they're targets too. After several clients got attacked and we prevented breaches, market came to us.

Grew to 45 security professionals, protecting 200+ companies. Prevented $50M+ in ransomware losses. Cybersecurity isn't about IF but WHEN. We're the WHEN for companies who can't afford 24/7 security teams.`,

    company_vision: `By 2030, protecting 1,000+ mid-market companies with AI-powered threat detection and response. Building accessible cybersecurity that rivals Fortune 500 capabilities at fraction of cost.

Vision is making cybersecurity a competitive advantage, not just expense. Success means zero successful attacks on our clients.`,

    what_makes_titan: `Former military cyber operations with 15 years classified work. Built civilian security operations that leverage military-grade detection. We stop 99.4% of attacks, industry-leading.

Certified in 8 security frameworks. Speak at Black Hat and DEF CON. What distinguishes me is operational security mindset - we hunt threats, not just defend.`,

    accomplishments: `- 200+ clients with zero successful breaches
- Prevented $50M+ in ransomware losses
- $8M revenue with 60% gross margins
- 45 security professionals on team
- 8 security certifications/frameworks
- Speaker at Black Hat and DEF CON
- Featured Cybersecurity Magazine
- Built 24/7 SOC for mid-market
- 99.4% threat detection rate
- Advisory board CISA Small Business Cyber`,
  },
  {
    entrepreneurial_story: `Artisan Foods Group began in my grandmother's kitchen in 2019. Her traditional recipes deserved wider audience. Started selling at farmers markets, then specialty stores. Quality and authenticity resonated.

First year made $50K revenue from my kitchen. Health department shut me down - needed commercial facility. Borrowed $150K, opened production kitchen. Scaled from farmers markets to 200+ retail stores.

Now $9M revenue, 40 employees, distributed across Midwest. Preserving culinary traditions while building modern food business. From grandma's kitchen to grocery shelves in 5 years.`,

    company_vision: `By 2030, distributed in 2,000+ stores nationally, $40M revenue. Expanding product lines while maintaining artisan quality. Vision is preserving culinary heritage through modern food business.

Building sustainable supply chains with local farmers. Success means traditional recipes in every home while creating fair-wage food jobs.`,

    what_makes_titan: `Only food CEO with both culinary degree and food science masters. Built scalable production that maintains artisan quality - rare in food industry. 98% customer satisfaction, 85% repeat purchase rate.

Featured Food & Wine Magazine. Support 30 local farmers through sourcing. What sets me apart is refusing to compromise quality for growth.`,

    accomplishments: `- $9M revenue with 40% YoY growth
- 200+ retail stores across 8 states
- 40 employees with living wages
- 98% customer satisfaction rating
- Featured Food & Wine Magazine
- Support 30 local family farms
- Zero quality recalls in 5 years
- 85% customer repeat purchase
- Women Business Enterprise certified
- Donated 50K meals to food banks`,
  },
  {
    entrepreneurial_story: `Advanced Manufacturing Tech was born on factory floor in 2018. As mechanical engineer, I watched manufacturers struggle with outdated equipment. Built robotic retrofit systems that modernized legacy machines at 10% of replacement cost.

Bootstrapped with $80K savings. First client was skeptical manufacturer. Our retrofit increased their productivity 45%. That case study launched us. Grew to 35 engineers, $11M revenue, transformed 100+ factories.

Manufacturing is America's backbone but starved for innovation capital. We're making advanced manufacturing accessible to companies that can't afford $10M robotics systems.`,

    company_vision: `By 2030, retrofitted 500+ factories, saved 10K manufacturing jobs through productivity gains. Expanding from robotics to AI-powered predictive maintenance and quality control.

Vision is preserving American manufacturing through accessible automation. Success means competitive manufacturers creating quality jobs, not offshoring.`,

    what_makes_titan: `Mechanical engineer with robotics PhD and 12 years factory floor experience. Built retrofit solutions 90% cheaper than full automation. Saved clients average $2M per installation.

Hold 5 manufacturing automation patents. Keynote at IMTS 2024. What distinguishes me is commitment to preserving manufacturing jobs while increasing competitiveness.`,

    accomplishments: `- $11M revenue with 50% margins
- Retrofitted 100+ factories, saved 3K jobs
- 35 engineers on team
- 5 automation patents awarded
- Clients saved average $2M per install
- Featured Manufacturing Tomorrow
- Keynote IMTS Conference 2024
- 100% client ROI within 18 months
- Mentor 6 manufacturing tech founders
- Board Manufacturing Innovation Council`,
  },
  {
    entrepreneurial_story: `Wellness Tech Solutions emerged from personal health struggle in 2020. Chronic condition taught me healthcare treats illness, not wellness. Built platform connecting people to preventive care, mental health, and holistic wellness.

Started with $60K seed and vision. Year one was partnerships - signed 50 wellness providers. Year two was employers - convinced 10 companies to offer our platform. Now 150 employer clients, 50K active users.

Proven wellness prevents illness - users reduced sick days 30%, healthcare costs 25%. From personal struggle to helping thousands live healthier.`,

    company_vision: `By 2030, serving 500K users across 1,000 employers. Expanding from wellness to integrated health management. Vision is shifting healthcare from reactive to proactive.

Building AI that predicts health risks before they become crises. Success measured in healthier communities and reduced healthcare burden.`,

    what_makes_titan: `Only wellness CEO with both clinical psychology PhD and health informatics background. Built evidence-based platform with proven outcomes - 30% reduction in employee sick days.

Published research on preventive health. Keynote at Corporate Wellness Summit. What sets me apart is data-driven approach to wellness that delivers ROI.`,

    accomplishments: `- 150 employer clients, 50K active users
- Users reduced sick days 30% average
- $6M revenue with 70% gross margins
- Published 3 research papers
- Featured Harvard Business Review
- Keynote Corporate Wellness Summit
- 92% user satisfaction rate
- Proven healthcare cost reduction 25%
- Built team of licensed wellness providers
- Advisory board Corporate Health Council`,
  },
];

export async function seed10Applications() {
  console.log('🌱 Seeding 10 template applications...');

  try {
    const titan100OrgId = 2; // Titan100 organization

    const createdApplicants = [];
    const createdApplications = [];

    for (let i = 0; i < applicantData.length; i++) {
      const applicant = applicantData[i];
      const responses = applicationResponses[i];

      // Create applicant
      const [newApplicant] = await db
        .insert(applicants)
        .values({
          ...applicant,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdApplicants.push(newApplicant);
      console.log(`✅ Created applicant: ${newApplicant.firstName} ${newApplicant.lastName}`);

      // Create application
      const [newApplication] = await db
        .insert(applications)
        .values({
          organizationId: titan100OrgId,
          applicantId: newApplicant.id,
          submittedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random within last 14 days
          submissionData: responses,
        })
        .returning();

      createdApplications.push(newApplication);
      console.log(`✅ Created application: #${newApplication.id}`);
    }

    console.log('\n🎉 Template applications successfully created!');
    console.log('\nSummary:');
    console.log(`  Applicants: ${createdApplicants.length}`);
    console.log(`  Applications: ${createdApplications.length}`);
    console.log('\nThese applications can now be evaluated by multiple judges.');
    console.log('Each judge can score each application independently.');

    return {
      applicants: createdApplicants,
      applications: createdApplications,
    };
  } catch (error) {
    console.error('❌ Error seeding template applications:', error);
    throw error;
  }
}

// Run the seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed10Applications()
    .then(() => {
      console.log('\n✨ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seed failed:', error);
      process.exit(1);
    });
}
