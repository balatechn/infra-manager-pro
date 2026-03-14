"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { getStatusColor, getPriorityColor, formatShortDate } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Pencil, Plus, Calendar, Filter } from "lucide-react";
import type { Task } from "@/types";

type ZoomLevel = "day" | "week" | "month" | "quarter";

interface FlatTask extends Task {
  level: number;
  expanded: boolean;
  hasChildren: boolean;
}

export default function GanttPage() {
  const { tasks, projects, fetchTasks, fetchProjects, loading } = useAppStore();
  const [search, setSearch] = useState("");
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("week");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ name: "", status: "", priority: "", progress: 0, startDate: "", endDate: "", assignedTo: "" });
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Flatten task hierarchy
  const flattenTasks = useCallback((taskList: Task[], level = 0): FlatTask[] => {
    const result: FlatTask[] = [];
    for (const task of taskList) {
      const hasChildren = task.children && task.children.length > 0;
      const expanded = expandedIds.has(task.id);
      result.push({ ...task, level, expanded, hasChildren });
      if (hasChildren && expanded) {
        result.push(...flattenTasks(task.children, level + 1));
      }
    }
    return result;
  }, [expandedIds]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedProject !== "all") {
      filtered = filtered.filter(t => t.projectId === selectedProject);
    }
    const flat = flattenTasks(filtered);
    if (!search) return flat;
    return flat.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.assignedTo.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search, selectedProject, flattenTasks]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collect = (list: Task[]) => { list.forEach(t => { allIds.add(t.id); if (t.children) collect(t.children); }); };
    collect(tasks);
    setExpandedIds(allIds);
  };

  // Date range computation
  const dateRange = useMemo(() => {
    const allDates: Date[] = [];
    const collectDates = (list: FlatTask[]) => {
      list.forEach(t => {
        if (t.startDate) allDates.push(new Date(t.startDate));
        if (t.endDate) allDates.push(new Date(t.endDate));
      });
    };
    collectDates(filteredTasks);
    if (allDates.length === 0) {
      const now = new Date();
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 3, 0) };
    }
    const min = new Date(Math.min(...allDates.map(d => d.getTime())));
    const max = new Date(Math.max(...allDates.map(d => d.getTime())));
    min.setDate(min.getDate() - 7);
    max.setDate(max.getDate() + 14);
    return { start: min, end: max };
  }, [filteredTasks]);

  // Generate timeline columns
  const timelineColumns = useMemo(() => {
    const cols: { label: string; subLabel?: string; date: Date; width: number }[] = [];
    const { start, end } = dateRange;
    const current = new Date(start);

    if (zoomLevel === "day") {
      while (current <= end) {
        cols.push({ label: current.getDate().toString(), subLabel: current.toLocaleString("default", { month: "short" }), date: new Date(current), width: 40 });
        current.setDate(current.getDate() + 1);
      }
    } else if (zoomLevel === "week") {
      current.setDate(current.getDate() - current.getDay());
      while (current <= end) {
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);
        cols.push({ label: `${current.getDate()} ${current.toLocaleString("default", { month: "short" })}`, date: new Date(current), width: 120 });
        current.setDate(current.getDate() + 7);
      }
    } else if (zoomLevel === "month") {
      current.setDate(1);
      while (current <= end) {
        cols.push({ label: current.toLocaleString("default", { month: "short", year: "2-digit" }), date: new Date(current), width: 160 });
        current.setMonth(current.getMonth() + 1);
      }
    } else {
      current.setDate(1);
      current.setMonth(Math.floor(current.getMonth() / 3) * 3);
      while (current <= end) {
        const q = Math.floor(current.getMonth() / 3) + 1;
        cols.push({ label: `Q${q} ${current.getFullYear()}`, date: new Date(current), width: 200 });
        current.setMonth(current.getMonth() + 3);
      }
    }
    return cols;
  }, [dateRange, zoomLevel]);

  const totalTimelineWidth = useMemo(() => timelineColumns.reduce((sum, col) => sum + col.width, 0), [timelineColumns]);

  // Calculate bar position and width for a task
  const getBarStyle = useCallback((task: FlatTask) => {
    if (!task.startDate || !task.endDate) return null;
    const start = new Date(task.startDate).getTime();
    const end = new Date(task.endDate).getTime();
    const rangeStart = dateRange.start.getTime();
    const rangeEnd = dateRange.end.getTime();
    const totalRange = rangeEnd - rangeStart;
    if (totalRange === 0) return null;
    const left = ((start - rangeStart) / totalRange) * totalTimelineWidth;
    const width = Math.max(((end - start) / totalRange) * totalTimelineWidth, 8);
    return { left, width };
  }, [dateRange, totalTimelineWidth]);

  // Today marker position
  const todayPosition = useMemo(() => {
    const now = new Date().getTime();
    const rangeStart = dateRange.start.getTime();
    const rangeEnd = dateRange.end.getTime();
    const totalRange = rangeEnd - rangeStart;
    if (totalRange === 0) return -1;
    return ((now - rangeStart) / totalRange) * totalTimelineWidth;
  }, [dateRange, totalTimelineWidth]);

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditForm({ name: task.name, status: task.status, priority: task.priority, progress: task.progress, startDate: task.startDate, endDate: task.endDate, assignedTo: task.assignedTo });
  };

  const saveEdit = async () => {
    if (!editTask) return;
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTask.id, ...editForm }),
      });
      fetchTasks();
      setEditTask(null);
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  const scrollTimeline = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += direction === "right" ? 300 : -300;
    }
  };

  const zoomLevels: ZoomLevel[] = ["day", "week", "month", "quarter"];
  const zoomIn = () => { const idx = zoomLevels.indexOf(zoomLevel); if (idx > 0) setZoomLevel(zoomLevels[idx - 1]); };
  const zoomOut = () => { const idx = zoomLevels.indexOf(zoomLevel); if (idx < zoomLevels.length - 1) setZoomLevel(zoomLevels[idx + 1]); };

  const ROW_HEIGHT = 44;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gantt Chart</h1>
          <p className="text-slate-400 text-sm">{filteredTasks.length} tasks across timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg p-2">
        <Button variant="ghost" size="sm" onClick={() => scrollTimeline("left")}><ChevronLeft className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => scrollTimeline("right")}><ChevronRight className="w-4 h-4" /></Button>
        <div className="h-4 w-px bg-slate-600" />
        <Button variant="ghost" size="sm" onClick={zoomIn}><ZoomIn className="w-4 h-4" /></Button>
        <Badge className="bg-slate-700 text-xs">{zoomLevel}</Badge>
        <Button variant="ghost" size="sm" onClick={zoomOut}><ZoomOut className="w-4 h-4" /></Button>
        <div className="h-4 w-px bg-slate-600" />
        <Button variant="ghost" size="sm" onClick={expandAll}>Expand All</Button>
        <Button variant="ghost" size="sm" onClick={() => setExpandedIds(new Set())}>Collapse All</Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => {
          if (scrollRef.current && todayPosition >= 0) {
            scrollRef.current.scrollLeft = todayPosition - scrollRef.current.clientWidth / 2;
          }
        }}>
          <Calendar className="w-4 h-4 mr-1" /> Today
        </Button>
      </div>

      {/* Gantt Chart */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            {/* Task List Panel */}
            <div className="w-[400px] min-w-[400px] border-r border-slate-700">
              {/* Header */}
              <div className="flex items-center h-12 bg-slate-800 border-b border-slate-700 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <span className="flex-1">Task Name</span>
                <span className="w-20 text-center">Status</span>
                <span className="w-10 text-center">Edit</span>
              </div>
              {/* Rows */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center border-b border-slate-700/50 px-4 hover:bg-slate-800/50 group" style={{ height: ROW_HEIGHT }}>
                    <div className="flex-1 flex items-center gap-1 min-w-0" style={{ paddingLeft: task.level * 20 }}>
                      {task.hasChildren ? (
                        <button onClick={() => toggleExpand(task.id)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white shrink-0">
                          <span className={`text-xs transition-transform ${task.expanded ? "rotate-90" : ""}`}>▶</span>
                        </button>
                      ) : <span className="w-5 shrink-0" />}
                      <span className="text-sm text-white truncate">{task.name}</span>
                    </div>
                    <span className="w-20 text-center">
                      <Badge className={`${getStatusColor(task.status)} text-[10px] px-1.5`}>{task.status}</Badge>
                    </span>
                    <button onClick={() => openEdit(task)} className="w-10 flex items-center justify-center text-slate-500 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No tasks to display</div>
                )}
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="flex-1 overflow-hidden">
              <div ref={scrollRef} className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px + 48px)" }}>
                {/* Header */}
                <div className="flex h-12 bg-slate-800 border-b border-slate-700 sticky top-0 z-10" style={{ width: totalTimelineWidth }}>
                  {timelineColumns.map((col, i) => (
                    <div key={i} className="flex flex-col items-center justify-center border-r border-slate-700/50 text-xs" style={{ width: col.width, minWidth: col.width }}>
                      <span className="text-slate-300 font-medium">{col.label}</span>
                      {col.subLabel && <span className="text-slate-500 text-[10px]">{col.subLabel}</span>}
                    </div>
                  ))}
                </div>
                {/* Bars */}
                <div className="relative" style={{ width: totalTimelineWidth, height: filteredTasks.length * ROW_HEIGHT }}>
                  {/* Grid lines */}
                  {timelineColumns.map((col, i) => {
                    let offset = 0;
                    for (let j = 0; j < i; j++) offset += timelineColumns[j].width;
                    return <div key={i} className="absolute top-0 bottom-0 border-r border-slate-700/30" style={{ left: offset, width: col.width }} />;
                  })}
                  {/* Today line */}
                  {todayPosition >= 0 && todayPosition <= totalTimelineWidth && (
                    <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500/60 z-10" style={{ left: todayPosition }}>
                      <div className="absolute -top-0 -left-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black">T</span>
                      </div>
                    </div>
                  )}
                  {/* Task bars */}
                  {filteredTasks.map((task, index) => {
                    const barStyle = getBarStyle(task);
                    if (!barStyle) return null;
                    const statusColors: Record<string, string> = {
                      "Completed": "bg-emerald-500",
                      "In Progress": "bg-blue-500",
                      "Pending": "bg-amber-500",
                      "Delayed": "bg-red-500",
                      "On Hold": "bg-purple-500",
                      "Not Started": "bg-slate-500",
                    };
                    const barColor = statusColors[task.status] || "bg-slate-500";
                    return (
                      <div
                        key={task.id}
                        className="absolute flex items-center"
                        style={{ top: index * ROW_HEIGHT, height: ROW_HEIGHT, left: barStyle.left, width: barStyle.width }}
                      >
                        <div className={`relative h-7 w-full rounded-md ${barColor} cursor-pointer hover:brightness-110 transition-all shadow-sm group/bar`} onClick={() => openEdit(task)}>
                          {/* Progress fill */}
                          <div className="absolute inset-0 rounded-md bg-white/10" style={{ width: `${task.progress}%` }} />
                          {/* Label */}
                          {barStyle.width > 60 && (
                            <span className="absolute inset-0 flex items-center px-2 text-[11px] text-white font-medium truncate">
                              {task.name}
                            </span>
                          )}
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-0 mb-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-xs hidden group-hover/bar:block z-20 w-48 shadow-xl">
                            <div className="font-medium text-white mb-1">{task.name}</div>
                            <div className="text-slate-400">{formatShortDate(task.startDate)} — {formatShortDate(task.endDate)}</div>
                            <div className="text-slate-400">Progress: {task.progress}%</div>
                            <div className="text-slate-400">Assignee: {task.assignedTo}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Task Name</label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {["Not Started", "In Progress", "Completed", "Delayed", "On Hold", "Pending"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Priority</label>
                <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {["Critical", "High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Start Date</label>
                <Input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">End Date</label>
                <Input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Assigned To</label>
                <Input value={editForm.assignedTo} onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Progress ({editForm.progress}%)</label>
                <input type="range" min="0" max="100" step="5" value={editForm.progress} onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) })} className="w-full accent-amber-500" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTask(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
