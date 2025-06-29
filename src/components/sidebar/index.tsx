"use client";

import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const toastId = toast.loading("Memproses...");
    await supabase.auth.signOut();
    toast.success("Berhasil logout!", { id: toastId });
    router.push("/auth/login");
  };
  return (
    <div className="w-1/4 bg-brand_02 h-screen p-4 flex flex-col inset-0">
      <h2 className="text-2xl font-bold text-neutral_01 mb-4">Sidebar</h2>
      <ul className="space-y-2">
        <li className="text-neutral_01 hover:text-brand_01 cursor-pointer">
          Dashboard
        </li>
        <li className="text-neutral_01 hover:text-brand_01 cursor-pointer">
          Profile
        </li>
        <li className="text-neutral_01 hover:text-brand_01 cursor-pointer">
          Settings
        </li>
        <button
          onClick={handleLogout}
          className="text-neutral_01 hover:text-brand_01 cursor-pointer"
        >
          Logout
        </button>
      </ul>
    </div>
  );
};
