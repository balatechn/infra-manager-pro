"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { formatShortDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import type { Task } from "@/types";

interface TaskRow extends Task {
  level: number;
  expanded: boolean;
  hasChildren: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Partial<Task> | null>(null);
  const [team, setTeam] = useState<string[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchTasks();
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setTeam(data.map((m: Record<string, unknown>) => m.name as string)));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) =>
        setProjects(data.map((p: Record<string, unknown>) => ({ id: p.id as string, name: p.name as string })))
      );
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
      // Expand top-level by default
      const ids = new Set<string>();
      data.forEach((t: Task) => ids.add(t.id));
      setExpandedIds(ids);
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    } finally {
      setLoading(false);
    }
  }

  // Flatten task tree for display
  const flatRows: TaskRow[] = [];
  function flatten(taskList: Task[], level: number) {
    taskList.forEach((t) => {
      const hasChildren = t.children && t.children.length > 0;
      const expanded = expandedIds.has(t.id);
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.assignedTo || "").toLowerCase().includes(search.toLowerCase());

      if (matchesSearch || hasChildren) {
        flatRows.push({ ...t, level, expanded, hasChildren: !!hasChildren });
        if (hasChildren && expanded) {
          flatten(t.children, level + 1);
        }
      }
    });
  }
  flatten(tasks, 0);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    const ids = new Set<string>();
    function collect(list: Task[]) {
      list.forEach((t) => {
        if (t.children?.length) {
          ids.add(t.id);
          collect(t.children);
        }
      });
    }
    collect(tasks);
    setExpandedIds(ids);
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  function openEditModal(task: Task) {
    setEditTask({
      id: task.id,
      name: task.name,
      projectId: task.projectId,
      assignedTo: task.assignedTo,
      startDate: task.startDate,
      endDate: task.endDate,
      duration: task.duration,
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      dependency: task.dependency,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!editTask) return;
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editTask.id,
          name: editTask.name,
          assigned_to: editTask.assignedTo,
          start_date: editTask.startDate,
          end_date: editTask.endDate,
          duration: editTask.duration,
          status: editTask.status,
          priority: editTask.priority,
          progress: editTask.progress,
          dependency: editTask.dependency,
        }),
      });
      setModalOpen(false);
      fetchTasks();
    } catch (e) {
      console.error("Failed to save task", e);
    }
  }

  async function handleDelete() {
    if (!editTask?.id || !confirm("Delete this task?")) return;
    try {
      await fetch(`/api/tasks?id=${editTask.id}`, { method: "DELETE" });
      setModalOpen(false);
      fetchTasks();
    } catch (e) {
      console.error("Failed to delete task", e);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-sm text-slate-400">Hierarchical task management</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" size="sm" onClick={expandAll}>
          <ChevronsUpDown className="w-4 h-4" /> Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          <ChevronsDownUp className="w-4 h-4" /> Collapse
        </Button>
      </div>

      {/* Task Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task Name</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatRows.map((row) => (
                <TableRow key={row.id} className={row.level === 0 ? "bg-slate-800/30" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-1" style={{ paddingLeft: `${row.level * 24}px` }}>
                      {row.hasChildren ? (
                        <button onClick={() => toggleExpand(row.id)} className="p-0.5 text-slate-400 hover:text-white">
                          {row.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      ) : (
                        <span className="w-5" />
                      )}
                      <span className={`text-sm ${row.level === 0 ? "font-semibold text-white" : "text-slate-300"}`}>
                        {row.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{row.startDate ? formatShortDate(row.startDate) : "—"}</TableCell>
                  <TableCell className="text-xs">{row.endDate ? formatShortDate(row.endDate) : "—"}</TableCell>
                  <TableCell className="text-xs">{row.duration || "—"}</TableCell>
                  <TableCell>
                    {row.assignedTo ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={row.assignedTo} size="sm" />
                        <span className="text-xs">{row.assignedTo.split(" ")[0]}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="w-24">
                    <Progress value={row.progress} />
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(row)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
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
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          {editTask && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Task Name</label>
                <Input value={editTask.name || ""} onChange={(e) => setEditTask({ ...editTask, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select className="w-full h-9 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-200" value={editTask.priority || "Medium"} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select className="w-full h-9 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-200" value={editTask.status || "Planned"} onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}>
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                  <Input type="date" value={editTask.startDate?.split("T")[0] || ""} onChange={(e) => setEditTask({ ...editTask, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                  <Input type="date" value={editTask.endDate?.split("T")[0] || ""} onChange={(e) => setEditTask({ ...editTask, endDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Assigned To</label>
                  <select className="w-full h-9 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-200" value={editTask.assignedTo || ""} onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}>
                    <option value="">Unassigned</option>
                    {team.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Progress (%)</label>
                  <Input type="number" min={0} max={100} value={editTask.progress || 0} onChange={(e) => setEditTask({ ...editTask, progress: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Dependency</label>
                <Input placeholder="e.g. T001" value={editTask.dependency || ""} onChange={(e) => setEditTask({ ...editTask, dependency: e.target.value })} />
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
