"use client";

import AuthGuard from "@/components/auth/auth-guard";
import TopNav from "@/components/layout/top-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <TopNav />
      <main className="p-6">{children}</main>
    </AuthGuard>
  );
}
