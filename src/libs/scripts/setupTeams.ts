import { supabase } from '@/libs/services/supabaseClient';

// Check if the required tables exist and create them if they don't
export const setupTeamTables = async () => {
  try {
    console.log('Checking team tables...');
    
    // Test if teams table exists
    const { data: teamsTest, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .limit(1);

    if (teamsError) {
      console.log('Teams table does not exist or is not accessible:', teamsError);
      return {
        success: false,
        message: 'Teams feature requires database setup. Please contact support.',
        error: teamsError
      };
    }

    // Test if team_members table exists
    const { data: membersTest, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .limit(1);

    if (membersError) {
      console.log('Team members table does not exist or is not accessible:', membersError);
      return {
        success: false,
        message: 'Teams feature requires database setup. Please contact support.',
        error: membersError
      };
    }

    console.log('Team tables are accessible');
    return {
      success: true,
      message: 'Team tables are ready'
    };

  } catch (error) {
    console.error('Error checking team tables:', error);
    return {
      success: false,
      message: 'Failed to check team tables',
      error
    };
  }
};

// Simple function to create teams and team_members tables with minimal schema
export const createBasicTeamTables = async () => {
  try {
    console.log('This function would create tables, but we should use Supabase SQL editor instead');
    return {
      success: false,
      message: 'Please use Supabase SQL editor to create tables with the provided schema'
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    return {
      success: false,
      message: 'Failed to create tables',
      error
    };
  }
};
