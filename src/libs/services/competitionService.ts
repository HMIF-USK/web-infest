import { supabase } from "./supabaseClient";
import { cloudinaryService } from "./cloudinaryService";

// Interface untuk kompetisi
export interface Competition {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  
  // Competition Details
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
  created_at: string;
  updated_at: string;
}

// Interface untuk registrasi kompetisi (updated schema)
export interface CompetitionRegistration {
  id: string;
  competition_id: string;
  team_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  registration_date: string;
  approved_at?: string;
  approved_by?: string;
  payment_proof_url?: string;
  payment_verified_at?: string;
  payment_verified_by?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  competition?: Competition;
  team?: {
    id: string;
    name: string;
    code: string;
    members?: Array<{
      id: string;
      full_name: string;
      email: string;
      whatsapp?: string;
      university?: string;
      faculty?: string;
      major?: string;
      student_id?: string;
      is_team_leader: boolean;
    }>;
  };
}

// Interface untuk data registrasi baru (team-based)
export interface TeamRegistrationData {
  competition_id: string;
  team_id: string;
  notes?: string;
}

// Interface untuk upload bukti pembayaran
export interface PaymentProofData {
  registration_id?: string;
  file: File;
  payment_method: 'bank_transfer' | 'e_wallet' | 'cash';
  payment_date: string;
  account_name: string;
  notes?: string;
}

// Interface untuk detail registrasi lengkap
export interface RegistrationDetail {
  registration: CompetitionRegistration;
  team_leader: {
    full_name: string;
    email: string;
    whatsapp: string;
    university: string;
    faculty: string;
    major: string;
  };
  team_members: Array<{
    full_name: string;
    email: string;
    university: string;
    faculty: string;
    major: string;
    student_id: string;
  }>;
}

export const competitionService = {
  /**
   * Get all active competitions
   */
  async getActiveCompetitions(): Promise<{ competitions: Competition[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('status', 'open')
        .order('registration_start', { ascending: true });

      if (error) {
        console.error('Error fetching competitions:', error);
        return { competitions: null, error: error.message };
      }

      return { competitions: data as Competition[], error: null };
    } catch (error: any) {
      console.error('Error fetching competitions:', error);
      return { competitions: null, error: error.message };
    }
  },

  /**
   * Get competition by ID
   */
  async getCompetitionById(id: string): Promise<{ competition: Competition | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching competition:', error);
        return { competition: null, error: error.message };
      }

      return { competition: data as Competition, error: null };
    } catch (error: any) {
      console.error('Error fetching competition:', error);
      return { competition: null, error: error.message };
    }
  },

  /**
   * Get team's competition registration (single registration)
   */
  async getTeamRegistration(teamId: string): Promise<{ registration: CompetitionRegistration | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select(`
          *,
          competition:competitions(*),
          team:teams(
            id,
            name,
            code,
            members:user_profiles!fk_user_team(id, full_name, email, is_team_leader)
          )
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return { registration: null, error: null };
        }
        console.error('Error fetching team registration:', error);
        return { registration: null, error: error.message };
      }

      return { registration: data as CompetitionRegistration, error: null };
    } catch (error: any) {
      console.error('Error fetching team registration:', error);
      return { registration: null, error: error.message };
    }
  },

  /**
   * Get user's competition registrations (through team)
   */
  async getUserRegistrations(userId: string): Promise<{ registrations: CompetitionRegistration | null; error: string | null }> {
    try {
      // First get user's team
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('team_id')
        .eq('id', userId)
        .single();

      if (profileError || !userProfile.team_id) {
        return { registrations: null, error: null };
      }

      // Then get team's registration
      const result = await this.getTeamRegistration(userProfile.team_id);
      return { registrations: result.registration, error: result.error };
    } catch (error: any) {
      console.error('Error fetching user registrations:', error);
      return { registrations: null, error: error.message };
    }
  },

  /**
   * Register team for a competition
   */
  async registerTeamForCompetition(teamId: string, registrationData: TeamRegistrationData): Promise<{ registration: CompetitionRegistration | null; error: string | null }> {
    try {
      // Check if team already registered for any competition
      const { data: existingRegistrations, error: existingError } = await supabase
        .from('competition_registrations')
        .select('id, competition:competitions(name)')
        .eq('team_id', teamId)
        .neq('status', 'rejected');

      if (existingError) {
        return { registration: null, error: 'Gagal memeriksa registrasi tim yang ada' };
      }

      if (existingRegistrations && existingRegistrations.length > 0) {
        const competitionName = (existingRegistrations[0].competition as any)?.name || 'kompetisi lain';
        return { registration: null, error: `Tim sudah terdaftar untuk ${competitionName}. Setiap tim hanya bisa mendaftar satu kompetisi.` };
      }

      // Check if competition is still open for registration
      const { data: competition, error: compError } = await supabase
        .from('competitions')
        .select('registration_end, status, name')
        .eq('id', registrationData.competition_id)
        .single();

      if (compError) {
        return { registration: null, error: 'Kompetisi tidak ditemukan' };
      }

      if (competition.status !== 'open') {
        return { registration: null, error: 'Kompetisi tidak tersedia untuk pendaftaran' };
      }

      const registrationEnd = new Date(competition.registration_end);
      const now = new Date();

      if (now > registrationEnd) {
        return { registration: null, error: 'Pendaftaran kompetisi sudah ditutup' };
      }

      // Create registration
      const { data, error } = await supabase
        .from('competition_registrations')
        .insert({
          team_id: teamId,
          competition_id: registrationData.competition_id,
          status: 'pending',
          registration_date: new Date().toISOString(),
          notes: registrationData.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          competition:competitions(*),
          team:teams(
            id,
            name,
            code,
            members:user_profiles!fk_user_team(id, full_name, email, is_team_leader)
          )
        `)
        .single();

      if (error) {
        console.error('Error creating registration:', error);
        return { registration: null, error: error.message };
      }

      return { registration: data as CompetitionRegistration, error: null };
    } catch (error: any) {
      console.error('Error registering team for competition:', error);
      return { registration: null, error: error.message };
    }
  },

  /**
   * Cancel team registration
   */
  async cancelTeamRegistration(registrationId: string, teamId: string): Promise<{ error: string | null }> {
    try {
      // Check if registration belongs to team
      const { data: registration, error: fetchError } = await supabase
        .from('competition_registrations')
        .select('status')
        .eq('id', registrationId)
        .eq('team_id', teamId)
        .single();

      if (fetchError) {
        return { error: 'Registrasi tidak ditemukan' };
      }

      if (registration.status === 'approved') {
        return { error: 'Registrasi yang sudah disetujui tidak dapat dibatalkan' };
      }

      // Update status to cancelled
      const { error } = await supabase
        .from('competition_registrations')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)
        .eq('team_id', teamId);

      if (error) {
        console.error('Error cancelling registration:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      return { error: error.message };
    }
  },

  /**
   * Check if team has any active registrations
   */
  async hasActiveRegistration(teamId: string): Promise<{ hasRegistration: boolean; registration?: CompetitionRegistration; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select(`
          *,
          competition:competitions(name, status)
        `)
        .eq('team_id', teamId)
        .neq('status', 'cancelled')
        .limit(1);

      if (error) {
        console.error('Error checking team registration:', error);
        return { hasRegistration: false, error: error.message };
      }

      const hasRegistration = data && data.length > 0;
      return { 
        hasRegistration, 
        registration: hasRegistration ? data[0] as CompetitionRegistration : undefined,
        error: null 
      };
    } catch (error: any) {
      console.error('Error checking team registration:', error);
      return { hasRegistration: false, error: error.message };
    }
  },

  /**
   * Get detailed registration information
   */
  async getRegistrationDetail(registrationId: string, teamId: string): Promise<{ registration: RegistrationDetail | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select(`
          *,
          competition:competitions(*),
          team:teams(
            id,
            name,
            code,
            created_by,
            members:user_profiles(
              id,
              full_name,
              email,
              whatsapp,
              university,
              faculty,
              major,
              student_id,
              is_team_leader
            )
          )
        `)
        .eq('id', registrationId)
        .eq('team_id', teamId)
        .single();

      if (error) {
        console.error('Error fetching registration detail:', error);
        return { registration: null, error: error.message };
      }

      // Transform data ke format yang dibutuhkan
      const registration = data as CompetitionRegistration;
      const teamMembers = registration.team?.members || [];
      const teamLeader = teamMembers.find(member => member.is_team_leader);

      if (!teamLeader) {
        return { registration: null, error: 'Team leader tidak ditemukan' };
      }

      const registrationDetail: RegistrationDetail = {
        registration,
        team_leader: {
          full_name: teamLeader.full_name,
          email: teamLeader.email,
          whatsapp: teamLeader.whatsapp || '',
          university: teamLeader.university || '',
          faculty: teamLeader.faculty || '',
          major: teamLeader.major || ''
        },
        team_members: teamMembers.map(member => ({
          full_name: member.full_name,
          email: member.email,
          university: member.university || '',
          faculty: member.faculty || '',
          major: member.major || '',
          student_id: member.student_id || ''
        }))
      };

      return { registration: registrationDetail, error: null };
    } catch (error: any) {
      console.error('Error fetching registration detail:', error);
      return { registration: null, error: error.message };
    }
  },

  /**
   * Submit payment proof (with Cloudinary upload)
   */
  async submitPaymentProof(paymentData: PaymentProofData): Promise<{ success: boolean; error: string | null; url?: string }> {
    try {
      // Validate file
      const validation = cloudinaryService.validateFile(paymentData.file);
      if (!validation.isValid) {
        return { success: false, error: validation.error || 'File tidak valid' };
      }

      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadFile(
        paymentData.file, 
        `payment-proofs/${paymentData.registration_id}`
      );

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error || 'Gagal upload gambar' };
      }

      // Update registration dengan informasi pembayaran
      const { error } = await supabase
        .from('competition_registrations')
        .update({
          payment_proof_url: uploadResult.data?.secure_url,
          notes: `${paymentData.notes || ''}\n\nPayment Method: ${paymentData.payment_method}\nPayment Date: ${paymentData.payment_date}\nAccount Name: ${paymentData.account_name}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.registration_id);

      if (error) {
        console.error('Error updating payment proof:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null, url: uploadResult.data?.secure_url };
    } catch (error: any) {
      console.error('Error submitting payment proof:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get competition statistics
   */
  async getCompetitionStats(competitionId: string): Promise<{ stats: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select('status, payment_proof_url, payment_verified_at')
        .eq('competition_id', competitionId);

      if (error) {
        console.error('Error fetching competition stats:', error);
        return { stats: null, error: error.message };
      }

      const stats = {
        total_registrations: data.length,
        pending_registrations: data.filter(r => r.status === 'pending').length,
        approved_registrations: data.filter(r => r.status === 'approved').length,
        rejected_registrations: data.filter(r => r.status === 'rejected').length,
        cancelled_registrations: data.filter(r => r.status === 'cancelled').length,
        paid_registrations: data.filter(r => r.payment_verified_at !== null).length,
        unpaid_registrations: data.filter(r => r.payment_verified_at === null && r.status !== 'cancelled').length
      };

      return { stats, error: null };
    } catch (error: any) {
      console.error('Error getting competition stats:', error);
      return { stats: null, error: error.message };
    }
  },

  /**
   * Register team for competition with payment proof upload
   */
  async registerTeamWithPayment(
    teamId: string, 
    registrationData: TeamRegistrationData, 
    paymentData: Omit<PaymentProofData, 'registration_id'>
  ): Promise<{ registration: CompetitionRegistration | null; error: string | null }> {
    try {
      // Validate file
      const validation = cloudinaryService.validateFile(paymentData.file);
      if (!validation.isValid) {
        return { registration: null, error: validation.error || 'File tidak valid' };
      }

      // First, register team for competition
      const registrationResult = await this.registerTeamForCompetition(teamId, registrationData);
      
      if (registrationResult.error) {
        return { registration: null, error: registrationResult.error };
      }

      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadFile(
        paymentData.file, 
        `payment-proofs/${registrationResult.registration?.id}`
      );

      if (!uploadResult.success) {
        // Delete the registration if upload fails
        await supabase
          .from('competition_registrations')
          .delete()
          .eq('id', registrationResult.registration?.id);
        
        return { registration: null, error: uploadResult.error || 'Gagal upload gambar' };
      }

      // Update registration with payment proof
      const { data: updatedRegistration, error: updateError } = await supabase
        .from('competition_registrations')
        .update({
          payment_proof_url: uploadResult.data?.secure_url,
          notes: `${paymentData.notes || ''}\n\nPayment Method: ${paymentData.payment_method}\nPayment Date: ${paymentData.payment_date}\nAccount Name: ${paymentData.account_name}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationResult.registration?.id)
        .select(`
          *,
          competition:competitions(*),
          team:teams(
            id,
            name,
            code,
            members:user_profiles!fk_user_team(id, full_name, email, is_team_leader)
          )
        `)
        .single();

      if (updateError) {
        console.error('Error updating registration with payment proof:', updateError);
        return { registration: null, error: updateError.message };
      }

      return { registration: updatedRegistration, error: null };
    } catch (error: any) {
      console.error('Error registering team with payment:', error);
      return { registration: null, error: error.message };
    }
  },
};
