"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getStatusColor, formatShortDate } from "@/lib/utils";
import { Search, Plus, Pencil, Trash2, Package, Server, HardDrive, Monitor } from "lucide-react";
import type { Asset } from "@/types";

const CATEGORIES = ["All", "Server", "Network", "Storage", "Workstation", "Software", "Vehicle", "Tool", "Other"];
const STATUSES = ["Active", "Maintenance", "Inactive", "Retired", "In Transit"];

export default function AssetsPage() {
  const { assets, fetchAssets, loading } = useAppStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Server", location: "", status: "Active", project: "", serial: "", purchaseDate: "" });

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filtered = assets.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.serial.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Server": return <Server className="w-4 h-4" />;
      case "Storage": return <HardDrive className="w-4 h-4" />;
      case "Workstation": return <Monitor className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const openEdit = (asset: Asset) => {
    setEditAsset(asset);
    setForm({ name: asset.name, category: asset.category, location: asset.location, status: asset.status, project: asset.project, serial: asset.serial, purchaseDate: asset.purchaseDate });
  };

  const openAdd = () => {
    setShowAdd(true);
    setForm({ name: "", category: "Server", location: "", status: "Active", project: "", serial: "", purchaseDate: "" });
  };

  const saveAsset = async () => {
    try {
      if (editAsset) {
        await fetch("/api/assets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editAsset.id, ...form }) });
      } else {
        await fetch("/api/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      fetchAssets();
      setEditAsset(null);
      setShowAdd(false);
    } catch (err) {
      console.error("Failed to save asset:", err);
    }
  };

  const activeCount = assets.filter(a => a.status === "Active").length;
  const maintenanceCount = assets.filter(a => a.status === "Maintenance").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Management</h1>
          <p className="text-slate-400 text-sm">{assets.length} total assets · {activeCount} active · {maintenanceCount} in maintenance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? "bg-amber-500 text-black" : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Package className="w-5 h-5 text-blue-400" /></div><div><p className="text-2xl font-bold text-white">{assets.length}</p><p className="text-xs text-slate-400">Total Assets</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Server className="w-5 h-5 text-emerald-400" /></div><div><p className="text-2xl font-bold text-white">{activeCount}</p><p className="text-xs text-slate-400">Active</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><HardDrive className="w-5 h-5 text-amber-400" /></div><div><p className="text-2xl font-bold text-white">{maintenanceCount}</p><p className="text-xs text-slate-400">Maintenance</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center"><Monitor className="w-5 h-5 text-red-400" /></div><div><p className="text-2xl font-bold text-white">{assets.filter(a => a.status === "Retired").length}</p><p className="text-xs text-slate-400">Retired</p></div></div></CardContent></Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(asset => (
                <TableRow key={asset.id} className="hover:bg-slate-800/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <span className="text-sm font-medium text-white">{asset.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-slate-400">{asset.category}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-400 font-mono">{asset.serial}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-400">{asset.location}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-400">{asset.project}</span></TableCell>
                  <TableCell><Badge className={`${getStatusColor(asset.status)} text-[10px]`}>{asset.status}</Badge></TableCell>
                  <TableCell><span className="text-sm text-slate-400">{formatShortDate(asset.purchaseDate)}</span></TableCell>
                  <TableCell>
                    <button onClick={() => openEdit(asset)} className="text-slate-400 hover:text-amber-400 p-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-slate-500 py-12">No assets found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd || !!editAsset} onOpenChange={() => { setShowAdd(false); setEditAsset(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editAsset ? "Edit Asset" : "Add Asset"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Asset Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Asset name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Serial Number</label>
                <Input value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} placeholder="SN-XXXX" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Purchase Date</label>
                <Input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Location</label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Project</label>
                <Input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Assigned project" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditAsset(null); }}>Cancel</Button>
            <Button onClick={saveAsset}>{editAsset ? "Save Changes" : "Add Asset"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
