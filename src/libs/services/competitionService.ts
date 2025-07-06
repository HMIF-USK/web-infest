import { supabase } from "./supabaseClient";

// Interface untuk kompetisi
export interface Competition {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  
  // Competition Details
  max_team_members: number;
  min_team_members: number;
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
  created_at: string;
  updated_at: string;
}

// Interface untuk registrasi kompetisi
export interface CompetitionRegistration {
  id: string;
  competition_id: string;
  user_id: string;
  team_name: string;
  team_leader_name: string;
  team_leader_email: string;
  team_leader_phone: string;
  university: string;
  faculty: string;
  major: string;
  team_members: string; // JSON string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_proof_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  competition?: Competition;
}

// Interface untuk data registrasi baru
export interface RegistrationData {
  competition_id: string;
  team_name: string;
  team_leader_name: string;
  team_leader_email: string;
  team_leader_phone: string;
  university: string;
  faculty: string;
  major: string;
  team_members: Array<{
    name: string;
    role: 'leader' | 'member';
    student_id: string;
    email?: string;
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
   * Get user's competition registrations
   */
  async getUserRegistrations(userId: string): Promise<{ registrations: CompetitionRegistration[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select(`
          *,
          competition:competitions(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user registrations:', error);
        return { registrations: null, error: error.message };
      }

      return { registrations: data as CompetitionRegistration[], error: null };
    } catch (error: any) {
      console.error('Error fetching user registrations:', error);
      return { registrations: null, error: error.message };
    }
  },

  /**
   * Register for a competition
   */
  async registerCompetition(userId: string, registrationData: RegistrationData): Promise<{ registration: CompetitionRegistration | null; error: string | null }> {
    try {
      // Check if user already registered for this competition
      const { data: existingRegistration } = await supabase
        .from('competition_registrations')
        .select('id')
        .eq('user_id', userId)
        .eq('competition_id', registrationData.competition_id)
        .single();

      if (existingRegistration) {
        return { registration: null, error: 'Anda sudah terdaftar untuk kompetisi ini' };
      }

      // Check if competition is still open for registration
      const { data: competition, error: compError } = await supabase
        .from('competitions')
        .select('registration_end, status')
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
          user_id: userId,
          competition_id: registrationData.competition_id,
          team_name: registrationData.team_name,
          team_leader_name: registrationData.team_leader_name,
          team_leader_email: registrationData.team_leader_email,
          team_leader_phone: registrationData.team_leader_phone,
          university: registrationData.university,
          faculty: registrationData.faculty,
          major: registrationData.major,
          team_members: JSON.stringify(registrationData.team_members),
          status: 'pending',
          payment_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating registration:', error);
        return { registration: null, error: error.message };
      }

      return { registration: data as CompetitionRegistration, error: null };
    } catch (error: any) {
      console.error('Error registering for competition:', error);
      return { registration: null, error: error.message };
    }
  },

  /**
   * Cancel registration
   */
  async cancelRegistration(registrationId: string, userId: string): Promise<{ error: string | null }> {
    try {
      // Check if registration belongs to user
      const { data: registration, error: fetchError } = await supabase
        .from('competition_registrations')
        .select('status, payment_status')
        .eq('id', registrationId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        return { error: 'Registrasi tidak ditemukan' };
      }

      if (registration.status === 'confirmed') {
        return { error: 'Registrasi yang sudah dikonfirmasi tidak dapat dibatalkan' };
      }

      // Update status to cancelled
      const { error } = await supabase
        .from('competition_registrations')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)
        .eq('user_id', userId);

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
   * Upload payment proof
   */
  async uploadPaymentProof(registrationId: string, userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `payment-proofs/${userId}/${registrationId}-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('competition-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { url: null, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('competition-files')
        .getPublicUrl(uploadData.path);

      // Update registration with payment proof URL
      const { error: updateError } = await supabase
        .from('competition_registrations')
        .update({
          payment_proof_url: urlData.publicUrl,
          payment_status: 'pending', // Admin will verify and change to 'paid'
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating registration:', updateError);
        return { url: null, error: updateError.message };
      }

      return { url: urlData.publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading payment proof:', error);
      return { url: null, error: error.message };
    }
  },

  /**
   * Get competition statistics
   */
  async getCompetitionStats(competitionId: string): Promise<{ stats: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('competition_registrations')
        .select('status, payment_status')
        .eq('competition_id', competitionId);

      if (error) {
        console.error('Error fetching competition stats:', error);
        return { stats: null, error: error.message };
      }

      const stats = {
        total_registrations: data.length,
        pending_registrations: data.filter(r => r.status === 'pending').length,
        confirmed_registrations: data.filter(r => r.status === 'confirmed').length,
        paid_registrations: data.filter(r => r.payment_status === 'paid').length,
        cancelled_registrations: data.filter(r => r.status === 'cancelled').length
      };

      return { stats, error: null };
    } catch (error: any) {
      console.error('Error getting competition stats:', error);
      return { stats: null, error: error.message };
    }
  }
};
