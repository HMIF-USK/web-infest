import { supabase } from "../scripts/seed";

// Interface untuk seminar sesuai dengan schema database
export interface Seminar {
  id?: string;
  title: string;
  description: string;
  speaker_name: string;
  speaker_bio: string;
  speaker_image_url?: string;
  seminar_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  registration_fee: number;
  registration_deadline: string;
  topics: string;
  target_audience: string;
  is_active: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Data seminar untuk INFEST 2025
const seminarsData: Seminar[] = [
  {
    title: "Artificial Intelligence in Modern Software Development",
    description: "Seminar tentang penerapan AI dalam pengembangan software modern, termasuk machine learning, natural language processing, dan automation tools yang dapat meningkatkan produktivitas developer.",
    speaker_name: "Dr. Budi Rahardjo",
    speaker_bio: "PhD in Computer Science dari Stanford University. Founder & CTO di PT. AI Indonesia. Memiliki pengalaman 15+ tahun dalam pengembangan AI dan machine learning. Penulis 5 buku tentang teknologi AI.",
    speaker_image_url: "/assets/images/speakers/budi-rahardjo.jpg",
    seminar_date: "2025-02-05T00:00:00Z",
    start_time: "09:00",
    end_time: "12:00",
    location: "Auditorium FMIPA USK",
    max_participants: 200,
    registration_fee: 25000,
    registration_deadline: "2025-02-03T23:59:59Z",
    topics: JSON.stringify([
      "Introduction to AI in Software Development",
      "Machine Learning for Developers",
      "Natural Language Processing Applications",
      "AI-Powered Development Tools",
      "Future of AI in Programming",
      "Hands-on AI Implementation"
    ]),
    target_audience: "Mahasiswa IT, Software Developer, Tech Enthusiast",
    is_active: true,
    image_url: "/assets/images/seminar-ai.jpg"
  },
  {
    title: "Cybersecurity: Protecting Digital Assets in 2025",
    description: "Seminar mendalam tentang cybersecurity terkini, termasuk threat landscape, best practices security, ethical hacking, dan career path di bidang cybersecurity.",
    speaker_name: "Ir. Sari Wijaya, M.Kom, CISSP",
    speaker_bio: "Certified Information Systems Security Professional (CISSP). Security Consultant di berbagai perusahaan multinasional. Memiliki 12+ tahun pengalaman dalam cybersecurity dan ethical hacking.",
    speaker_image_url: "/assets/images/speakers/sari-wijaya.jpg",
    seminar_date: "2025-02-06T00:00:00Z",
    start_time: "13:00",
    end_time: "16:00",
    location: "Lab Komputer FMIPA USK",
    max_participants: 150,
    registration_fee: 30000,
    registration_deadline: "2025-02-04T23:59:59Z",
    topics: JSON.stringify([
      "Current Cybersecurity Threats 2025",
      "Network Security Fundamentals",
      "Web Application Security",
      "Penetration Testing Basics",
      "Incident Response & Recovery",
      "Career Path in Cybersecurity"
    ]),
    target_audience: "Mahasiswa IT, Network Administrator, Security Enthusiast",
    is_active: true,
    image_url: "/assets/images/seminar-security.jpg"
  },
  {
    title: "Cloud Computing & DevOps: Building Scalable Applications",
    description: "Workshop praktis tentang cloud computing dan DevOps practices. Peserta akan belajar deploy aplikasi di cloud, CI/CD pipeline, containerization, dan monitoring.",
    speaker_name: "Muhammad Iqbal, AWS Solutions Architect",
    speaker_bio: "AWS Certified Solutions Architect - Professional. Lead DevOps Engineer di Gojek. Expertise dalam cloud architecture, Kubernetes, dan automation. Speaker di berbagai tech conference nasional.",
    speaker_image_url: "/assets/images/speakers/muhammad-iqbal.jpg",
    seminar_date: "2025-02-07T00:00:00Z",
    start_time: "08:30",
    end_time: "17:00",
    location: "Lab Cloud Computing USK",
    max_participants: 100,
    registration_fee: 50000,
    registration_deadline: "2025-02-05T23:59:59Z",
    topics: JSON.stringify([
      "Introduction to Cloud Computing",
      "AWS/Azure/GCP Overview",
      "Containerization with Docker",
      "Kubernetes Orchestration",
      "CI/CD Pipeline Implementation",
      "Monitoring & Logging",
      "Hands-on Cloud Deployment"
    ]),
    target_audience: "Software Developer, System Administrator, DevOps Engineer",
    is_active: true,
    image_url: "/assets/images/seminar-cloud.jpg"
  },
  {
    title: "Mobile App Development: Flutter vs React Native",
    description: "Perbandingan comprehensive antara Flutter dan React Native untuk mobile app development. Termasuk demo live coding dan tips memilih framework yang tepat.",
    speaker_name: "Andi Kusuma, Senior Mobile Developer",
    speaker_bio: "Senior Mobile Developer di Tokopedia. 8+ tahun pengalaman dalam mobile development. Expert dalam Flutter, React Native, dan native Android/iOS development.",
    speaker_image_url: "/assets/images/speakers/andi-kusuma.jpg",
    seminar_date: "2025-02-08T00:00:00Z",
    start_time: "09:00",
    end_time: "12:00",
    location: "Auditorium Teknik USK",
    max_participants: 180,
    registration_fee: 20000,
    registration_deadline: "2025-02-06T23:59:59Z",
    topics: JSON.stringify([
      "Mobile Development Landscape 2025",
      "Flutter Framework Deep Dive",
      "React Native Capabilities",
      "Performance Comparison",
      "Live Coding Demo",
      "Choosing the Right Framework",
      "Future of Mobile Development"
    ]),
    target_audience: "Mobile Developer, Frontend Developer, Computer Science Students",
    is_active: true,
    image_url: "/assets/images/seminar-mobile.jpg"
  },
  {
    title: "Data Science & Machine Learning for Beginners",
    description: "Workshop introduction untuk data science dan machine learning. Cocok untuk pemula yang ingin memulai karir di bidang data. Termasuk hands-on dengan Python dan tools populer.",
    speaker_name: "Dr. Maya Sari, Data Scientist",
    speaker_bio: "PhD in Data Science dari MIT. Senior Data Scientist di Google Indonesia. Peneliti aktif dalam machine learning dan big data analytics. Mentor di berbagai bootcamp data science.",
    speaker_image_url: "/assets/images/speakers/maya-sari.jpg",
    seminar_date: "2025-02-09T00:00:00Z",
    start_time: "08:00",
    end_time: "17:00",
    location: "Lab Data Science USK",
    max_participants: 120,
    registration_fee: 40000,
    registration_deadline: "2025-02-07T23:59:59Z",
    topics: JSON.stringify([
      "Introduction to Data Science",
      "Python for Data Analysis",
      "Machine Learning Basics",
      "Data Visualization",
      "Statistical Analysis",
      "Hands-on Projects",
      "Career Path in Data Science"
    ]),
    target_audience: "Mahasiswa Matematika/Statistik/IT, Data Analyst, Business Analyst",
    is_active: true,
    image_url: "/assets/images/seminar-datascience.jpg"
  },
  {
    title: "Blockchain Technology & Web3 Development",
    description: "Seminar tentang teknologi blockchain, cryptocurrency, smart contracts, dan pengembangan aplikasi Web3. Termasuk overview tentang NFT, DeFi, dan metaverse.",
    speaker_name: "Rizki Pratama, Blockchain Developer",
    speaker_bio: "Blockchain Developer di Pintu (Crypto Exchange). Founder startup blockchain. 6+ tahun pengalaman dalam cryptocurrency dan smart contract development. Kontributor open source blockchain projects.",
    speaker_image_url: "/assets/images/speakers/rizki-pratama.jpg",
    seminar_date: "2025-02-10T00:00:00Z",
    start_time: "13:00",
    end_time: "17:00",
    location: "Ruang Seminar FMIPA USK",
    max_participants: 160,
    registration_fee: 35000,
    registration_deadline: "2025-02-08T23:59:59Z",
    topics: JSON.stringify([
      "Blockchain Technology Fundamentals",
      "Cryptocurrency & Digital Assets",
      "Smart Contracts Development",
      "Web3 Applications",
      "DeFi & NFT Overview",
      "Metaverse & Virtual Worlds",
      "Future of Blockchain"
    ]),
    target_audience: "Software Developer, Crypto Enthusiast, Tech Entrepreneur",
    is_active: true,
    image_url: "/assets/images/seminar-blockchain.jpg"
  }
];

// Fungsi untuk menjalankan seeder seminar
export const seedSeminars = async () => {
  try {
    console.log('🌱 Starting seminar seeding...');

    // Hapus data lama (optional - uncomment jika ingin reset)
    // await supabase.from('seminars').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert data seminar baru
    const { data, error } = await supabase
      .from('seminars')
      .insert(seminarsData.map(seminar => ({
        ...seminar,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      console.error('❌ Error seeding seminars:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} seminars`);
    return data;

  } catch (error) {
    console.error('❌ Seminar seeding failed:', error);
    throw error;
  }
};

// Fungsi untuk seeding data pendaftaran seminar contoh (optional)
export const seedSampleSeminarRegistrations = async () => {
  try {
    console.log('🌱 Starting sample seminar registrations seeding...');

    // Ambil beberapa seminar yang ada
    const { data: seminars, error: seminarError } = await supabase
      .from('seminars')
      .select('id')
      .limit(3);

    if (seminarError || !seminars || seminars.length === 0) {
      console.log('⚠️  No seminars found, skipping registration seeding');
      return;
    }

    // Data pendaftaran seminar contoh
    const sampleRegistrations = [
      {
        seminar_id: seminars[0].id,
        participant_name: "Ahmad Fauzi",
        participant_email: "ahmad.fauzi@example.com",
        participant_phone: "081234567890",
        university: "Universitas Syiah Kuala",
        faculty: "Fakultas MIPA",
        major: "Teknik Informatika",
        student_id: "2108107010001",
        status: "confirmed",
        payment_status: "paid",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        seminar_id: seminars[1].id,
        participant_name: "Siti Rahma",
        participant_email: "siti.rahma@example.com",
        participant_phone: "081234567891",
        university: "Universitas Syiah Kuala",
        faculty: "Fakultas MIPA",
        major: "Sistem Informasi",
        student_id: "2108107010002",
        status: "pending",
        payment_status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data, error } = await supabase
      .from('seminar_registrations')
      .insert(sampleRegistrations)
      .select();

    if (error) {
      console.error('❌ Error seeding sample seminar registrations:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} sample seminar registrations`);
    return data;

  } catch (error) {
    console.error('❌ Sample seminar registration seeding failed:', error);
    throw error;
  }
};

// Export data untuk digunakan di tempat lain jika diperlukan
export { seminarsData };
