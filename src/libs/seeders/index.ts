import { runAllSeeders as runCompetitionSeeders } from "./competitionSeeder";
import { seedSeminars, seedSampleSeminarRegistrations } from "./seminarSeeder";

// Fungsi utama untuk menjalankan semua seeder
export const runAllSeeders = async () => {
  try {
    console.log('🚀 Starting complete database seeding...');
    console.log('=' .repeat(50));
    
    // Jalankan seeder kompetisi
    console.log('📊 Seeding competitions and registrations...');
    await runCompetitionSeeders();
    
    console.log('🎤 Seeding seminars...');
    await seedSeminars();
    
    console.log('📝 Seeding sample seminar registrations...');
    await seedSampleSeminarRegistrations();
    
    console.log('=' .repeat(50));
    console.log('🎉 Complete database seeding successful!');
    console.log('✅ All data has been seeded successfully');
    console.log('📈 You can now view the data in your dashboard');
    
    return {
      success: true,
      message: 'All seeders completed successfully'
    };
    
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    console.log('❌ Please check your database connection and try again');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Fungsi untuk reset dan re-seed database
export const resetAndSeed = async () => {
  try {
    console.log('🔄 Resetting and re-seeding database...');
    
    // Import supabase untuk reset data
    const { supabase } = await import("../scripts/seed");
    
    // Reset tables (hati-hati: ini akan menghapus semua data!)
    console.log('🗑️  Clearing existing data...');
    
    await supabase.from('competition_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('seminar_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('competitions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('seminars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Existing data cleared');
    
    // Jalankan seeder
    const result = await runAllSeeders();
    
    return result;
    
  } catch (error) {
    console.error('💥 Reset and seed failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Helper function untuk menjalankan seeder individual
export const runIndividualSeeder = async (seederType: 'competitions' | 'seminars' | 'all') => {
  try {
    console.log(`🚀 Running ${seederType} seeder...`);
    
    switch (seederType) {
      case 'competitions':
        await runCompetitionSeeders();
        break;
      case 'seminars':
        await seedSeminars();
        await seedSampleSeminarRegistrations();
        break;
      case 'all':
        await runAllSeeders();
        break;
      default:
        throw new Error(`Unknown seeder type: ${seederType}`);
    }
    
    console.log(`✅ ${seederType} seeder completed successfully`);
    return { success: true };
    
  } catch (error) {
    console.error(`💥 ${seederType} seeder failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Export semua fungsi seeder
export * from './competitionSeeder';
export * from './seminarSeeder';
