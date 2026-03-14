"use client";

import AuthGuard from "@/components/auth/auth-guard";
import TopNav from "@/components/layout/top-nav";
import DashboardPage from "@/components/pages/dashboard";

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
