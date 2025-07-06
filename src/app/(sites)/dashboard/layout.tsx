import ProtectedLayout from "@/app/(layouts)/protectedLayout";
import FooterDekstop from "@/components/footer/footerDekstop";
import FooterMobile from "@/components/footer/footerMobile";
import { LoadingAnimation } from "@/components/loadingAnimation";
import { Sidebar } from "@/components/sidebar";
import React, { Suspense } from "react";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand_01 via-brand_02 to-brand_01 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72 w-full min-w-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:mr-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={<LoadingAnimation loadingText="Loading Dashboard..." />}
    >
      <ProtectedLayout>
        <DashboardContent>{children}</DashboardContent>
      </ProtectedLayout>
    </Suspense>
  );
};

export default DashboardLayout;
