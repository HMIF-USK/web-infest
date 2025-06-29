"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import { 
  Users, 
  Crown, 
  Mail, 
  Phone,
  School,
  UserPlus,
  UserMinus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Share2,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  User as UserIcon,
  Plus,
  Send
} from "lucide-react";
import Image from "next/image";

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

// Sample team data
const teams = [
  {
    id: 1,
    name: "Digital Innovators",
    competition: "UI/UX Design Competition",
    memberCount: 3,
    maxMembers: 3,
    role: "leader",
    status: "complete",
    inviteCode: "DI2025",
    created: "2025-01-15",
    members: [
      {
        id: 1,
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        institution: "Universitas Syiah Kuala",
        major: "Informatika",
        role: "leader",
        joinedAt: "2025-01-15",
        avatar: null
      },
      {
        id: 2,
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@email.com",
        phone: "+62 813-4567-8901",
        institution: "Universitas Syiah Kuala",
        major: "Sistem Informasi",
        role: "member",
        joinedAt: "2025-01-16",
        avatar: null
      },
      {
        id: 3,
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62 814-5678-9012",
        institution: "Politeknik Negeri Lhokseumawe",
        major: "Teknik Informatika",
        role: "member",
        joinedAt: "2025-01-17",
        avatar: null
      }
    ]
  },
  {
    id: 2,
    name: "Code Warriors",
    competition: "Competitive Programming",
    memberCount: 2,
    maxMembers: 3,
    role: "leader",
    status: "incomplete",
    inviteCode: "CW2025",
    created: "2025-01-20",
    members: [
      {
        id: 1,
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        institution: "Universitas Syiah Kuala",
        major: "Informatika",
        role: "leader",
        joinedAt: "2025-01-20",
        avatar: null
      },
      {
        id: 2,
        name: "Dewi Sartika",
        email: "dewi.sartika@email.com",
        phone: "+62 815-6789-0123",
        institution: "Universitas Syiah Kuala",
        major: "Informatika",
        role: "member",
        joinedAt: "2025-01-21",
        avatar: null
      }
    ]
  }
];

// Team Member Card Component
const MemberCard = ({ 
  member, 
  isCurrentUser, 
  canManage 
}: { 
  member: typeof teams[0]['members'][0]; 
  isCurrentUser: boolean;
  canManage: boolean;
}) => (
  <GlassContainer className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 relative">
          {member.avatar ? (
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover rounded-full border-2 border-neutral_02"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral_02/20 to-brand_01/20 rounded-full flex items-center justify-center border-2 border-neutral_02">
              <UserIcon className="w-8 h-8 text-neutral_01/60" />
            </div>
          )}
          
          {/* Role indicator */}
          {member.role === "leader" && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-brand_01 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
          
          {isCurrentUser && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-brand_01 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold text-neutral_01 ${dm_serif_display.className}`}>
              {member.name}
            </h4>
            {isCurrentUser && (
              <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-400 font-medium">
                You
              </span>
            )}
          </div>
          <p className="text-neutral_01/70 text-sm mb-1">{member.major}</p>
          <p className="text-neutral_01/60 text-xs">{member.institution}</p>
        </div>
      </div>

      {/* Actions */}
      {canManage && !isCurrentUser && (
        <div className="relative">
          <button className="p-2 text-neutral_01/60 hover:text-neutral_01 hover:bg-neutral_01/10 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>

    {/* Contact Info */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Mail className="w-4 h-4 text-neutral_01/60" />
        <span className="text-neutral_01/80">{member.email}</span>
      </div>
      {member.phone && (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-neutral_01/60" />
          <span className="text-neutral_01/80">{member.phone}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-neutral_01/60" />
        <span className="text-neutral_01/60">
          Bergabung {new Date(member.joinedAt).toLocaleDateString('id-ID')}
        </span>
      </div>
    </div>
  </GlassContainer>
);

// Team Card Component
const TeamCard = ({ team, currentUser }: { team: typeof teams[0]; currentUser: User }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const isComplete = team.memberCount >= team.maxMembers;
  const isLeader = team.role === "leader";
  const currentUserMember = team.members.find(m => m.email === currentUser.email);

  const statusConfig = {
    complete: { 
      color: "text-green-400", 
      bg: "bg-green-500/10", 
      border: "border-green-400/20", 
      text: "Tim Lengkap",
      icon: CheckCircle
    },
    incomplete: { 
      color: "text-yellow-400", 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-400/20", 
      text: "Butuh Anggota",
      icon: AlertCircle
    }
  } as const;

  const status = statusConfig[team.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    setIsInviting(true);
    // Simulate invite process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically call your API to send the invite
    console.log(`Inviting ${inviteEmail} to team ${team.name}`);
    
    setIsInviting(false);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team.inviteCode);
    // You could show a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <GlassContainer className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral_02/20 to-brand_01/20 rounded-xl flex items-center justify-center border-2 border-neutral_02">
              <Users className="w-8 h-8 text-neutral_01" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold text-neutral_01 mb-1 ${dm_serif_display.className}`}>
                {team.name}
              </h2>
              <p className="text-neutral_01/70 mb-2">{team.competition}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral_01/60" />
                  <span className="text-sm text-neutral_01/80">
                    {team.memberCount}/{team.maxMembers} anggota
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${status.bg} ${status.border}`}>
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isLeader && (
            <div className="flex gap-2">
              {!isComplete && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Undang
                </button>
              )}
              <button className="p-2 text-neutral_01/60 hover:text-neutral_01 hover:bg-neutral_01/10 rounded-xl transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Team Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral_01/60" />
            <div>
              <p className="text-xs text-neutral_01/60">Dibuat</p>
              <p className="text-sm font-medium text-neutral_01">
                {new Date(team.created).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-neutral_01/60" />
            <div>
              <p className="text-xs text-neutral_01/60">Kode Undangan</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-bold text-neutral_01">{team.inviteCode}</p>
                <button
                  onClick={copyInviteCode}
                  className="text-neutral_01/60 hover:text-neutral_01 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-neutral_01/60" />
            <div>
              <p className="text-xs text-neutral_01/60">Peran Anda</p>
              <p className="text-sm font-medium text-neutral_01 capitalize">{team.role}</p>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Team Members */}
      <div>
        <h3 className={`text-xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
          Anggota Tim
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              isCurrentUser={member.email === currentUser.email}
              canManage={isLeader}
            />
          ))}
          
          {/* Add Member Slot */}
          {!isComplete && isLeader && (
            <GlassContainer className="p-6 border-2 border-dashed border-neutral_01/20">
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-neutral_01/60 hover:text-neutral_01 hover:bg-neutral_01/5 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-neutral_01/10 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Undang Anggota</p>
                  <p className="text-sm">Tambahkan anggota baru ke tim</p>
                </div>
              </button>
            </GlassContainer>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassContainer className="w-full max-w-md p-6">
            <h3 className={`text-xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
              Undang Anggota Baru
            </h3>
            <p className="text-neutral_01/70 text-sm mb-6">
              Masukkan email calon anggota tim atau bagikan kode undangan.
            </p>

            {/* Email Input */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral_01/80 mb-2">
                  Email Undangan
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral_01/40" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="masukkan@email.com"
                    className="w-full bg-neutral_01/10 border border-neutral_01/20 rounded-xl pl-12 pr-4 py-3 text-neutral_01 placeholder:text-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 focus:border-neutral_02 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Invite Code */}
              <div>
                <label className="block text-sm font-medium text-neutral_01/80 mb-2">
                  Atau Bagikan Kode Undangan
                </label>
                <div className="flex items-center gap-2 p-3 bg-neutral_01/5 border border-neutral_01/20 rounded-xl">
                  <Share2 className="w-4 h-4 text-neutral_01/60" />
                  <span className="font-mono font-bold text-neutral_01 flex-1">{team.inviteCode}</span>
                  <button
                    onClick={copyInviteCode}
                    className="text-sm text-neutral_02 hover:text-neutral_01 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-3 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 rounded-xl hover:bg-neutral_01/20 transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || isInviting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? (
                  <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isInviting ? 'Mengirim...' : 'Kirim Undangan'}
              </button>
            </div>
          </GlassContainer>
        </div>
      )}
    </div>
  );
};

export default function TimPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          router.replace("/login");
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral_01/30 border-t-neutral_01 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral_01/60">Memuat tim...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`space-y-8 ${montserrat.className}`}>
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className={`text-3xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
          Tim Anda
        </h1>
        <p className="text-lg text-neutral_01/80 max-w-3xl">
          Kelola anggota tim dan koordinasi untuk berbagai kompetisi. 
          Undang anggota baru dan pantau progres tim Anda.
        </p>
      </div>

      {/* Teams */}
      {teams.length > 0 ? (
        <div className="space-y-12">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} currentUser={user} />
          ))}
        </div>
      ) : (
        /* No Teams */
        <div className="text-center py-12">
          <GlassContainer className="p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-neutral_01/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-neutral_01/40" />
            </div>
            <h3 className={`text-xl font-bold text-neutral_01 mb-2 ${dm_serif_display.className}`}>
              Belum Ada Tim
            </h3>
            <p className="text-neutral_01/60 mb-6">
              Anda belum bergabung dengan tim manapun. Daftar kompetisi untuk membuat atau bergabung dengan tim.
            </p>
            <button
              onClick={() => router.push('/dashboard/kompetisi')}
              className="px-6 py-3 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-[0_0_20px_rgba(242,233,197,0.4)]"
            >
              Lihat Kompetisi
            </button>
          </GlassContainer>
        </div>
      )}
    </div>
  );
} 