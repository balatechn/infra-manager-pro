import { create } from "zustand";
import type { Project, Task, KanbanTask, TeamMember, Asset, Activity, DashboardStats } from "@/types";

interface AppStore {
  // Data
  projects: Project[];
  tasks: Task[];
  kanbanTasks: KanbanTask[];
  team: TeamMember[];
  assets: Asset[];
  activities: Activity[];
  dashboardStats: DashboardStats | null;
  loading: boolean;

  // Actions
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setKanbanTasks: (tasks: KanbanTask[]) => void;
  setTeam: (team: TeamMember[]) => void;
  setAssets: (assets: Asset[]) => void;
  setActivities: (activities: Activity[]) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;

  // Fetch helpers
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchKanbanTasks: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchAssets: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  projects: [],
  tasks: [],
  kanbanTasks: [],
  team: [],
  assets: [],
  activities: [],
  dashboardStats: null,
  loading: false,

  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  setKanbanTasks: (kanbanTasks) => set({ kanbanTasks }),
  setTeam: (team) => set({ team }),
  setAssets: (assets) => set({ assets }),
  setActivities: (activities) => set({ activities }),
  setDashboardStats: (dashboardStats) => set({ dashboardStats }),
  setLoading: (loading) => set({ loading }),

  fetchProjects: async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const projects = data.map(mapProject);
      set({ projects });
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  },

  fetchTasks: async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data });
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    }
  },

  fetchKanbanTasks: async () => {
    try {
      const res = await fetch("/api/kanban");
      const data = await res.json();
      const kanbanTasks = data.map(mapKanban);
      set({ kanbanTasks });
    } catch (e) {
      console.error("Failed to fetch kanban tasks", e);
    }
  },

  fetchTeam: async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      const team = data.map(mapTeam);
      set({ team });
    } catch (e) {
      console.error("Failed to fetch team", e);
    }
  },

  fetchAssets: async () => {
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      const assets = data.map(mapAsset);
      set({ assets });
    } catch (e) {
      console.error("Failed to fetch assets", e);
    }
  },

  fetchDashboard: async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      set({
        dashboardStats: data.stats,
        projects: (data.projects || []).map(mapProject),
        activities: data.activities || [],
      });
    } catch (e) {
      console.error("Failed to fetch dashboard", e);
    }
  },
}));

// ===== DB → Frontend Mappers =====
function mapProject(p: Record<string, unknown>): Project {
  return {
    id: p.id as string,
    name: p.name as string,
    client: p.client as string,
    location: p.location as string,
    region: (p.region as string) || "South",
    manager: p.manager as string,
    startDate: p.start_date as string,
    endDate: p.end_date as string,
    progress: (p.progress as number) || 0,
    status: (p.status as string) || "Planned",
    budget: Number(p.budget) || 0,
    budgetUsed: Number(p.budget_used) || 0,
    description: (p.description as string) || "",
    team: (p.team as string[]) || [],
    milestones: ((p.milestones as Array<Record<string, unknown>>) || []).map((m) => ({
      name: m.name as string,
      date: m.date as string,
      status: m.status as string,
    })),
  };
}

function mapKanban(k: Record<string, unknown>): KanbanTask {
  return {
    id: k.id as string,
    title: k.title as string,
    project: (k.project as string) || "",
    priority: (k.priority as string) || "Medium",
    assignee: (k.assignee as string) || "",
    dueDate: (k.due_date as string) || "",
    comments: (k.comments as number) || 0,
    attachments: (k.attachments as number) || 0,
    tags: (k.tags as string[]) || [],
    column: (k.column_status as string) || "backlog",
  };
}

function mapTeam(t: Record<string, unknown>): TeamMember {
  return {
    id: t.id as number,
    name: t.name as string,
    role: (t.role as string) || "",
    avatar: (t.avatar as string) || "bg-1",
    initials: (t.initials as string) || "",
    tasks: (t.tasks_count as number) || 0,
    completed: (t.completed_count as number) || 0,
    load: (t.load as string) || "Low",
    projects: (t.projects as string[]) || [],
    skills: (t.skills as string[]) || [],
  };
}

function mapAsset(a: Record<string, unknown>): Asset {
  return {
    id: a.id as string,
    name: a.name as string,
    category: (a.category as string) || "",
    location: (a.location as string) || "",
    status: (a.status as string) || "In Warehouse",
    project: (a.project as string) || "",
    serial: (a.serial_number as string) || "",
    purchaseDate: (a.purchase_date as string) || "",
  };
}
