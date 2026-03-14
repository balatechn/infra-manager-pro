"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatShortDate, getStatusColor } from "@/lib/utils";
import {
  FolderKanban,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import type { Project } from "@/types";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(
        data.map((p: Record<string, unknown>) => ({
          id: p.id,
          name: p.name,
          client: p.client,
          location: p.location,
          region: p.region || "South",
          manager: p.manager,
          startDate: p.start_date,
          endDate: p.end_date,
          progress: p.progress || 0,
          status: p.status || "Planned",
          budget: Number(p.budget || 0),
          budgetUsed: Number(p.budget_used || 0),
          description: p.description || "",
          team: (p.team as string[]) || [],
          milestones: ((p.milestones as Array<Record<string, unknown>>) || []).map((m) => ({
            name: m.name as string,
            date: m.date as string,
            status: m.status as string,
          })),
        }))
      );
    } catch (e) {
      console.error("Failed to fetch projects", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "Active").length,
    nearCompletion: projects.filter((p) => p.status === "Near Completion").length,
    completed: projects.filter((p) => p.status === "Completed").length,
  };

  function openEdit(p: Project) {
    setEditProject({ ...p });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!editProject) return;
    try {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProject.id,
          name: editProject.name,
          status: editProject.status,
          progress: editProject.progress,
          budget_used: editProject.budgetUsed,
        }),
      });
      setModalOpen(false);
      fetchProjects();
    } catch (e) {
      console.error("Failed to save project", e);
    }
  }

  async function handleDelete() {
    if (!editProject || !confirm("Delete this project?")) return;
    try {
      await fetch(`/api/projects?id=${editProject.id}`, { method: "DELETE" });
      setModalOpen(false);
      fetchProjects();
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-slate-400">{projects.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatMini label="Total Projects" value={stats.total} color="text-blue-400" bg="bg-blue-500/10" />
        <StatMini label="Active" value={stats.active} color="text-green-400" bg="bg-green-500/10" />
        <StatMini label="Near Completion" value={stats.nearCompletion} color="text-orange-400" bg="bg-orange-500/10" />
        <StatMini label="Completed" value={stats.completed} color="text-cyan-400" bg="bg-cyan-500/10" />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link href={`/projects/${p.id}`} className="hover:text-amber-400 transition-colors">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.id}</p>
                    </Link>
                  </TableCell>
                  <TableCell>{p.client}</TableCell>
                  <TableCell>{p.location}</TableCell>
                  <TableCell className="text-xs">{formatShortDate(p.startDate)}</TableCell>
                  <TableCell className="text-xs">{formatShortDate(p.endDate)}</TableCell>
                  <TableCell className="w-32">
                    <Progress value={p.progress} />
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(p.budget)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/projects/${p.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.preventDefault();
                          openEdit(p);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details</DialogDescription>
          </DialogHeader>
          {editProject && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                <Input value={editProject.name} onChange={(e) => setEditProject({ ...editProject, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select
                    className="w-full h-9 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-200"
                    value={editProject.status}
                    onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Near Completion">Near Completion</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Progress (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editProject.progress}
                    onChange={(e) => setEditProject({ ...editProject, progress: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Budget Used (₹)</label>
                <Input
                  type="number"
                  value={editProject.budgetUsed}
                  onChange={(e) => setEditProject({ ...editProject, budgetUsed: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatMini({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <Card className="p-4">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </Card>
  );
}
