const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxesqdjdiuuzhmgadewe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZXNxZGpkaXV1emhtZ2FkZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjY3OTksImV4cCI6MjA2NTc0Mjc5OX0.-Za_NJsUNfIs2DO7oBIKVLw8YAxy7Hc8R91rtBNkqxc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOAuthFlow() {
  console.log('Testing OAuth flow components...');
  
  // Test 1: Check if user_profiles table is accessible for OAuth users
  console.log('\n1. Testing user_profiles table access...');
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('user_profiles table error:', error);
    } else {
      console.log('user_profiles table accessible, sample data:', data?.length || 0, 'rows');
    }
  } catch (err) {
    console.error('user_profiles table exception:', err);
  }
  
  // Test 2: Test mock OAuth user profile creation
  console.log('\n2. Testing mock OAuth user profile creation...');
  try {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440099', // Mock UUID
      email: 'test.oauth@gmail.com',
      full_name: 'Test OAuth User',
      profile_image_url: 'https://lh3.googleusercontent.com/mock-avatar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Try to insert mock profile (should fail due to foreign key constraint, but we can see the error)
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(mockUser)
      .select()
      .single();
    
    if (error) {
      // Expected to fail due to foreign key constraint with auth.users
      if (error.code === '23503') {
        console.log('✓ Profile creation test working (foreign key constraint as expected)');
      } else {
        console.error('Unexpected profile creation error:', error);
      }
    } else {
      console.log('⚠️ Unexpected success - profile created:', data);
      // Clean up if somehow successful
      await supabase.from('user_profiles').delete().eq('id', mockUser.id);
    }
  } catch (err) {
    console.error('Profile creation test exception:', err);
  }
  
  // Test 3: Check current authentication state
  console.log('\n3. Testing current auth state...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('No authenticated user (expected):', error.message);
    } else {
      console.log('Current user:', user ? `${user.email} (${user.id})` : 'No user');
    }
  } catch (err) {
    console.error('Auth state exception:', err);
  }
  
  console.log('\n✓ OAuth flow test completed');
}

testOAuthFlow().catch(console.error);
