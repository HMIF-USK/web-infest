import { supabase } from './supabaseClient';

// Type definitions for team-related data
export interface Team {
  id: string;
  name: string;
  code: string;
  description?: string;
  max_members: number;
  is_public: boolean;
  status: 'active' | 'inactive' | 'disbanded';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  university?: string;
  major?: string;
  team_id?: string;
  is_team_leader: boolean;
  created_at: string;
}

export interface TeamWithMembers extends Team {
  current_members: number;
  is_full: boolean;
  created_by_name: string;
  members?: UserProfile[];
}

export interface CreateTeamData {
  name: string;
  description?: string;
  max_members?: number;
  is_public?: boolean;
}

export interface TeamServiceResponse<T = any> {
  data?: T;
  error?: string;
}

class TeamService {
  // Membuat tim baru
  async createTeam(userId: string, teamData: CreateTeamData): Promise<TeamServiceResponse<Team>> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: teamData.name.trim(),
          description: teamData.description?.trim() || null,
          max_members: teamData.max_members || 3,
          is_public: teamData.is_public ?? true,
          created_by: userId,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        return { error: 'Gagal membuat tim. Silakan coba lagi.' };
      }

      // Update user profile untuk set team_id dan is_team_leader
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          team_id: data.id,
          is_team_leader: true
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        // Rollback team creation jika gagal update profile
        await supabase.from('teams').delete().eq('id', data.id);
        return { error: 'Gagal mengatur kepemimpinan tim. Silakan coba lagi.' };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error creating team:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Bergabung dengan tim menggunakan kode
  async joinTeam(userId: string, teamCode: string): Promise<TeamServiceResponse<Team>> {
    try {
      // Cari tim berdasarkan kode
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*, user_profiles!teams_created_by_fkey(full_name)')
        .eq('code', teamCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (teamError || !team) {
        return { error: 'Kode tim tidak ditemukan atau tim tidak aktif.' };
      }

      // Cek apakah user sudah memiliki tim
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('team_id')
        .eq('id', userId)
        .single();

      if (profileError) {
        return { error: 'Gagal memverifikasi status keanggotaan.' };
      }

      if (userProfile.team_id) {
        return { error: 'Anda sudah bergabung dengan tim lain. Keluar dari tim sebelumnya terlebih dahulu.' };
      }

      // Cek apakah tim sudah penuh
      const { data: memberCount, error: countError } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' })
        .eq('team_id', team.id);

      if (countError) {
        return { error: 'Gagal memverifikasi kapasitas tim.' };
      }

      const currentMembers = memberCount?.length || 0;
      if (currentMembers >= team.max_members) {
        return { error: 'Tim sudah penuh. Tidak dapat bergabung.' };
      }

      // Bergabung dengan tim
      const { error: joinError } = await supabase
        .from('user_profiles')
        .update({
          team_id: team.id,
          is_team_leader: false
        })
        .eq('id', userId);

      if (joinError) {
        console.error('Error joining team:', joinError);
        return { error: 'Gagal bergabung dengan tim. Silakan coba lagi.' };
      }

      return { data: team };
    } catch (error) {
      console.error('Unexpected error joining team:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Keluar dari tim
  async leaveTeam(userId: string): Promise<TeamServiceResponse<boolean>> {
    try {
      // Ambil data user untuk cek apakah dia leader
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('team_id, is_team_leader')
        .eq('id', userId)
        .single();

      if (profileError || !userProfile.team_id) {
        return { error: 'Anda tidak tergabung dalam tim manapun.' };
      }

      const teamId = userProfile.team_id;
      const isLeader = userProfile.is_team_leader;

      // Jika user adalah leader, cek apakah masih ada anggota lain
      if (isLeader) {
        const { data: members, error: membersError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('team_id', teamId)
          .neq('id', userId);

        if (membersError) {
          return { error: 'Gagal memverifikasi anggota tim.' };
        }

        if (members && members.length > 0) {
          // Transfer kepemimpinan ke anggota pertama
          const { error: transferError } = await supabase
            .from('user_profiles')
            .update({ is_team_leader: true })
            .eq('id', members[0].id);

          if (transferError) {
            return { error: 'Gagal mentransfer kepemimpinan tim.' };
          }
        } else {
          // Jika tidak ada anggota lain, hapus tim
          const { error: deleteError } = await supabase
            .from('teams')
            .update({ status: 'disbanded' })
            .eq('id', teamId);

          if (deleteError) {
            console.error('Error disbanding team:', deleteError);
          }
        }
      }

      // Keluar dari tim
      const { error: leaveError } = await supabase
        .from('user_profiles')
        .update({
          team_id: null,
          is_team_leader: false
        })
        .eq('id', userId);

      if (leaveError) {
        console.error('Error leaving team:', leaveError);
        return { error: 'Gagal keluar dari tim. Silakan coba lagi.' };
      }

      return { data: true };
    } catch (error) {
      console.error('Unexpected error leaving team:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Mendapatkan detail tim user
  async getUserTeam(userId: string): Promise<TeamServiceResponse<TeamWithMembers | null>> {
    try {
      // Ambil team_id dari user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('team_id, is_team_leader')
        .eq('id', userId)
        .single();

      if (profileError) {
        return { error: 'Gagal memuat data profil.' };
      }

      if (!userProfile.team_id) {
        return { data: null };
      }

      // Ambil detail tim dengan view
      const { data: team, error: teamError } = await supabase
        .from('teams_with_member_count')
        .select('*')
        .eq('id', userProfile.team_id)
        .eq('status', 'active')
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        return { error: 'Gagal memuat data tim.' };
      }

      // Ambil daftar anggota tim
      const { data: members, error: membersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, university, major, is_team_leader, created_at')
        .eq('team_id', userProfile.team_id)
        .order('is_team_leader', { ascending: false })
        .order('created_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        return { error: 'Gagal memuat anggota tim.' };
      }

      return { 
        data: {
          ...team,
          members: members || []
        }
      };
    } catch (error) {
      console.error('Unexpected error fetching user team:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Update informasi tim (hanya untuk leader)
  async updateTeam(userId: string, teamId: string, updateData: Partial<CreateTeamData>): Promise<TeamServiceResponse<Team>> {
    try {
      // Verifikasi bahwa user adalah leader tim
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('team_id, is_team_leader')
        .eq('id', userId)
        .single();

      if (profileError || userProfile.team_id !== teamId || !userProfile.is_team_leader) {
        return { error: 'Anda tidak memiliki izin untuk mengubah tim ini.' };
      }

      // Update tim
      const { data, error } = await supabase
        .from('teams')
        .update({
          name: updateData.name?.trim(),
          description: updateData.description?.trim() || null,
          max_members: updateData.max_members,
          is_public: updateData.is_public
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) {
        console.error('Error updating team:', error);
        return { error: 'Gagal mengubah informasi tim. Silakan coba lagi.' };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error updating team:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Kick anggota tim (hanya untuk leader)
  async kickMember(leaderId: string, memberId: string): Promise<TeamServiceResponse<boolean>> {
    try {
      // Verifikasi bahwa user adalah leader
      const { data: leaderProfile, error: leaderError } = await supabase
        .from('user_profiles')
        .select('team_id, is_team_leader')
        .eq('id', leaderId)
        .single();

      if (leaderError || !leaderProfile.is_team_leader) {
        return { error: 'Anda tidak memiliki izin untuk mengeluarkan anggota.' };
      }

      // Verifikasi bahwa member ada di tim yang sama
      const { data: memberProfile, error: memberError } = await supabase
        .from('user_profiles')
        .select('team_id, is_team_leader')
        .eq('id', memberId)
        .single();

      if (memberError || memberProfile.team_id !== leaderProfile.team_id) {
        return { error: 'Anggota tidak ditemukan dalam tim Anda.' };
      }

      if (memberProfile.is_team_leader) {
        return { error: 'Tidak dapat mengeluarkan leader tim.' };
      }

      // Keluarkan anggota dari tim
      const { error: kickError } = await supabase
        .from('user_profiles')
        .update({
          team_id: null,
          is_team_leader: false
        })
        .eq('id', memberId);

      if (kickError) {
        console.error('Error kicking member:', kickError);
        return { error: 'Gagal mengeluarkan anggota. Silakan coba lagi.' };
      }

      return { data: true };
    } catch (error) {
      console.error('Unexpected error kicking member:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }

  // Cari tim berdasarkan kode (untuk preview sebelum join)
  async getTeamByCode(teamCode: string): Promise<TeamServiceResponse<TeamWithMembers | null>> {
    try {
      const { data: team, error } = await supabase
        .from('teams_with_member_count')
        .select('*')
        .eq('code', teamCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (error || !team) {
        return { data: null };
      }

      return { data: team };
    } catch (error) {
      console.error('Unexpected error fetching team by code:', error);
      return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
    }
  }
}

export const teamService = new TeamService();
