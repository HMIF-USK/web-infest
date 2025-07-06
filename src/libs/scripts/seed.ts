#!/usr/bin/env tsx

/**
 * Database Seeder Script
 * 
 * Usage:
 * npm run seed                    # Run all seeders
 * npm run seed competitions       # Run only competition seeder
 * npm run seed seminars          # Run only seminar seeder  
 * npm run seed reset             # Reset database and run all seeders
 */

import { createClient } from '@supabase/supabase-js';

// Credentials Supabase langsung disini untuk mempermudah
const supabaseUrl = 'https://qxesqdjdiuuzhmgadewe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZXNxZGpkaXV1emhtZ2FkZXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE2Njc5OSwiZXhwIjoyMDY1NzQyNzk5fQ.ExwAvN0ktMmuhtSY_XtJB0pzvI4KQRqtkc5lZN0On_o'; // Service role key untuk bypass RLS

// Buat client Supabase untuk seeder
export const supabase = createClient(supabaseUrl, supabaseKey);

// Import fungsi seeder
import { runAllSeeders, runIndividualSeeder, resetAndSeed } from '../seeders';

const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  console.log('🌱 INFEST Database Seeder');
  console.log('=' .repeat(40));
  console.log(`📋 Command: ${command}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(40));
  console.log('✅ Supabase client initialized');
  console.log('');

  try {
    let result;
    
    switch (command.toLowerCase()) {
      case 'competitions':
        result = await runIndividualSeeder('competitions');
        break;
      case 'seminars':
        result = await runIndividualSeeder('seminars');
        break;
      case 'reset':
        console.log('⚠️  WARNING: This will delete all existing data!');
        console.log('🔄 Proceeding with reset and re-seed...');
        result = await resetAndSeed();
        break;
      case 'all':
      default:
        result = await runAllSeeders();
        break;
    }

    if (result.success) {
      console.log('');
      console.log('🎉 Seeding completed successfully!');
      console.log('📊 Check your Supabase dashboard to verify the data');
      process.exit(0);
    } else {
      console.error('❌ Seeding failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n⏹️  Seeding interrupted by user');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main();
