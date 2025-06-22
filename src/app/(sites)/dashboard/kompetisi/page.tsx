"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/services/supabaseClient";

export default function KompetisiPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-4 text-secondary">Kompetisi</h2>
      <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <p className="text-lg text-secondary">Halaman kompetisi akan segera tersedia.</p>
      </div>
    </div>
  );
} 