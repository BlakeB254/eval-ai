/**
 * Cleanup Test Data
 *
 * Removes test organizations and keeps only Titan100
 */

import dotenv from 'dotenv';
dotenv.config();

import { db, organizations } from './index';
import { ne } from 'drizzle-orm';

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');

  try {
    // List all organizations
    const allOrgs = await db.select().from(organizations);
    console.log('\nCurrent organizations:');
    allOrgs.forEach(org => {
      console.log(`  - ID ${org.id}: ${org.name}`);
    });

    // Delete all organizations except Titan100 (ID 2)
    const deleted = await db.delete(organizations)
      .where(ne(organizations.id, 2))
      .returning();

    if (deleted.length > 0) {
      console.log('\n✅ Deleted organizations:');
      deleted.forEach(org => {
        console.log(`  - ID ${org.id}: ${org.name}`);
      });
    } else {
      console.log('\n✅ No test organizations to delete');
    }

    // Verify final state
    const remaining = await db.select().from(organizations);
    console.log('\n📊 Remaining organizations:');
    remaining.forEach(org => {
      console.log(`  - ID ${org.id}: ${org.name}`);
    });

    console.log('\n🎉 Cleanup complete!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run cleanup
cleanupTestData()
  .then(() => {
    console.log('\n✨ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error);
    process.exit(1);
  });
