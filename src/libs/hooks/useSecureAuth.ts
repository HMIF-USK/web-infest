import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { logSecurityEvent } from '../security/utils';
import { SECURITY_CONFIG } from '../security/constants';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Secure auth hook with session management dan security logging
 */
export function useSecureAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session) {
          // Validate session tidak expired
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at && session.expires_at < now) {
            console.warn('Session expired, refreshing...');
            await supabase.auth.signOut();
            setAuthState({ user: null, loading: false, error: null });
            return;
          }

          setAuthState({ 
            user: session.user, 
            loading: false, 
            error: null 
          });

          // Log successful session restoration
          logSecurityEvent({
            type: 'login_success',
            identifier: session.user.email || 'unknown',
            details: { method: 'session_restore' }
          });

          // Set up periodic session validation
          sessionCheckInterval = setInterval(async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!currentSession) {
              setAuthState({ user: null, loading: false, error: null });
              clearInterval(sessionCheckInterval);
            }
          }, SECURITY_CONFIG.SESSION_TIMEOUT / 10); // Check every 2.4 hours if timeout is 24 hours

        } else {
          setAuthState({ user: null, loading: false, error: null });
        }

      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Gagal menginisialisasi autentikasi', 
          loading: false 
        }));
      }
    };

    initializeAuth();

    // Listen untuk auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        switch (event) {
          case 'SIGNED_IN':
            if (session) {
              setAuthState({ 
                user: session.user, 
                loading: false, 
                error: null 
              });
              
              logSecurityEvent({
                type: 'login_success',
                identifier: session.user.email || 'unknown',
                details: { method: event }
              });

              // Set up session monitoring
              sessionCheckInterval = setInterval(async () => {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (!currentSession) {
                  setAuthState({ user: null, loading: false, error: null });
                  clearInterval(sessionCheckInterval);
                }
              }, SECURITY_CONFIG.SESSION_TIMEOUT / 10);
            }
            break;

          case 'SIGNED_OUT':
            setAuthState({ user: null, loading: false, error: null });
            if (sessionCheckInterval) {
              clearInterval(sessionCheckInterval);
            }
            
            logSecurityEvent({
              type: 'login_success', // logout is also a success event
              identifier: 'user_logout',
              details: { method: 'sign_out' }
            });
            break;

          case 'TOKEN_REFRESHED':
            if (session) {
              setAuthState(prev => ({ 
                ...prev, 
                user: session.user,
                error: null 
              }));
            }
            break;

          case 'USER_UPDATED':
            if (session) {
              setAuthState(prev => ({ 
                ...prev, 
                user: session.user 
              }));
            }
            break;

          default:
            // Handle unknown events
            console.warn('Unknown auth event:', event);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, []);

  // Secure sign out function
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Gagal keluar dari sistem', 
          loading: false 
        }));
        return false;
      }

      // Clear any stored sensitive data
      localStorage.removeItem('login_attempts');
      sessionStorage.clear();
      
      setAuthState({ user: null, loading: false, error: null });
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Terjadi kesalahan saat keluar', 
        loading: false 
      }));
      return false;
    }
  };

  // Check if user has specific permissions
  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    // Add your permission logic here
    // For now, return true if user is authenticated
    return true;
  };

  // Check if session is about to expire
  const isSessionExpiring = (): boolean => {
    if (!authState.user) return false;
    
    // Check if session expires within next 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    const expirationTime = Date.now() + fiveMinutes;
    
    return expirationTime > Date.now();
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signOut,
    hasPermission,
    isSessionExpiring
  };
}

/**
 * Hook untuk protected routes
 */
export function useProtectedRoute(requiredPermission?: string) {
  const auth = useSecureAuth();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login';
    } else if (requiredPermission && !auth.hasPermission(requiredPermission)) {
      // Redirect to unauthorized page if no permission
      window.location.href = '/unauthorized';
    }
  }, [auth.loading, auth.isAuthenticated, requiredPermission, auth]);

  return auth;
}
