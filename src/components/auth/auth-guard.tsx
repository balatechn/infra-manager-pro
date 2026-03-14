"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import LoginScreen from "@/components/auth/login-screen";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loadSession } = useAuthStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSession();
    setLoaded(true);
  }, [loadSession]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
