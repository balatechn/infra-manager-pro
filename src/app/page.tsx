"use client";

import dynamic from "next/dynamic";
import AuthGuard from "@/components/auth/auth-guard";

const TopNav = dynamic(() => import("@/components/layout/top-nav"), { ssr: false });
const DashboardPage = dynamic(() => import("@/components/pages/dashboard"), { ssr: false });

export default function Home() {
  return (
    <AuthGuard>
      <TopNav />
      <main className="p-6">
        <DashboardPage />
      </main>
    </AuthGuard>
  );
}
