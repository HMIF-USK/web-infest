"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const menu = [
  { name: "Profil", href: "/dashboard/profile" },
  { name: "Kompetisi", href: "/dashboard/kompetisi" },
  { name: "Tim Anda", href: "/dashboard/tim" },
];

// Loading component
function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-yellow/10 via-white to-secondary/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow mx-auto mb-4"></div>
        <p className="text-secondary font-medium">Memuat dashboard...</p>
      </div>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="mt-auto px-4 py-3 rounded-lg font-semibold text-white bg-primary-yellow hover:bg-yellow-400 transition-colors duration-200 shadow-lg"
    >
      Logout
    </button>
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
          router.replace("/login");
          return;
        }

        if (!session) {
          router.replace("/login");
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error("Session check failed:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace("/login");
        } else {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

// Main dashboard layout component
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-yellow/10 via-white to-secondary/10">
      <aside className="w-64 min-h-screen bg-white/90 shadow-xl flex flex-col py-8 px-6 border-r border-primary-yellow">
        <h2 className="text-2xl font-bold text-secondary mb-10">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-3 rounded-lg font-semibold text-secondary hover:bg-primary-yellow/30 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex-1 flex flex-col justify-end">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <SessionWrapper>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </SessionWrapper>
    </Suspense>
  );
}