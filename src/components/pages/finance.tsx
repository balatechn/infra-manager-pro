"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { Search, Plus, Pencil, DollarSign, Receipt, CreditCard, Building2, LayoutDashboard, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { BillingLedger, AccrualBudget, BillReceived, Payment, Vendor, Department } from "@/types";

type FinanceTab = "dashboard" | "ledger" | "accrual" | "bills" | "payments" | "vendors";

const TABS: { id: FinanceTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "ledger", label: "Billing Ledger", icon: <FileSpreadsheet className="w-4 h-4" /> },
  { id: "accrual", label: "Accrual & Budget", icon: <DollarSign className="w-4 h-4" /> },
  { id: "bills", label: "Bills Received", icon: <Receipt className="w-4 h-4" /> },
  { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { id: "vendors", label: "Vendors", icon: <Building2 className="w-4 h-4" /> },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("dashboard");
  const [ledger, setLedger] = useState<BillingLedger[]>([]);
  const [accruals, setAccruals] = useState<AccrualBudget[]>([]);
  const [bills, setBills] = useState<BillReceived[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (entity: string) => {
    try {
      const res = await fetch(`/api/finance?entity=${entity}`);
      const data = await res.json();
      return data;
    } catch { return []; }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [l, a, b, p, v, d] = await Promise.all([
        fetchData("billing-ledger"),
        fetchData("accrual-budget"),
        fetchData("bills-received"),
        fetchData("payments"),
        fetchData("vendors"),
        fetchData("departments"),
      ]);
      setLedger(l);
      setAccruals(a);
      setBills(b);
      setPayments(p);
      setVendors(v);
      setDepartments(d);
      setLoading(false);
    };
    loadAll();
  }, []);

  const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  // Dashboard stats
  const totalInvoiced = ledger.reduce((s, l) => s + (l.totalAmount || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (p.paymentAmount || 0), 0);
  const totalBudget = accruals.reduce((s, a) => s + (a.budgetAmount || 0), 0);
  const totalActual = accruals.reduce((s, a) => s + (a.actualAccrual || 0), 0);
  const pendingBills = bills.filter(b => b.paymentStatus === "Pending").length;

  const paymentStatusData = (() => {
    const counts: Record<string, number> = {};
    ledger.forEach(l => { counts[l.paymentStatus] = (counts[l.paymentStatus] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance & Billing</h1>
          <p className="text-slate-400 text-sm">Manage invoices, payments, budgets, and vendors</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            <Card><CardContent className="p-4 text-center"><DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{formatCurrency(totalInvoiced)}</p><p className="text-xs text-slate-400">Total Invoiced</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><CreditCard className="w-6 h-6 text-emerald-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{formatCurrency(totalPaid)}</p><p className="text-xs text-slate-400">Total Paid</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><FileSpreadsheet className="w-6 h-6 text-amber-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{formatCurrency(totalBudget)}</p><p className="text-xs text-slate-400">Total Budget</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><Receipt className="w-6 h-6 text-purple-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{pendingBills}</p><p className="text-xs text-slate-400">Pending Bills</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><Building2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{vendors.length}</p><p className="text-xs text-slate-400">Vendors</p></CardContent></Card>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Payment Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={paymentStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                      {paymentStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Budget vs Actual</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={accruals.slice(0, 8).map(a => ({ name: a.month || a.department, budget: a.budgetAmount, actual: a.actualAccrual }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="budget" fill="#3b82f6" name="Budget" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#f59e0b" name="Actual" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Billing Ledger Tab */}
      {activeTab === "ledger" && (
        <LedgerTab data={ledger} search={search} setSearch={setSearch} onRefresh={async () => setLedger(await fetchData("billing-ledger"))} />
      )}

      {/* Accrual & Budget Tab */}
      {activeTab === "accrual" && (
        <AccrualTab data={accruals} search={search} setSearch={setSearch} onRefresh={async () => setAccruals(await fetchData("accrual-budget"))} />
      )}

      {/* Bills Received Tab */}
      {activeTab === "bills" && (
        <BillsTab data={bills} search={search} setSearch={setSearch} onRefresh={async () => setBills(await fetchData("bills-received"))} />
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <PaymentsTab data={payments} search={search} setSearch={setSearch} onRefresh={async () => setPayments(await fetchData("payments"))} />
      )}

      {/* Vendors Tab */}
      {activeTab === "vendors" && (
        <VendorsTab data={vendors} search={search} setSearch={setSearch} onRefresh={async () => setVendors(await fetchData("vendors"))} />
      )}
    </div>
  );
}

// ===== Billing Ledger Sub-tab =====
function LedgerTab({ data, search, setSearch, onRefresh }: { data: BillingLedger[]; search: string; setSearch: (s: string) => void; onRefresh: () => void }) {
  const [editItem, setEditItem] = useState<BillingLedger | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ projectId: "", vendorName: "", invoiceNumber: "", invoiceDate: "", description: "", invoiceAmount: 0, gstAmount: 0, totalAmount: 0, billReceivedDate: "", paymentDueDate: "", paymentStatus: "Pending", paymentDate: "", paymentMode: "" });

  const filtered = data.filter(l => !search || l.vendorName.toLowerCase().includes(search.toLowerCase()) || l.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    const method = editItem ? "PUT" : "POST";
    const body = editItem ? { ...form, id: editItem.id } : form;
    await fetch("/api/finance?entity=billing-ledger", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    onRefresh();
    setEditItem(null);
    setShowAdd(false);
  };

  const openEdit = (item: BillingLedger) => {
    setEditItem(item);
    setForm({ projectId: item.projectId, vendorName: item.vendorName, invoiceNumber: item.invoiceNumber, invoiceDate: item.invoiceDate, description: item.description, invoiceAmount: item.invoiceAmount, gstAmount: item.gstAmount, totalAmount: item.totalAmount, billReceivedDate: item.billReceivedDate, paymentDueDate: item.paymentDueDate, paymentStatus: item.paymentStatus, paymentDate: item.paymentDate, paymentMode: item.paymentMode });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search ledger..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
        <Button onClick={() => { setShowAdd(true); setForm({ projectId: "", vendorName: "", invoiceNumber: "", invoiceDate: "", description: "", invoiceAmount: 0, gstAmount: 0, totalAmount: 0, billReceivedDate: "", paymentDueDate: "", paymentStatus: "Pending", paymentDate: "", paymentMode: "" }); }}><Plus className="w-4 h-4 mr-2" /> Add Entry</Button>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vendor</TableHead><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">GST</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Payment Status</TableHead><TableHead className="w-16">Edit</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm text-white">{l.vendorName}</TableCell>
                  <TableCell className="text-sm text-slate-400 font-mono">{l.invoiceNumber}</TableCell>
                  <TableCell className="text-sm text-slate-400">{formatShortDate(l.invoiceDate)}</TableCell>
                  <TableCell className="text-sm text-slate-400 max-w-[200px] truncate">{l.description}</TableCell>
                  <TableCell className="text-right text-sm text-white">{formatCurrency(l.invoiceAmount)}</TableCell>
                  <TableCell className="text-right text-sm text-slate-400">{formatCurrency(l.gstAmount)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-white">{formatCurrency(l.totalAmount)}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${l.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-400" : l.paymentStatus === "Overdue" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{l.paymentStatus}</Badge></TableCell>
                  <TableCell><button onClick={() => openEdit(l)} className="text-slate-400 hover:text-amber-400"><Pencil className="w-3.5 h-3.5" /></button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showAdd || !!editItem} onOpenChange={() => { setShowAdd(false); setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit Entry" : "Add Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Vendor</label><Input value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Invoice #</label><Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Project ID</label><Input value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Invoice Date</label><Input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} /></div>
            </div>
            <div><label className="text-sm text-slate-400 mb-1 block">Description</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Invoice Amount</label><Input type="number" value={form.invoiceAmount} onChange={(e) => setForm({ ...form, invoiceAmount: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">GST Amount</label><Input type="number" value={form.gstAmount} onChange={(e) => setForm({ ...form, gstAmount: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Total Amount</label><Input type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-400 mb-1 block">Payment Status</label><select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">{["Pending", "Paid", "Overdue", "Partial"].map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className="text-sm text-slate-400 mb-1 block">Payment Mode</label><Input value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} placeholder="NEFT, Cheque..." /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditItem(null); }}>Cancel</Button>
            <Button onClick={save}>{editItem ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ===== Accrual & Budget Sub-tab =====
function AccrualTab({ data, search, setSearch, onRefresh }: { data: AccrualBudget[]; search: string; setSearch: (s: string) => void; onRefresh: () => void }) {
  const filtered = data.filter(a => !search || a.department.toLowerCase().includes(search.toLowerCase()) || a.costCategory.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search accruals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Project</TableHead><TableHead>Month</TableHead><TableHead>Department</TableHead><TableHead>Cost Category</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">Variance</TableHead><TableHead>Notes</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="text-sm text-white">{a.projectId}</TableCell>
                  <TableCell className="text-sm text-slate-400">{a.month}</TableCell>
                  <TableCell className="text-sm text-slate-400">{a.department}</TableCell>
                  <TableCell className="text-sm text-slate-400">{a.costCategory}</TableCell>
                  <TableCell className="text-right text-sm text-white">{formatCurrency(a.budgetAmount)}</TableCell>
                  <TableCell className="text-right text-sm text-white">{formatCurrency(a.actualAccrual)}</TableCell>
                  <TableCell className={`text-right text-sm font-medium ${a.variance >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatCurrency(a.variance)}</TableCell>
                  <TableCell className="text-sm text-slate-400 max-w-[150px] truncate">{a.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

// ===== Bills Received Sub-tab =====
function BillsTab({ data, search, setSearch, onRefresh }: { data: BillReceived[]; search: string; setSearch: (s: string) => void; onRefresh: () => void }) {
  const filtered = data.filter(b => !search || b.vendorName.toLowerCase().includes(search.toLowerCase()) || b.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search bills..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vendor</TableHead><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Department</TableHead><TableHead>Approval</TableHead><TableHead>Payment</TableHead><TableHead>Due Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm text-white">{b.vendorName}</TableCell>
                  <TableCell className="text-sm text-slate-400 font-mono">{b.invoiceNumber}</TableCell>
                  <TableCell className="text-sm text-slate-400">{formatShortDate(b.invoiceDate)}</TableCell>
                  <TableCell className="text-right text-sm text-white">{formatCurrency(b.amount)}</TableCell>
                  <TableCell className="text-sm text-slate-400">{b.department}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${b.approvalStatus === "Approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{b.approvalStatus}</Badge></TableCell>
                  <TableCell><Badge className={`text-[10px] ${b.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{b.paymentStatus}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-400">{formatShortDate(b.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

// ===== Payments Sub-tab =====
function PaymentsTab({ data, search, setSearch, onRefresh }: { data: Payment[]; search: string; setSearch: (s: string) => void; onRefresh: () => void }) {
  const filtered = data.filter(p => !search || p.vendorName.toLowerCase().includes(search.toLowerCase()) || p.referenceNumber.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vendor</TableHead><TableHead>Invoice #</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Date</TableHead><TableHead>Mode</TableHead><TableHead>Reference</TableHead><TableHead>Status</TableHead><TableHead>Remarks</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm text-white">{p.vendorName}</TableCell>
                  <TableCell className="text-sm text-slate-400 font-mono">{p.invoiceNumber}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-white">{formatCurrency(p.paymentAmount)}</TableCell>
                  <TableCell className="text-sm text-slate-400">{formatShortDate(p.paymentDate)}</TableCell>
                  <TableCell className="text-sm text-slate-400">{p.paymentMode}</TableCell>
                  <TableCell className="text-sm text-slate-400 font-mono">{p.referenceNumber}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${p.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-400 max-w-[150px] truncate">{p.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

// ===== Vendors Sub-tab =====
function VendorsTab({ data, search, setSearch, onRefresh }: { data: Vendor[]; search: string; setSearch: (s: string) => void; onRefresh: () => void }) {
  const filtered = data.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vendor Name</TableHead><TableHead>Contact</TableHead><TableHead>Email</TableHead><TableHead>GST Number</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="text-sm font-medium text-white">{v.name}</TableCell>
                  <TableCell className="text-sm text-slate-400">{v.contact}</TableCell>
                  <TableCell className="text-sm text-slate-400">{v.email}</TableCell>
                  <TableCell className="text-sm text-slate-400 font-mono">{v.gstNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
