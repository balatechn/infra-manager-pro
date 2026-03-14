"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { getPriorityColor, formatShortDate } from "@/lib/utils";
import { Plus, Search, GripVertical, MessageSquare, Paperclip, Clock } from "lucide-react";
import type { KanbanTask } from "@/types";

const COLUMNS = [
  { id: "Backlog", label: "Backlog", color: "bg-slate-500" },
  { id: "Planned", label: "Planned", color: "bg-blue-500" },
  { id: "In Progress", label: "In Progress", color: "bg-amber-500" },
  { id: "Testing", label: "Testing", color: "bg-purple-500" },
  { id: "Completed", label: "Completed", color: "bg-emerald-500" },
  { id: "Blocked", label: "Blocked", color: "bg-red-500" },
];

export default function KanbanPage() {
  const { kanbanTasks, fetchKanbanTasks, loading } = useAppStore();
  const [search, setSearch] = useState("");
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<KanbanTask | null>(null);
  const [addColumn, setAddColumn] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", project: "", priority: "Medium", assignee: "", dueDate: "", tags: "" });

  useEffect(() => {
    fetchKanbanTasks();
  }, [fetchKanbanTasks]);

  const filteredTasks = kanbanTasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.assignee.toLowerCase().includes(search.toLowerCase())
  );

  const getColumnTasks = (columnId: string) => filteredTasks.filter(t => t.column === columnId);

  const handleDragStart = (e: React.DragEvent, task: KanbanTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedTask || draggedTask.column === columnId) return;

    try {
      await fetch("/api/kanban", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draggedTask.id, column: columnId }),
      });
      fetchKanbanTasks();
    } catch (err) {
      console.error("Failed to move task:", err);
    }
    setDraggedTask(null);
  };

  const saveNewTask = async () => {
    if (!addColumn || !newTask.title) return;
    try {
      await fetch("/api/kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          project: newTask.project,
          priority: newTask.priority,
          assignee: newTask.assignee,
          dueDate: newTask.dueDate,
          tags: newTask.tags.split(",").map(t => t.trim()).filter(Boolean),
          column: addColumn,
        }),
      });
      fetchKanbanTasks();
      setAddColumn(null);
      setNewTask({ title: "", project: "", priority: "Medium", assignee: "", dueDate: "", tags: "" });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const updateTask = async () => {
    if (!editTask) return;
    try {
      await fetch("/api/kanban", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTask),
      });
      fetchKanbanTasks();
      setEditTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const totalTasks = kanbanTasks.length;
  const completedTasks = kanbanTasks.filter(t => t.column === "Completed").length;
  const blockedTasks = kanbanTasks.filter(t => t.column === "Blocked").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
          <p className="text-slate-400 text-sm">{totalTasks} tasks · {completedTasks} completed · {blockedTasks} blocked</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 240px)" }}>
        {COLUMNS.map(col => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div
              key={col.id}
              className={`min-w-[280px] w-[280px] flex flex-col rounded-xl border transition-colors ${
                dragOverColumn === col.id ? "border-amber-500 bg-amber-500/5" : "border-slate-700 bg-slate-800/30"
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="text-sm font-medium text-white">{col.label}</span>
                  <Badge className="bg-slate-700 text-[10px] px-1.5">{colTasks.length}</Badge>
                </div>
                <button onClick={() => setAddColumn(col.id)} className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => setEditTask({ ...task })}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-slate-600 transition-all hover:shadow-lg group"
                  >
                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h4 className="text-sm font-medium text-white mb-2">{task.title}</h4>
                    <p className="text-xs text-slate-400 mb-3">{task.project}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {task.comments > 0 && (
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{task.comments}</span>
                        )}
                        {task.attachments > 0 && (
                          <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{task.attachments}</span>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatShortDate(task.dueDate)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`${getPriorityColor(task.priority)} text-[10px] px-1`}>{task.priority}</Badge>
                        {task.assignee && <Avatar name={task.assignee} size="xs" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={!!addColumn} onOpenChange={() => setAddColumn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task to {addColumn}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Title</label>
              <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Project</label>
                <Input value={newTask.project} onChange={(e) => setNewTask({ ...newTask, project: e.target.value })} placeholder="Project name" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Priority</label>
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {["Critical", "High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Assignee</label>
                <Input value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Assignee name" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Due Date</label>
                <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Tags (comma separated)</label>
              <Input value={newTask.tags} onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })} placeholder="Design, Frontend" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddColumn(null)}>Cancel</Button>
            <Button onClick={saveNewTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Title</label>
                <Input value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Column</label>
                  <select value={editTask.column} onChange={(e) => setEditTask({ ...editTask, column: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Priority</label>
                  <select value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                    {["Critical", "High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Assignee</label>
                  <Input value={editTask.assignee} onChange={(e) => setEditTask({ ...editTask, assignee: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Due Date</label>
                  <Input type="date" value={editTask.dueDate} onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Project</label>
                <Input value={editTask.project} onChange={(e) => setEditTask({ ...editTask, project: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTask(null)}>Cancel</Button>
            <Button onClick={updateTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
