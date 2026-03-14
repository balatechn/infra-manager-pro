"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Search, Users, BarChart3, Star, Mail, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import type { TeamMember } from "@/types";

export default function TeamsPage() {
  const { team, fetchTeam, loading } = useAppStore();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const filtered = team.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = team.length;
  const avgLoad = team.length > 0 ? Math.round(team.reduce((sum, m) => sum + (m.load === "High" ? 90 : m.load === "Medium" ? 60 : 30), 0) / team.length) : 0;
  const avgCompletion = team.length > 0 ? Math.round(team.reduce((sum, m) => sum + (m.tasks > 0 ? (m.completed / m.tasks) * 100 : 0), 0) / team.length) : 0;

  // Chart data for workload
  const workloadData = team.slice(0, 10).map(m => ({
    name: m.name.split(" ")[0],
    tasks: m.tasks,
    completed: m.completed,
    pending: m.tasks - m.completed,
  }));

  // Radar data for skills (aggregate top skills)
  const skillCounts: Record<string, number> = {};
  team.forEach(m => m.skills?.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; }));
  const radarData = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill, count]) => ({ skill, count }));

  const getLoadColor = (load: string) => {
    if (load === "High") return "bg-red-500/20 text-red-400";
    if (load === "Medium") return "bg-amber-500/20 text-amber-400";
    return "bg-emerald-500/20 text-emerald-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 text-sm">{totalMembers} team members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 border border-slate-700 rounded-lg">
            <button onClick={() => setView("grid")} className={`px-3 py-1.5 text-xs rounded-l-lg ${view === "grid" ? "bg-amber-500 text-black" : "text-slate-400"}`}>Grid</button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs rounded-r-lg ${view === "list" ? "bg-amber-500 text-black" : "text-slate-400"}`}>List</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search team..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-blue-400" /></div><div><p className="text-2xl font-bold text-white">{totalMembers}</p><p className="text-xs text-slate-400">Total Members</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-amber-400" /></div><div><p className="text-2xl font-bold text-white">{avgLoad}%</p><p className="text-xs text-slate-400">Avg Workload</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Star className="w-5 h-5 text-emerald-400" /></div><div><p className="text-2xl font-bold text-white">{avgCompletion}%</p><p className="text-xs text-slate-400">Avg Completion</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-purple-400" /></div><div><p className="text-2xl font-bold text-white">{team.filter(m => m.load === "High").length}</p><p className="text-xs text-slate-400">High Workload</p></div></div></CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Team Workload</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Team Skills</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#334155" fontSize={10} />
                <Radar name="Members" dataKey="count" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid/List */}
      {view === "grid" ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(member => (
            <Card key={member.id} className="hover:border-slate-600 transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={member.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">{member.role}</p>
                    <Badge className={`${getLoadColor(member.load)} text-[10px]`}>{member.load} Load</Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tasks</span>
                    <span className="text-white">{member.completed}/{member.tasks}</span>
                  </div>
                  <Progress value={member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0} />
                  {member.projects && member.projects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.projects.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{p}</span>
                      ))}
                      {member.projects.length > 2 && <span className="text-[10px] text-slate-500">+{member.projects.length - 2}</span>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left p-3">Member</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-center p-3">Tasks</th>
                  <th className="text-center p-3">Completion</th>
                  <th className="text-center p-3">Workload</th>
                  <th className="text-left p-3">Projects</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(member => (
                  <tr key={member.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <td className="p-3"><div className="flex items-center gap-3"><Avatar name={member.name} size="sm" /><span className="text-sm text-white">{member.name}</span></div></td>
                    <td className="p-3 text-sm text-slate-400">{member.role}</td>
                    <td className="p-3 text-center text-sm text-white">{member.completed}/{member.tasks}</td>
                    <td className="p-3 text-center"><Progress value={member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0} /></td>
                    <td className="p-3 text-center"><Badge className={`${getLoadColor(member.load)} text-[10px]`}>{member.load}</Badge></td>
                    <td className="p-3"><div className="flex flex-wrap gap-1">{member.projects?.slice(0, 2).map((p, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{p}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Member Detail Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Team Member Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar name={selectedMember.name} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMember.name}</h3>
                  <p className="text-sm text-slate-400">{selectedMember.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-white">{selectedMember.tasks}</p>
                  <p className="text-xs text-slate-400">Total Tasks</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-emerald-400">{selectedMember.completed}</p>
                  <p className="text-xs text-slate-400">Completed</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-amber-400">{selectedMember.tasks - selectedMember.completed}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
              {selectedMember.skills && selectedMember.skills.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((s, i) => (
                      <Badge key={i} className="bg-slate-700 text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedMember.projects && selectedMember.projects.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Projects</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projects.map((p, i) => (
                      <Badge key={i} className="bg-blue-500/20 text-blue-400 text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
