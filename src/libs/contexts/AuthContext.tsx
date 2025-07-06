"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/libs/services/supabaseClient';
import { authService, UserProfile } from '@/libs/services/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          
          // Get user profile
          const result = await authService.getCurrentUser();
          if (result.profile) {
            setProfile(result.profile);
          }
          
          console.log('[AUTH] Session restored:', {
            userId: session.user.id,
            email: session.user.email,
            hasProfile: !!result.profile,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user profile for new sessions
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const result = await authService.getCurrentUser();
            if (result.profile) {
              setProfile(result.profile);
            }
          }
          
          console.log('[AUTH] Auth state changed:', {
            event,
            userId: session.user.id,
            email: session.user.email,
            timestamp: new Date().toISOString()
          });
        } else {
          setUser(null);
          setProfile(null);
          
          if (event === 'SIGNED_OUT') {
            console.log('[AUTH] Session ended:', {
              event,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('[AUTH] Logout initiated:', {
        userId: user?.id,
        email: user?.email,
        timestamp: new Date().toISOString()
      });
      
      const { error } = await authService.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw new Error(error);
      }
      
      // Clear local state
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const result = await authService.getCurrentUser();
      if (result.profile) {
        setProfile(result.profile);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
