"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/services/supabaseClient";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setEmail(session.user.email ?? null);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setEmail(session.user.email ?? null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-4 text-secondary">Profil</h2>
      <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <p className="text-lg font-semibold text-secondary mb-2">Email:</p>
        <p className="text-xl text-primary-yellow font-bold">{email}</p>
      </div>
    </div>
  );
} 