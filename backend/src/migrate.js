/**
 * One-time migration: marks all users with nativeLanguage set as isOnboarded=true.
 * Run once: node src/migrate.js
 */
import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './lib/db.js';

const run = async () => {
  await connectDB();

  const result = await mongoose.connection.collection('users').updateMany(
    { nativeLanguage: { $exists: true, $ne: '' } },
    { $set: { isOnboarded: true } }
  );

  console.log(`Migration complete: ${result.modifiedCount} users updated.`);
  process.exit(0);
};

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
