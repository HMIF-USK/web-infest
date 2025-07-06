"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// Loading component yang sederhana
const AuthLoading = ({ loadingText = "Loading..." }: { loadingText?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral_02 to-neutral_01 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-brand_01 to-brand_02"></div>
      </div>
      <p className="text-neutral_01 font-medium text-lg">{loadingText}</p>
    </div>
  </div>
);

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login',
  fallback 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User tidak login tapi halaman memerlukan auth
        console.log('Redirecting to login - auth required');
        router.replace(redirectTo);
        return;
      }
      
      if (!requireAuth && user) {
        // User sudah login tapi mengakses halaman guest (login/register)
        console.log('Redirecting to dashboard - already logged in');
        router.replace('/dashboard');
        return;
      }
      
      setIsChecking(false);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Show loading while checking auth or redirecting
  if (loading || isChecking) {
    return fallback || (
      <AuthLoading 
        loadingText={requireAuth ? "Mengecek status login..." : "Loading..."} 
      />
    );
  }

  // Render children if auth requirements are met
  return <>{children}</>;
}

// Hook untuk protected pages
export function useAuthGuard(requireAuth: boolean = true) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.replace('/auth/login');
      } else if (!requireAuth && user) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, requireAuth, router]);

  return { user, loading, isAuthenticated: !!user };
}
