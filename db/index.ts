import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import * as extendedSchema from './extended-schema';

// Load environment variables (safe to call multiple times)
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Combine base schema and extended schema
const fullSchema = { ...schema, ...extendedSchema };

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema: fullSchema });

export type DbClient = typeof db;

// Re-export base schema
export * from './schema';

// Re-export extended schema
export * from './extended-schema';

// Re-export types
export * from './organization';
export * from './rubric';
export * from './applicant';
export * from './application';
export * from './evaluation';
export * from './mapping';
export * from './api';
export * from './enums';
