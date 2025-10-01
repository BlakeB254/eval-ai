import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { getPort } from 'get-port-please';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set in .env file');
  process.exit(1);
}

// Import db after env is loaded
const { db, organizations, rubrics, applicants, applications, evaluations, fieldMappings, exampleApplications } = await import('@db');

const app = express();
const PREFERRED_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// Organizations Routes
app.get('/api/organizations', async (req, res) => {
  try {
    const orgs = await db.select().from(organizations);
    res.json({ success: true, data: orgs });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch organizations' });
  }
});

app.get('/api/organizations/:id', async (req, res) => {
  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, parseInt(req.params.id)))
      .limit(1);

    if (!org.length) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    res.json({ success: true, data: org[0] });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch organization' });
  }
});

app.post('/api/organizations', async (req, res) => {
  try {
    const org = await db
      .insert(organizations)
      .values({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    res.status(201).json({ success: true, data: org[0] });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ success: false, error: 'Failed to create organization' });
  }
});

app.put('/api/organizations/:id', async (req, res) => {
  try {
    const org = await db
      .update(organizations)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, parseInt(req.params.id)))
      .returning();

    if (!org.length) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    res.json({ success: true, data: org[0] });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ success: false, error: 'Failed to update organization' });
  }
});

app.delete('/api/organizations/:id', async (req, res) => {
  try {
    await db.delete(organizations).where(eq(organizations.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Organization deleted' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ success: false, error: 'Failed to delete organization' });
  }
});

// Rubrics Routes
app.get('/api/rubrics', async (req, res) => {
  try {
    const { organizationId } = req.query;
    let query = db.select().from(rubrics);

    if (organizationId) {
      query = query.where(eq(rubrics.organizationId, parseInt(organizationId as string)));
    }

    const results = await query;
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching rubrics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch rubrics' });
  }
});

app.post('/api/rubrics', async (req, res) => {
  try {
    const rubric = await db.insert(rubrics).values(req.body).returning();
    res.status(201).json({ success: true, data: rubric[0] });
  } catch (error) {
    console.error('Error creating rubric:', error);
    res.status(500).json({ success: false, error: 'Failed to create rubric' });
  }
});

// Applicants Routes
app.get('/api/applicants', async (req, res) => {
  try {
    const results = await db.select().from(applicants);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applicants' });
  }
});

app.post('/api/applicants', async (req, res) => {
  try {
    const applicant = await db
      .insert(applicants)
      .values({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    res.status(201).json({ success: true, data: applicant[0] });
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ success: false, error: 'Failed to create applicant' });
  }
});

// Applications Routes
app.get('/api/applications', async (req, res) => {
  try {
    const { organizationId, applicantId } = req.query;
    let query = db.select().from(applications);

    if (organizationId) {
      query = query.where(eq(applications.organizationId, parseInt(organizationId as string)));
    }
    if (applicantId) {
      query = query.where(eq(applications.applicantId, parseInt(applicantId as string)));
    }

    const results = await query;
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application.length) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application[0] });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch application' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const application = await db.insert(applications).values(req.body).returning();
    res.status(201).json({ success: true, data: application[0] });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, error: 'Failed to create application' });
  }
});

// Evaluations Routes
app.get('/api/evaluations', async (req, res) => {
  try {
    const { applicationId } = req.query;
    let query = db.select().from(evaluations);

    if (applicationId) {
      query = query.where(eq(evaluations.applicationId, parseInt(applicationId as string)));
    }

    const results = await query;
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch evaluations' });
  }
});

app.post('/api/evaluations', async (req, res) => {
  try {
    const evaluation = await db.insert(evaluations).values(req.body).returning();
    res.status(201).json({ success: true, data: evaluation[0] });
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ success: false, error: 'Failed to create evaluation' });
  }
});

// Example Applications Routes
app.get('/api/example-applications', async (req, res) => {
  try {
    const { organizationId } = req.query;
    let query = db.select().from(exampleApplications);

    if (organizationId) {
      query = query.where(eq(exampleApplications.organizationId, parseInt(organizationId as string)));
    }

    const results = await query;
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching example applications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch example applications' });
  }
});

app.post('/api/example-applications', async (req, res) => {
  try {
    const example = await db.insert(exampleApplications).values(req.body).returning();
    res.status(201).json({ success: true, data: example[0] });
  } catch (error) {
    console.error('Error creating example application:', error);
    res.status(500).json({ success: false, error: 'Failed to create example application' });
  }
});

// Import and use extended routes
const extendedRoutes = await import('./routes/extended-routes.js');
app.use('/api', extendedRoutes.default);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

async function startServer() {
  const PORT = await getPort({ port: PREFERRED_PORT, portRange: [3000, 3100] });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🗄️  Database: Neon PostgreSQL`);

    if (PORT !== PREFERRED_PORT) {
      console.log(`⚠️  Note: Port ${PREFERRED_PORT} was in use, using ${PORT} instead`);
      console.log(`💡 Update your client proxy to point to http://localhost:${PORT}`);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
