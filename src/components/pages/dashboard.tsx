"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { formatCurrency, getStatusColor, formatShortDate } from "@/lib/utils";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardData {
  stats: {
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    teamMembers: number;
    budgetUtilization: number;
  };
  projects: Array<Record<string, unknown>>;
  activities: Array<{ id: number; type: string; text: string; time: string }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="text-slate-400">Failed to load dashboard</div>;

  const { stats, projects, activities } = data;

  // Chart data
  const taskPieData = [
    { name: "Completed", value: stats.completedTasks, color: "#22C55E" },
    { name: "In Progress", value: stats.inProgressTasks, color: "#F59E0B" },
    { name: "Overdue", value: stats.overdueTasks, color: "#EF4444" },
    {
      name: "Planned",
      value: stats.totalTasks - stats.completedTasks - stats.inProgressTasks - stats.overdueTasks,
      color: "#64748B",
    },
  ].filter((d) => d.value > 0);

  const budgetData = (projects || []).slice(0, 6).map((p) => ({
    name: (p.name as string || "").split(" ")[0],
    budget: Number(p.budget || 0) / 100000,
    used: Number(p.budget_used || 0) / 100000,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">Executive Overview</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard icon={<FolderKanban className="w-5 h-5" />} label="Active Projects" value={stats.activeProjects} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={<CheckSquare className="w-5 h-5" />} label="Total Tasks" value={stats.totalTasks} color="text-amber-400" bg="bg-amber-500/10" />
        <StatCard icon={<CheckSquare className="w-5 h-5" />} label="Completed" value={stats.completedTasks} color="text-green-400" bg="bg-green-500/10" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="In Progress" value={stats.inProgressTasks} color="text-cyan-400" bg="bg-cyan-500/10" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Overdue" value={stats.overdueTasks} color="text-red-400" bg="bg-red-500/10" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Team Members" value={stats.teamMembers} color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Budget Util." value={`${stats.budgetUtilization}%`} color="text-orange-400" bg="bg-orange-500/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {taskPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", color: "#E2E8F0" }} />
                  <Legend wrapperStyle={{ color: "#94A3B8", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget vs Actual (₹ Lakhs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", color: "#E2E8F0" }} />
                  <Bar dataKey="budget" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Budget" />
                  <Bar dataKey="used" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(projects || []).map((p) => (
                <div key={p.id as string} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name as string}</p>
                    <p className="text-xs text-slate-400">{p.manager as string}</p>
                  </div>
                  <div className="w-32">
                    <Progress value={p.progress as number || 0} />
                  </div>
                  <Badge className={getStatusColor(p.status as string || "Planned")}>
                    {p.status as string}
                  </Badge>
                  <span className="text-xs text-slate-400 w-16 text-right">
                    {formatCurrency(Number(p.budget || 0))}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(activities || []).map((a, i) => {
                const dotColor =
                  a.type === "green" ? "bg-green-500" : a.type === "orange" ? "bg-amber-500" : a.type === "red" ? "bg-red-500" : "bg-blue-500";
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${dotColor}`} />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-[11px] text-slate-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}
