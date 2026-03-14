"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { Settings, Bell, Puzzle, Shield, CreditCard, Users, Lock, Plus, Pencil, Trash2, Check } from "lucide-react";
import type { User, Role, Permission } from "@/types";

type SettingsTab = "general" | "notifications" | "integrations" | "security" | "billing" | "users" | "roles";

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "integrations", label: "Integrations", icon: <Puzzle className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  { id: "users", label: "User Management", icon: <Users className="w-4 h-4" /> },
  { id: "roles", label: "Roles & Permissions", icon: <Lock className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your application preferences and configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === tab.id ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "integrations" && <IntegrationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "roles" && <RolesPermissions />}
        </div>
      </div>
    </div>
  );
}

// ===== General Settings =====
function GeneralSettings() {
  const session = useAuthStore(s => s.session);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm">Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm text-slate-400 mb-1 block">Organization Name</label><Input defaultValue="Infra Manager Pro" /></div>
          <div><label className="text-sm text-slate-400 mb-1 block">Admin Email</label><Input defaultValue={session?.email || ""} /></div>
          <div><label className="text-sm text-slate-400 mb-1 block">Timezone</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option>Asia/Kolkata (IST)</option><option>UTC</option><option>America/New_York (EST)</option><option>Europe/London (GMT)</option>
            </select>
          </div>
          <div><label className="text-sm text-slate-400 mb-1 block">Currency</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
            </select>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Notification Settings =====
function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailTaskAssigned: true, emailTaskCompleted: true, emailProjectUpdate: false,
    pushTaskAssigned: true, pushDeadline: true, pushMention: true,
  });
  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Notification Preferences</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Email Notifications</h4>
          <div className="space-y-3">
            {[
              { key: "emailTaskAssigned", label: "Task assigned to me" },
              { key: "emailTaskCompleted", label: "Task completed" },
              { key: "emailProjectUpdate", label: "Project status updates" },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{item.label}</span>
                <button onClick={() => toggle(item.key)} className={`w-10 h-5 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? "bg-amber-500" : "bg-slate-700"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Push Notifications</h4>
          <div className="space-y-3">
            {[
              { key: "pushTaskAssigned", label: "New task assignments" },
              { key: "pushDeadline", label: "Approaching deadlines" },
              { key: "pushMention", label: "Mentions and comments" },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{item.label}</span>
                <button onClick={() => toggle(item.key)} className={`w-10 h-5 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? "bg-amber-500" : "bg-slate-700"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Integration Settings =====
function IntegrationSettings() {
  const integrations = [
    { name: "Slack", desc: "Send notifications to Slack channels", connected: false },
    { name: "Microsoft Teams", desc: "Integrate with Teams for collaboration", connected: false },
    { name: "Jira", desc: "Sync tasks bidirectionally with Jira", connected: false },
    { name: "Google Drive", desc: "Attach files from Google Drive", connected: false },
    { name: "GitHub", desc: "Link commits and PRs to tasks", connected: true },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Integrations</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {integrations.map(int => (
          <div key={int.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div>
              <h4 className="text-sm font-medium text-white">{int.name}</h4>
              <p className="text-xs text-slate-400">{int.desc}</p>
            </div>
            <Button variant={int.connected ? "outline" : "default"} size="sm">
              {int.connected ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ===== Security Settings =====
function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm">Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm text-slate-400 mb-1 block">Current Password</label><Input type="password" /></div>
          <div><label className="text-sm text-slate-400 mb-1 block">New Password</label><Input type="password" /></div>
          <div><label className="text-sm text-slate-400 mb-1 block">Confirm New Password</label><Input type="password" /></div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Two-Factor Authentication</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Enable 2FA</p>
              <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Active Sessions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div>
              <p className="text-sm text-white">Current Browser · Windows</p>
              <p className="text-xs text-slate-400">Active now</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Current</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Billing Settings =====
function BillingSettings() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Billing & Plan</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-amber-400">Pro Plan</h4>
              <p className="text-xs text-slate-400">Unlimited projects, team members, and storage</p>
            </div>
            <Badge className="bg-amber-500 text-black text-xs">Active</Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center"><p className="text-xl font-bold text-white">∞</p><p className="text-xs text-slate-400">Projects</p></div>
          <div className="bg-slate-800 rounded-lg p-4 text-center"><p className="text-xl font-bold text-white">∞</p><p className="text-xs text-slate-400">Team Members</p></div>
          <div className="bg-slate-800 rounded-lg p-4 text-center"><p className="text-xl font-bold text-white">50 GB</p><p className="text-xs text-slate-400">Storage</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== User Management =====
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", roleId: 0, status: "Active", department: "", phone: "" });

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(setUsers).catch(() => {});
    fetch("/api/roles").then(r => r.json()).then(setRoles).catch(() => {});
  }, []);

  const refresh = () => fetch("/api/users").then(r => r.json()).then(setUsers).catch(() => {});

  const save = async () => {
    const method = editUser ? "PUT" : "POST";
    const body = editUser ? { ...form, id: editUser.id } : form;
    await fetch("/api/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    refresh();
    setEditUser(null);
    setShowAdd(false);
  };

  const deleteUser = async (id: number) => {
    await fetch("/api/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    refresh();
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, roleId: u.roleId || 0, status: u.status, department: u.department, phone: u.phone });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Users ({users.length})</h3>
        <Button size="sm" onClick={() => { setShowAdd(true); setForm({ name: "", email: "", roleId: 0, status: "Active", department: "", phone: "" }); }}><Plus className="w-4 h-4 mr-1" /> Add User</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell><div className="flex items-center gap-2"><Avatar name={u.name} size="sm" /><span className="text-sm text-white">{u.name}</span></div></TableCell>
                  <TableCell className="text-sm text-slate-400">{u.email}</TableCell>
                  <TableCell>{u.roleName && <Badge style={{ backgroundColor: u.roleColor ? u.roleColor + "20" : undefined, color: u.roleColor || undefined }} className="text-[10px]">{u.roleName}</Badge>}</TableCell>
                  <TableCell className="text-sm text-slate-400">{u.department}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${u.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>{u.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} className="text-slate-400 hover:text-amber-400 p-1"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteUser(u.id)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showAdd || !!editUser} onOpenChange={() => { setShowAdd(false); setEditUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Email</label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Role</label>
                <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: parseInt(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  <option value={0}>No Role</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {["Active", "Inactive", "Suspended"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Department</label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditUser(null); }}>Cancel</Button>
            <Button onClick={save}>{editUser ? "Save" : "Add User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ===== Roles & Permissions =====
function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#f59e0b", permissions: [] as number[] });

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(setRoles).catch(() => {});
    fetch("/api/permissions").then(r => r.json()).then(d => setPermissions(Array.isArray(d) ? d : d.permissions || [])).catch(() => {});
  }, []);

  const refresh = () => fetch("/api/roles").then(r => r.json()).then(setRoles).catch(() => {});

  const save = async () => {
    const method = editRole ? "PUT" : "POST";
    const body = editRole ? { ...form, id: editRole.id } : form;
    await fetch("/api/roles", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    refresh();
    setEditRole(null);
    setShowAdd(false);
  };

  const deleteRole = async (id: number) => {
    await fetch("/api/roles", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    refresh();
  };

  const openEdit = (r: Role) => {
    setEditRole(r);
    setForm({ name: r.name, description: r.description, color: r.color, permissions: r.permissions || [] });
  };

  const togglePermission = (id: number) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) ? prev.permissions.filter(p => p !== id) : [...prev.permissions, id],
    }));
  };

  // Group permissions by module
  const groupedPerms: Record<string, Permission[]> = {};
  permissions.forEach(p => {
    if (!groupedPerms[p.module]) groupedPerms[p.module] = [];
    groupedPerms[p.module].push(p);
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Roles ({roles.length})</h3>
        <Button size="sm" onClick={() => { setShowAdd(true); setForm({ name: "", description: "", color: "#f59e0b", permissions: [] }); }}><Plus className="w-4 h-4 mr-1" /> Add Role</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {roles.map(r => (
          <Card key={r.id} className="hover:border-slate-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <h4 className="text-sm font-medium text-white">{r.name}</h4>
                    {r.isSystem && <Badge className="bg-slate-700 text-[10px]">System</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{r.description}</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>{r.permissionCount || 0} permissions</span>
                    <span>{r.userCount || 0} users</span>
                  </div>
                </div>
                {!r.isSystem && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-amber-400 p-1"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteRole(r.id)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showAdd || !!editRole} onOpenChange={() => { setShowAdd(false); setEditRole(null); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editRole ? "Edit Role" : "Add Role"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Role Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Color</label><Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10" /></div>
            </div>
            <div><label className="text-sm text-slate-400 mb-1 block">Description</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Permissions</label>
              <div className="space-y-4">
                {Object.entries(groupedPerms).map(([module, perms]) => (
                  <div key={module}>
                    <h5 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">{module}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map(p => (
                        <button key={p.id} onClick={() => togglePermission(p.id)} className={`flex items-center gap-2 text-left text-xs p-2 rounded-lg border transition-colors ${form.permissions.includes(p.id) ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${form.permissions.includes(p.id) ? "bg-amber-500 border-amber-500" : "border-slate-600"}`}>
                            {form.permissions.includes(p.id) && <Check className="w-3 h-3 text-black" />}
                          </div>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditRole(null); }}>Cancel</Button>
            <Button onClick={save}>{editRole ? "Save" : "Add Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
