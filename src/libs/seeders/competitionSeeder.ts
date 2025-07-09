import { supabase } from "../scripts/seed";

// Interface untuk kompetisi sesuai dengan schema database
export interface Competition {
  id?: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  registration_fee: number;
  
  // Timeline
  registration_start: string;
  registration_end: string;
  competition_start: string;
  competition_end: string;
  
  // Resources
  guidebook_url?: string;
  poster_image_url?: string;
  
  // Prizes
  first_prize_amount?: number;
  first_prize_description?: string;
  second_prize_amount?: number;
  second_prize_description?: string;
  third_prize_amount?: number;
  third_prize_description?: string;
  
  // Status and Metadata
  status: 'draft' | 'open' | 'ongoing' | 'closed' | 'completed';
  is_google_form_registration?: boolean;
  google_form_registration_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Data kompetisi untuk INFEST 2025
const competitionsData: Competition[] = [
  {
    name: "Computer Olympiad of INFEST (COINS)",
    slug: "coins-programming-contest",
    description: "Kompetisi programming selama 5 jam untuk menyelesaikan berbagai soal algoritma dan pemrograman. Peserta akan bekerja dalam tim untuk memecahkan masalah-masalah yang menantang menggunakan logika dan keterampilan coding.",
    short_description: "Kompetisi programming 5 jam dengan soal algoritma dan pemrograman",
    registration_fee: 75000,
    registration_start: "2023-12-01T00:00:00Z",
    registration_end: "2025-08-15T23:59:59Z",
    competition_start: "2025-09-01T08:00:00Z",
    competition_end: "2026-02-01T13:00:00Z",
    guidebook_url: "https://docs.google.com/document/d/1r5aPS28q4XLEHKvext7tvxrvq30hcALcWQDNb4Cfdjs/edit?tab=t.0",
    poster_image_url: "/assets/images/Computer Olympiad Infest USK.webp",
    first_prize_amount: 15000000,
    first_prize_description: "Uang tunai + Sertifikat + Trophy + Merchandise",
    second_prize_amount: 10000000,
    second_prize_description: "Uang tunai + Sertifikat + Trophy + Merchandise",
    third_prize_amount: 7500000,
    third_prize_description: "Uang tunai + Sertifikat + Trophy + Merchandise",
    status: "open",
    is_google_form_registration: true,
    google_form_registration_url: "https://docs.google.com/forms/u/0/"
  },
  {
    name: "UI/UX Design Competition",
    slug: "uiux-design-competition",
    description: "Kompetisi desain antarmuka dan pengalaman pengguna untuk menciptakan solusi digital yang inovatif dan user-friendly. Peserta akan mendesain aplikasi atau website dengan tema tertentu dalam waktu 8 jam.",
    short_description: "Kompetisi desain UI/UX dengan tema real-world problem solving",
    registration_fee: 50000,
    registration_start: "2023-12-01T00:00:00Z",
    registration_end: "2025-08-15T23:59:59Z",
    competition_start: "2025-09-01T08:00:00Z",
    competition_end: "2026-02-02T16:00:00Z",
    guidebook_url: "https://docs.google.com/document/u/1/d/1wf-F7GVP4F4JPyXD-lVvaJ7GmkQ75OG8fLx_xVamv3w/mobilebasic",
    poster_image_url: "/assets/images/hackathon.png",
    first_prize_amount: 10000000,
    first_prize_description: "Uang tunai + Sertifikat + Trophy + Tablet Drawing",
    second_prize_amount: 7500000,
    second_prize_description: "Uang tunai + Sertifikat + Trophy + Merchandise",
    third_prize_amount: 5000000,
    third_prize_description: "Uang tunai + Sertifikat + Trophy + Merchandise",
    status: "open",
    is_google_form_registration: false
  },
  {
    name: "Hackathon: Smart City Solutions",
    slug: "hackathon-smart-city",
    description: "Kompetisi hackathon 48 jam untuk mengembangkan solusi teknologi inovatif yang dapat membantu memecahkan masalah perkotaan. Peserta akan membuat aplikasi atau sistem yang mendukung konsep smart city dengan teknologi terkini.",
    short_description: "Hackathon 48 jam dengan tema Smart City Solutions",
    registration_fee: 80000,
    registration_start: "2023-12-01T00:00:00Z",
    registration_end: "2025-08-15T23:59:59Z",
    competition_start: "2025-09-01T08:00:00Z",
    competition_end: "2026-02-09T18:00:00Z",
    guidebook_url: "https://docs.google.com/document/d/1mg_EdoOXEXkwcWjV7Qba2pSaCeYgrGUCvv1uVCcCDtU/edit?tab=t.0",
    poster_image_url: "/assets/images/hackathon.png",
    first_prize_amount: 25000000,
    first_prize_description: "Uang tunai + Mentoring startup + Inkubasi + Trophy + Laptop",
    second_prize_amount: 15000000,
    second_prize_description: "Uang tunai + Mentoring startup + Trophy + Smartphone",
    third_prize_amount: 10000000,
    third_prize_description: "Uang tunai + Trophy + Smartwatch",
    status: "open",
    is_google_form_registration: false
  }
];

// Fungsi untuk menjalankan seeder kompetisi
export const seedCompetitions = async () => {
  try {
    console.log('🌱 Starting competition seeding...');

    // Hapus data lama untuk menghindari duplikasi
    console.log('🗑️  Clearing existing competition data...');
    await supabase.from('competitions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Existing data cleared');

    // Insert data kompetisi baru
    const { data, error } = await supabase
      .from('competitions')
      .insert(competitionsData.map(comp => ({
        ...comp,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      console.error('❌ Error seeding competitions:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} competitions`);
    return data;

  } catch (error) {
    console.error('❌ Competition seeding failed:', error);
    throw error;
  }
};

// Fungsi untuk seeding data registrasi contoh (optional)
// export const seedSampleRegistrations = async () => {
//   try {
//     console.log('🌱 Starting sample registrations seeding...');

//     // Ambil beberapa kompetisi yang ada
//     const { data: competitions, error: compError } = await supabase
//       .from('competitions')
//       .select('id')
//       .limit(3);

//     if (compError || !competitions || competitions.length === 0) {
//       console.log('⚠️  No competitions found, skipping registration seeding');
//       return;
//     }

//     // Data registrasi contoh
//     const sampleRegistrations = [
//       {
//         competition_id: competitions[0].id,
//         team_name: "Code Warriors",
//         team_leader_name: "Ahmad Fauzi",
//         team_leader_email: "ahmad.fauzi@example.com",
//         team_leader_phone: "081234567890",
//         university: "Universitas Syiah Kuala",
//         major: "Teknik Informatika",
//         team_members: JSON.stringify([
//           { name: "Ahmad Fauzi", role: "Leader", student_id: "2108107010001" },
//           { name: "Siti Rahma", role: "Member", student_id: "2108107010002" },
//           { name: "Budi Santoso", role: "Member", student_id: "2108107010003" }
//         ]),
//         status: "pending",
//         payment_status: "pending",
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       },
//       {
//         competition_id: competitions[1].id,
//         team_name: "Design Masters",
//         team_leader_name: "Lisa Pertiwi",
//         team_leader_email: "lisa.pertiwi@example.com",
//         team_leader_phone: "081234567891",
//         university: "Universitas Syiah Kuala",
//         major: "Sistem Informasi",
//         team_members: JSON.stringify([
//           { name: "Lisa Pertiwi", role: "Leader", student_id: "2108107010004" },
//           { name: "Rina Sari", role: "Member", student_id: "2108107010005" }
//         ]),
//         status: "pending",
//         payment_status: "pending",
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       }
//     ];

//     const { data, error } = await supabase
//       .from('competition_registrations')
//       .insert(sampleRegistrations)
//       .select();

//     if (error) {
//       console.error('❌ Error seeding sample registrations:', error);
//       throw error;
//     }

//     console.log(`✅ Successfully seeded ${data?.length || 0} sample registrations`);
//     return data;

//   } catch (error) {
//     console.error('❌ Sample registration seeding failed:', error);
//     throw error;
//   }
// };

// Fungsi utama untuk menjalankan semua seeder
export const runAllSeeders = async () => {
  try {
    console.log('🚀 Starting all seeders...');
    
    await seedCompetitions();
    // await seedSampleRegistrations();
    
    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    throw error;
  }
};

// Export data untuk digunakan di tempat lain jika diperlukan
export { competitionsData };
