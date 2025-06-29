"use client";

import { LoadingAnimation } from "@/components/loadingAnimation";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CallbackAuth = () => {
  const router = useRouter();
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token") || "";

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        console.log("Berhasil masuk");
        router.replace("/dashboard");
      } catch (err: any) {
        console.error("OAuth Error:", err);
        router.replace("/auth/login?error=oauth");
      }
    };

    if (typeof window !== "undefined") {
      handleAuth();
    }
  }, [router]);
  return (
    <LoadingAnimation loadingText="Redirecting" />
  );
};

export default CallbackAuth;
