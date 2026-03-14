import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatShortDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Active: "bg-green-500/10 text-green-400 border-green-500/20",
    Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Near Completion": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Planned: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Delayed: "bg-red-500/10 text-red-400 border-red-500/20",
    Blocked: "bg-red-500/10 text-red-400 border-red-500/20",
    "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return map[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    High: "bg-red-500/10 text-red-400 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };
  return map[priority] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function getProgressColor(progress: number): string {
  if (progress >= 75) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-amber-500";
  return "bg-red-500";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const avatarColors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-orange-500",
  "bg-red-600",
  "bg-cyan-600",
];

export function getAvatarColor(name: string): string {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}
