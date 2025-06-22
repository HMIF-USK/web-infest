"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// Loading component
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-yellow via-secondary to-primary p-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow mx-auto mb-4"></div>
          <p className="text-secondary font-medium">Mengecek status login...</p>
        </div>
      </div>
    </div>
  );
}

// Session wrapper component
function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking session:", error);
        }

        if (session) {
          // User already logged in, redirect to dashboard
          router.replace("/dashboard");
          return;
        }

        setUser(null);
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace("/dashboard");
        } else {
          setUser(session?.user || null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <LoginLoading />;
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}

// Main login page component
function LoginPageContent() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error("Login error:", error);
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-yellow via-secondary to-primary p-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-secondary">Login to Dashboard</h1>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="flex items-center gap-3 px-6 py-3 bg-primary-yellow text-secondary font-semibold rounded-lg shadow hover:bg-yellow-400 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
              Logging in...
            </>
          ) : (
            <>
              <img src="/assets/images/google-icon.svg" alt="Google" className="w-6 h-6" />
              Login with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <SessionWrapper>
        <LoginPageContent />
      </SessionWrapper>
    </Suspense>
  );
}