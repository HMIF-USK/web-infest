"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock,
  MapPin,
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  User as UserIcon,
  DollarSign,
  Target,
  FileText,
  Plus,
  Filter,
  Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Glass Effect Component
const GlassContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-container glass-container--rounded ${className}`}>
    <div className="glass-filter" />
    <div className="glass-specular" />
    <div className="glass-content">
      {children}
    </div>
  </div>
);

// Competition data
const competitions = [
  {
    id: 1,
    name: "UI/UX Design Competition",
    description: "Kompetisi desain antarmuka dan pengalaman pengguna dengan tema inovasi digital masa depan.",
    category: "Design",
    maxTeamSize: 3,
    fee: 75000,
    deadline: "2025-07-15",
    startDate: "2025-08-01",
    endDate: "2025-08-03",
    prize: "Rp 15.000.000",
    location: "Universitas Syiah Kuala",
    status: "open",
    registered: false,
    image: "/assets/images/infest-1.webp",
    features: ["Workshop", "Mentoring", "Certificate"],
    requirements: [
      "Mahasiswa aktif D3/D4/S1",
      "Tim 1-3 orang",
      "Portfolio design minimal 3 karya"
    ]
  },
  {
    id: 2,
    name: "Competitive Programming",
    description: "Kompetisi pemrograman yang menguji kemampuan algoritma dan problem solving.",
    category: "Programming",
    maxTeamSize: 3,
    fee: 100000,
    deadline: "2025-07-20",
    startDate: "2025-08-05",
    endDate: "2025-08-06",
    prize: "Rp 20.000.000",
    location: "Universitas Syiah Kuala",
    status: "open",
    registered: true,
    image: "/assets/images/infest-2.webp",
    features: ["Online Judge", "Live Scoring", "Certificate"],
    requirements: [
      "Mahasiswa aktif D3/D4/S1",
      "Tim 1-3 orang",
      "Familiar dengan competitive programming"
    ]
  },
  {
    id: 3,
    name: "Web Development Challenge",
    description: "Kompetisi pengembangan website dengan tema smart city solutions.",
    category: "Web Dev",
    maxTeamSize: 4,
    fee: 125000,
    deadline: "2025-07-25",
    startDate: "2025-08-10",
    endDate: "2025-08-12",
    prize: "Rp 18.000.000",
    location: "Universitas Syiah Kuala",
    status: "coming-soon",
    registered: false,
    image: "/assets/images/infest-3.webp",
    features: ["API Integration", "Deployment", "Certificate"],
    requirements: [
      "Mahasiswa aktif D3/D4/S1",
      "Tim 1-4 orang",
      "Pengalaman web development"
    ]
  }
];

// Competition Card Component
const CompetitionCard = ({ competition }: { competition: typeof competitions[0] }) => {
  const isDeadlineSoon = new Date(competition.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((new Date(competition.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  const statusConfig = {
    open: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-400/20", text: "Terbuka" },
    "coming-soon": { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/20", text: "Segera" },
    closed: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/20", text: "Tutup" }
  } as const;

  const status = statusConfig[competition.status as keyof typeof statusConfig];

  return (
    <GlassContainer className="p-6 hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-xl font-bold text-neutral_01 ${dm_serif_display.className}`}>
              {competition.name}
            </h3>
            {competition.registered && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Terdaftar</span>
              </div>
            )}
          </div>
          <p className="text-neutral_01/70 text-sm mb-3">{competition.description}</p>
          
          {/* Category and Team Size */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-neutral_01/60" />
              <span className="text-sm text-neutral_01/80">{competition.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-neutral_01/60" />
              <span className="text-sm text-neutral_01/80">Max {competition.maxTeamSize} orang</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full border ${status.bg} ${status.border}`}>
          <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
        <Image
          src={competition.image}
          alt={competition.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{competition.prize}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Rp {competition.fee.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral_01/60" />
          <div>
            <p className="text-xs text-neutral_01/60">Deadline</p>
            <p className={`text-sm font-medium ${isDeadlineSoon ? 'text-red-400' : 'text-neutral_01'}`}>
              {new Date(competition.deadline).toLocaleDateString('id-ID')}
            </p>
            {daysLeft > 0 && (
              <p className={`text-xs ${isDeadlineSoon ? 'text-red-400' : 'text-neutral_01/60'}`}>
                {daysLeft} hari lagi
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral_01/60" />
          <div>
            <p className="text-xs text-neutral_01/60">Pelaksanaan</p>
            <p className="text-sm font-medium text-neutral_01">
              {new Date(competition.startDate).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <p className="text-xs text-neutral_01/60 mb-2">Fitur:</p>
        <div className="flex flex-wrap gap-2">
          {competition.features.map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-neutral_01/10 border border-neutral_01/20 rounded-full text-xs text-neutral_01/80"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-3">
        {competition.registered ? (
          <Link
            href={`/dashboard/kompetisi/${competition.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300 font-medium"
          >
            <FileText className="w-4 h-4" />
            Kelola Tim
          </Link>
        ) : competition.status === "open" ? (
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-[0_0_20px_rgba(242,233,197,0.4)]">
            <Plus className="w-4 h-4" />
            Daftar Sekarang
          </button>
        ) : (
          <button 
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01/40 rounded-xl cursor-not-allowed"
          >
            <Clock className="w-4 h-4" />
            {competition.status === "coming-soon" ? "Segera Dibuka" : "Pendaftaran Tutup"}
          </button>
        )}
        
        <Link
          href={`/dashboard/kompetisi/${competition.id}`}
          className="px-4 py-3 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 rounded-xl hover:bg-neutral_01/20 transition-all duration-300"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </GlassContainer>
  );
};

// Filter Component
const FilterSection = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  categoryFilter, 
  setCategoryFilter 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}) => (
  <GlassContainer className="p-6 mb-8">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral_01/40" />
          <input
            type="text"
            placeholder="Cari kompetisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral_01/10 border border-neutral_01/20 rounded-xl pl-12 pr-4 py-3 text-neutral_01 placeholder:text-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 focus:border-neutral_02 transition-all duration-300"
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral_01/10 border border-neutral_01/20 rounded-xl px-4 py-3 text-neutral_01 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 focus:border-neutral_02 transition-all duration-300"
        >
          <option value="">Semua Status</option>
          <option value="open">Terbuka</option>
          <option value="coming-soon">Segera</option>
          <option value="closed">Tutup</option>
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-neutral_01/10 border border-neutral_01/20 rounded-xl px-4 py-3 text-neutral_01 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 focus:border-neutral_02 transition-all duration-300"
        >
          <option value="">Semua Kategori</option>
          <option value="Design">Design</option>
          <option value="Programming">Programming</option>
          <option value="Web Dev">Web Dev</option>
        </select>
      </div>
    </div>
  </GlassContainer>
);

export default function KompetisiPage() {
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const { data: { session }, error } = await supabase.auth.getSession();
        
  //       if (error || !session) {
  //         router.replace("/login");
  //         return;
  //       }

  //       setUser(session.user);
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //       router.replace("/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  // Filter competitions
  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || comp.status === statusFilter;
    const matchesCategory = !categoryFilter || comp.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const registeredCount = competitions.filter(comp => comp.registered).length;
  const openCount = competitions.filter(comp => comp.status === "open").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral_01/30 border-t-neutral_01 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral_01/60">Memuat kompetisi...</p>
        </div>
      </div>
    );
  }

  // if (!user) {
  //   return null;
  // }

  return (
    <div className={`space-y-8 ${montserrat.className}`}>
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className={`text-3xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
          Kompetisi InFest USK 2025
        </h1>
        <p className="text-lg text-neutral_01/80 max-w-3xl">
          Ikuti berbagai kompetisi seru dan menantang! Asah kemampuanmu, bertemu dengan peserta lain, 
          dan raih berbagai hadiah menarik.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassContainer className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl mx-auto mb-3">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <p className={`text-2xl font-bold text-neutral_01 mb-1 ${dm_serif_display.className}`}>
            {competitions.length}
          </p>
          <p className="text-neutral_01/60 text-sm">Total Kompetisi</p>
        </GlassContainer>

        <GlassContainer className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <p className={`text-2xl font-bold text-neutral_01 mb-1 ${dm_serif_display.className}`}>
            {registeredCount}
          </p>
          <p className="text-neutral_01/60 text-sm">Terdaftar</p>
        </GlassContainer>

        <GlassContainer className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 rounded-xl mx-auto mb-3">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <p className={`text-2xl font-bold text-neutral_01 mb-1 ${dm_serif_display.className}`}>
            {openCount}
          </p>
          <p className="text-neutral_01/60 text-sm">Pendaftaran Terbuka</p>
        </GlassContainer>
      </div>

      {/* Filter Section */}
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompetitions.map(competition => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>

      {/* No Results */}
      {filteredCompetitions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-neutral_01/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-neutral_01/40" />
          </div>
          <h3 className={`text-xl font-bold text-neutral_01 mb-2 ${dm_serif_display.className}`}>
            Tidak ada kompetisi ditemukan
          </h3>
          <p className="text-neutral_01/60 mb-4">
            Coba ubah filter pencarian atau kata kunci Anda
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCategoryFilter("");
            }}
            className="px-6 py-3 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 rounded-xl hover:bg-neutral_01/20 transition-all duration-300"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
} 