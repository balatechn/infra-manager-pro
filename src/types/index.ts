// ===== Project Types =====
export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  region: string;
  manager: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  budget: number;
  budgetUsed: number;
  description: string;
  team: string[];
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  date: string;
  status: string;
}

// ===== Task Types =====
export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  duration: string;
  dependency: string;
  progress: number;
  status: string;
  priority: string;
  children: Task[];
}

// ===== Kanban Types =====
export interface KanbanTask {
  id: string;
  title: string;
  project: string;
  priority: string;
  assignee: string;
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
  column: string;
}

// ===== Team Types =====
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  tasks: number;
  completed: number;
  load: string;
  projects: string[];
  skills: string[];
}

// ===== Asset Types =====
export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  project: string;
  serial: string;
  purchaseDate: string;
}

// ===== Activity Types =====
export interface Activity {
  id: number;
  type: string;
  text: string;
  time: string;
}

// ===== User / RBAC Types =====
export interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatar: string;
  roleId: number | null;
  roleName?: string;
  roleColor?: string;
  status: string;
  department: string;
  phone: string;
  lastActive: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissionCount?: number;
  userCount?: number;
  permissions?: number[];
}

export interface Permission {
  id: number;
  key: string;
  name: string;
  description: string;
  module: string;
}

// ===== Finance Types =====
export interface BillingLedger {
  id: string;
  projectId: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  description: string;
  invoiceAmount: number;
  gstAmount: number;
  totalAmount: number;
  billReceivedDate: string;
  paymentDueDate: string;
  paymentStatus: string;
  paymentDate: string;
  paymentMode: string;
}

export interface AccrualBudget {
  id: string;
  projectId: string;
  month: string;
  department: string;
  costCategory: string;
  budgetAmount: number;
  actualAccrual: number;
  variance: number;
  notes: string;
}

export interface BillReceived {
  id: string;
  vendorName: string;
  projectId: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  department: string;
  approvalStatus: string;
  approvedBy: string;
  paymentStatus: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMode: string;
  referenceNumber: string;
  projectId: string;
  remarks: string;
  status: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  gstNumber: string;
}

export interface Department {
  id: string;
  name: string;
}

// ===== Dashboard Types =====
export interface DashboardStats {
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  teamMembers: number;
  budgetUtilization: number;
}

// ===== Auth Types =====
export interface AuthSession {
  email: string;
  name: string;
  initials: string;
  role: string;
}
