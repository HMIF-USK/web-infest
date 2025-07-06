const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxesqdjdiuuzhmgadewe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZXNxZGpkaXV1emhtZ2FkZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjY3OTksImV4cCI6MjA2NTc0Mjc5OX0.-Za_NJsUNfIs2DO7oBIKVLw8YAxy7Hc8R91rtBNkqxc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugTeamsAfterFix() {
  console.log('Testing team functionality after RLS fix...');
  
  // Test 1: Check if the join function works now
  console.log('\n1. Testing join_team_by_code function...');
  try {
    const testUuid = '550e8400-e29b-41d4-a716-446655440000';
    const { data, error } = await supabase
      .rpc('join_team_by_code', { 
        team_code_input: 'TESTCODE',
        user_uuid: testUuid
      });
    
    if (error) {
      console.error('join_team_by_code error:', error);
    } else {
      console.log('join_team_by_code result:', data);
    }
  } catch (err) {
    console.error('join_team_by_code exception:', err);
  }
  
  // Test 2: Check create_team function
  console.log('\n2. Testing create_team function...');
  try {
    const testUuid = '550e8400-e29b-41d4-a716-446655440001';
    const { data, error } = await supabase
      .rpc('create_team', { 
        team_name: 'Test Team',
        team_code: 'TESTCODE',
        creator_id: testUuid
      });
    
    if (error) {
      console.error('create_team error:', error);
    } else {
      console.log('create_team result:', data);
    }
  } catch (err) {
    console.error('create_team exception:', err);
  }
  
  // Test 3: Test get_user_current_team
  console.log('\n3. Testing get_user_current_team...');
  try {
    const testUuid = '550e8400-e29b-41d4-a716-446655440000';
    const { data, error } = await supabase
      .rpc('get_user_current_team', { user_uuid: testUuid });
    
    if (error) {
      console.error('get_user_current_team error:', error);
    } else {
      console.log('get_user_current_team result:', data);
    }
  } catch (err) {
    console.error('get_user_current_team exception:', err);
  }
}

debugTeamsAfterFix().catch(console.error);
