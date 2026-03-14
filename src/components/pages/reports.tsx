"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { FileText, Download, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function ReportsPage() {
  const { projects, tasks, team, dashboardStats, fetchProjects, fetchTasks, fetchTeam, fetchDashboard } = useAppStore();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchTeam();
    fetchDashboard();
  }, [fetchProjects, fetchTasks, fetchTeam, fetchDashboard]);

  // Project status distribution
  const projectStatusData = (() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  // Task priority distribution
  const taskPriorityData = (() => {
    const counts: Record<string, number> = {};
    const flatTasks = (list: typeof tasks): typeof tasks => list.flatMap(t => [t, ...flatTasks(t.children || [])]);
    flatTasks(tasks).forEach(t => { counts[t.priority] = (counts[t.priority] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  // Budget overview per project
  const budgetData = projects.slice(0, 8).map(p => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
    budget: p.budget,
    used: p.budgetUsed,
    utilization: p.budget > 0 ? Math.round((p.budgetUsed / p.budget) * 100) : 0,
  }));

  // Team workload summary
  const workloadSummary = { high: team.filter(m => m.load === "High").length, medium: team.filter(m => m.load === "Medium").length, low: team.filter(m => m.load === "Low").length };

  const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  const stats = dashboardStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm">Overview of project metrics and performance</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <Card><CardContent className="p-4 text-center"><TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{stats?.activeProjects || projects.length}</p><p className="text-xs text-slate-400">Active Projects</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{stats?.completedTasks || 0}</p><p className="text-xs text-slate-400">Completed Tasks</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{stats?.inProgressTasks || 0}</p><p className="text-xs text-slate-400">In Progress</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{stats?.overdueTasks || 0}</p><p className="text-xs text-slate-400">Overdue</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><FileText className="w-6 h-6 text-purple-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{stats?.budgetUtilization || 0}%</p><p className="text-xs text-slate-400">Budget Utilization</p></CardContent></Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {projectStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Task Priority Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskPriorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                  {taskPriorityData.map((_, i) => <Cell key={i} fill={["#ef4444", "#f59e0b", "#3b82f6", "#10b981"][i % 4]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Budget Overview by Project</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" radius={[0, 4, 4, 0]} />
              <Bar dataKey="used" fill="#f59e0b" name="Used" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Progress Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Project Progress Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left p-3">Project</th>
                <th className="text-left p-3">Manager</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Progress</th>
                <th className="text-right p-3">Budget Used</th>
                <th className="text-right p-3">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-3 text-sm text-white">{p.name}</td>
                  <td className="p-3 text-sm text-slate-400">{p.manager}</td>
                  <td className="p-3 text-center"><Badge className="text-[10px]">{p.status}</Badge></td>
                  <td className="p-3 w-36"><Progress value={p.progress} /></td>
                  <td className="p-3 text-right text-sm text-white">₹{p.budgetUsed?.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs text-slate-400">{p.startDate} — {p.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Team Workload Summary */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Team Workload Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-400">{workloadSummary.high}</p>
              <p className="text-sm text-slate-400">High Workload</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">{workloadSummary.medium}</p>
              <p className="text-sm text-slate-400">Medium Workload</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{workloadSummary.low}</p>
              <p className="text-sm text-slate-400">Low Workload</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
