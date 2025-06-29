import AuthLayout from "@/app/(layouts)/authLayout";
import { LoadingAnimation } from "@/components/loadingAnimation";
import { Sidebar } from "@/components/sidebar";
import React, { Suspense } from "react";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex bg-gradient-to-b from-brand_01 to-brand_02 overflow-x-hidden relative">
      <Sidebar />
      {children}
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingAnimation loadingText="Redirecting" />}>
      <AuthLayout>
        <DashboardContent>
          <div className="flex flex-col gap-4">
            <h2 className="text-8xl">Dashboard</h2>
            {children}
          </div>
        </DashboardContent>
      </AuthLayout>
    </Suspense>
  );
};

export default DashboardLayout;
