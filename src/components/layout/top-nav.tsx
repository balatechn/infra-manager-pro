"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  GanttChart,
  Columns3,
  Users,
  BarChart3,
  Package,
  DollarSign,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  LogOut,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/gantt", label: "Gantt", icon: GanttChart },
  { href: "/kanban", label: "Kanban", icon: Columns3 },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/assets", label: "Assets", icon: Package },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function TopNav() {
  const pathname = usePathname();
  const { session, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = session ? getInitials(session.name) : "BP";

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-lg font-bold text-white">
            Infra Manager <span className="text-amber-400">Pro</span>
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 w-80">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, tasks, team..."
            className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-500 w-full"
          />
          <kbd className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">Ctrl+K</kbd>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/tasks" className="hidden sm:flex">
            <button className="flex items-center gap-1.5 bg-amber-500 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              5
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            className="p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              document.documentElement.classList.toggle("dark", next === "dark");
              document.documentElement.classList.toggle("light", next === "light");
            }}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <Link href="/settings" className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-amber-500 text-slate-900 font-bold text-sm flex items-center justify-center hover:bg-amber-400 transition-colors"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{session?.name || "B Pillai"}</p>
                      <p className="text-xs text-slate-400">{session?.email || "bpillai100@gmail.com"}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <nav className="flex items-center gap-1 px-6 overflow-x-auto scrollbar-none h-10">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "bg-amber-500/10 text-amber-400 font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
