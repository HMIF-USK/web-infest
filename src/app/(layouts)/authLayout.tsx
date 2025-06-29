"use client";

import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace("/auth/login");
        }
      } catch (error) {
        toast.error("Anda harus login terlebih dahulu.");
        router.replace("/auth/login");
      }
    };
    checkAuth();
  }, [router]);
  return <div>{children}</div>;
};

export default AuthLayout;
