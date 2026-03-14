/* =============================================
   Infra Manager Pro — Finance Module
   Complete sub-page router with 6 views:
   Dashboard, Billing Ledger, Accrual Budget,
   Bills Received, Payments, Reports
   ============================================= */

const FinancePage = {
    currentTab: 'fin-dashboard',
    ledgerData: [],
    accrualData: [],
    billsData: [],
    paymentsData: [],
    vendorsList: [],
    departmentsList: [],

    render() {
        return `
        <div class="finance-layout">
            <!-- Left Sidebar -->
            <div class="finance-sidebar">
                <div class="finance-sidebar-title">Finance Module</div>
                ${this.renderSidebarNav()}
            </div>
            <!-- Main Panel -->
            <div class="finance-main" id="financeMain">
                ${this.renderSubPage()}
            </div>
        </div>`;
    },

    renderSidebarNav() {
        const items = [
            { id: 'fin-dashboard', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', label: 'Dashboard' },
            { id: 'fin-ledger', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', label: 'Billing Ledger' },
            { id: 'fin-accrual', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', label: 'Accrual Budget' },
            { id: 'fin-bills', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', label: 'Bills Received' },
            { id: 'fin-payments', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', label: 'Payments' },
            { id: 'fin-reports', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', label: 'Reports' }
        ];
        return items.map(i => `
            <div class="finance-nav-item ${this.currentTab === i.id ? 'active' : ''}" data-fin-tab="${i.id}">
                ${i.icon}
                <span>${i.label}</span>
            </div>`).join('');
    },

    renderSubPage() {
        switch (this.currentTab) {
            case 'fin-dashboard': return this.renderDashboard();
            case 'fin-ledger': return this.renderLedger();
            case 'fin-accrual': return this.renderAccrual();
            case 'fin-bills': return this.renderBills();
            case 'fin-payments': return this.renderPayments();
            case 'fin-reports': return this.renderReports();
            default: return '';
        }
    },

    switchTab(tabId) {
        this.currentTab = tabId;
        // Update sidebar active
        document.querySelectorAll('.finance-nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.finTab === tabId);
        });
        // Re-render main content
        if (typeof Chart !== 'undefined') {
            Object.values(Chart.instances || {}).forEach(c => c.destroy());
        }
        const main = document.getElementById('financeMain');
        if (main) {
            main.innerHTML = this.renderSubPage();
            this.initSubPage();
        }
    },

    // =========================================
    //  FINANCE DASHBOARD
    // =========================================
    renderDashboard() {
        const totalBudget = this.accrualData.reduce((s, r) => s + Number(r.budget_amount || 0), 0);
        const totalActual = this.accrualData.reduce((s, r) => s + Number(r.actual_accrual || 0), 0);
        const billsPending = this.billsData.filter(b => b.payment_status === 'Unpaid').length;
        const paymentsReleased = this.paymentsData.filter(p => p.status === 'Paid').reduce((s, p) => s + Number(p.payment_amount || 0), 0);
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');

        return `
        <div class="fin-page-header">
            <h2>Finance Dashboard <small>Overview</small></h2>
        </div>

        <div class="fin-kpi-row">
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Total Budget</div>
                <div class="fin-kpi-value">${fmt(totalBudget)}</div>
                <div class="fin-kpi-sub">${this.accrualData.length} accrual entries</div>
            </div>
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Total Accrual</div>
                <div class="fin-kpi-value ${totalActual > totalBudget ? 'danger' : 'success'}">${fmt(totalActual)}</div>
                <div class="fin-kpi-sub">Variance: ${fmt(totalBudget - totalActual)}</div>
            </div>
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Bills Pending</div>
                <div class="fin-kpi-value warning">${billsPending}</div>
                <div class="fin-kpi-sub">${this.billsData.length} total bills</div>
            </div>
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Payments Released</div>
                <div class="fin-kpi-value success">${fmt(paymentsReleased)}</div>
                <div class="fin-kpi-sub">${this.paymentsData.filter(p => p.status === 'Paid').length} payments</div>
            </div>
        </div>

        <div class="fin-charts-grid">
            <div class="fin-chart-card">
                <h4>Monthly Expense Trend</h4>
                <canvas id="finExpenseTrendChart"></canvas>
            </div>
            <div class="fin-chart-card">
                <h4>Project Budget Utilization</h4>
                <canvas id="finBudgetUtilChart"></canvas>
            </div>
            <div class="fin-chart-card">
                <h4>Vendor Payment Status</h4>
                <canvas id="finVendorPayChart"></canvas>
            </div>
            <div class="fin-chart-card">
                <h4>Department Expense Breakdown</h4>
                <canvas id="finDeptExpenseChart"></canvas>
            </div>
        </div>`;
    },

    initDashboardCharts() {
        const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94A3B8', font: { size: 11 } } } }, scales: { x: { ticks: { color: '#64748B', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#64748B', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } } } };

        // Monthly Expense Trend
        const months = ['Jan', 'Feb', 'Mar'];
        const budgetByMonth = months.map((_, i) => {
            const m = '2026-0' + (i + 1);
            return this.accrualData.filter(r => r.month === m).reduce((s, r) => s + Number(r.budget_amount || 0), 0);
        });
        const actualByMonth = months.map((_, i) => {
            const m = '2026-0' + (i + 1);
            return this.accrualData.filter(r => r.month === m).reduce((s, r) => s + Number(r.actual_accrual || 0), 0);
        });
        const el1 = document.getElementById('finExpenseTrendChart');
        if (el1) {
            new Chart(el1, {
                type: 'line',
                data: {
                    labels: months.map(m => m + ' 2026'),
                    datasets: [
                        { label: 'Budget', data: budgetByMonth, borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 },
                        { label: 'Actual', data: actualByMonth, borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.3 }
                    ]
                },
                options: chartOpts
            });
        }

        // Project Budget Utilization
        const projectBudgets = {};
        const projectActuals = {};
        this.accrualData.forEach(r => {
            const pName = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id;
            projectBudgets[pName] = (projectBudgets[pName] || 0) + Number(r.budget_amount || 0);
            projectActuals[pName] = (projectActuals[pName] || 0) + Number(r.actual_accrual || 0);
        });
        const el2 = document.getElementById('finBudgetUtilChart');
        if (el2) {
            new Chart(el2, {
                type: 'bar',
                data: {
                    labels: Object.keys(projectBudgets),
                    datasets: [
                        { label: 'Budget', data: Object.values(projectBudgets), backgroundColor: '#3B82F6' },
                        { label: 'Actual', data: Object.keys(projectBudgets).map(k => projectActuals[k] || 0), backgroundColor: '#F59E0B' }
                    ]
                },
                options: { ...chartOpts, indexAxis: 'y' }
            });
        }

        // Vendor Payment Status (Doughnut)
        const vendorStatus = {};
        this.paymentsData.forEach(p => {
            vendorStatus[p.status] = (vendorStatus[p.status] || 0) + 1;
        });
        const el3 = document.getElementById('finVendorPayChart');
        if (el3) {
            const colors = { 'Paid': '#22C55E', 'Processing': '#A855F7', 'Pending': '#F59E0B' };
            new Chart(el3, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(vendorStatus),
                    datasets: [{ data: Object.values(vendorStatus), backgroundColor: Object.keys(vendorStatus).map(k => colors[k] || '#64748B'), borderWidth: 0 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 11 } } } } }
            });
        }

        // Dept Expense
        const deptExp = {};
        this.accrualData.forEach(r => {
            deptExp[r.department || 'Other'] = (deptExp[r.department || 'Other'] || 0) + Number(r.actual_accrual || 0);
        });
        const el4 = document.getElementById('finDeptExpenseChart');
        if (el4) {
            const deptColors = ['#3B82F6', '#F59E0B', '#22C55E', '#A855F7', '#EF4444'];
            new Chart(el4, {
                type: 'bar',
                data: {
                    labels: Object.keys(deptExp),
                    datasets: [{ label: 'Expense', data: Object.values(deptExp), backgroundColor: deptColors.slice(0, Object.keys(deptExp).length) }]
                },
                options: chartOpts
            });
        }
    },

    // =========================================
    //  BILLING LEDGER
    // =========================================
    renderLedger() {
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
        const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
        const statusBadge = s => `<span class="fin-badge ${(s || '').toLowerCase()}">${s}</span>`;

        return `
        <div class="fin-page-header">
            <h2>Billing Ledger <small>Vendor Invoices</small></h2>
            <div class="fin-page-actions">
                <button class="btn btn-outline btn-sm" onclick="FinancePage.exportLedgerExcel()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Excel
                </button>
                <button class="btn btn-primary btn-sm" onclick="FinancePage.openLedgerModal()">+ New Invoice</button>
            </div>
        </div>

        <div class="fin-filter-row">
            <input type="text" class="fin-filter-input" id="ledgerSearch" placeholder="Search invoice..." style="width:200px;">
            <select class="fin-filter-input" id="ledgerVendorFilter"><option value="">All Vendors</option>${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select>
            <select class="fin-filter-input" id="ledgerProjectFilter"><option value="">All Projects</option>${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <select class="fin-filter-input" id="ledgerStatusFilter"><option value="">All Status</option><option>Pending</option><option>Approved</option><option>Paid</option></select>
        </div>

        <div class="fin-table-wrap">
            <table class="fin-table" id="ledgerTable">
                <thead><tr>
                    <th>Invoice No</th><th>Vendor</th><th>Project</th><th>Description</th><th>Amount</th><th>GST</th><th>Total</th><th>Due Date</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                    ${this.ledgerData.map(r => {
                        const proj = AppData.projects.find(p => p.id === r.project_id);
                        return `<tr>
                            <td><strong>${r.invoice_number}</strong></td>
                            <td>${r.vendor_name}</td>
                            <td>${proj ? proj.name : r.project_id || '—'}</td>
                            <td>${r.description || '—'}</td>
                            <td class="amount">${fmt(r.invoice_amount)}</td>
                            <td class="amount">${fmt(r.gst_amount)}</td>
                            <td class="amount" style="font-weight:700">${fmt(r.total_amount)}</td>
                            <td>${fmtDate(r.payment_due_date)}</td>
                            <td>${statusBadge(r.payment_status)}</td>
                            <td class="fin-actions">
                                <button class="fin-action-btn" onclick="FinancePage.editLedger('${r.id}')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                <button class="fin-action-btn delete" onclick="FinancePage.deleteLedger('${r.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Ledger Modal -->
        <div class="fin-modal-overlay" id="ledgerModalOverlay">
            <div class="fin-modal">
                <div class="fin-modal-header">
                    <h3 id="ledgerModalTitle">New Invoice</h3>
                    <button class="modal-close" onclick="FinancePage.closeLedgerModal()">&times;</button>
                </div>
                <div class="fin-modal-body">
                    <input type="hidden" id="lmId">
                    <div class="form-row">
                        <div class="form-group"><label>Invoice Number</label><input type="text" class="form-input" id="lmInvoiceNo" placeholder="INV-2026-XXX"></div>
                        <div class="form-group"><label>Invoice Date</label><input type="date" class="form-input" id="lmInvoiceDate"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Vendor</label><select class="form-input" id="lmVendor">${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Project</label><select class="form-input" id="lmProject">${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
                    </div>
                    <div class="form-group"><label>Description</label><input type="text" class="form-input" id="lmDesc" placeholder="Description of items/services"></div>
                    <div class="form-row">
                        <div class="form-group"><label>Invoice Amount</label><input type="number" class="form-input" id="lmAmount" placeholder="0" oninput="FinancePage.calcLedgerTotal()"></div>
                        <div class="form-group"><label>GST Amount</label><input type="number" class="form-input" id="lmGST" placeholder="0" oninput="FinancePage.calcLedgerTotal()"></div>
                        <div class="form-group"><label>Total Amount</label><input type="number" class="form-input" id="lmTotal" readonly style="font-weight:700"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Bill Received Date</label><input type="date" class="form-input" id="lmReceivedDate"></div>
                        <div class="form-group"><label>Payment Due Date</label><input type="date" class="form-input" id="lmDueDate"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Payment Status</label><select class="form-input" id="lmPayStatus"><option>Pending</option><option>Approved</option><option>Paid</option></select></div>
                        <div class="form-group"><label>Payment Mode</label><select class="form-input" id="lmPayMode"><option value="">—</option><option>NEFT</option><option>RTGS</option><option>UPI</option><option>Cheque</option><option>Cash</option></select></div>
                    </div>
                    <div class="form-group"><label>Payment Date</label><input type="date" class="form-input" id="lmPayDate"></div>
                </div>
                <div class="fin-modal-footer">
                    <button class="btn btn-secondary" onclick="FinancePage.closeLedgerModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="FinancePage.saveLedger()">Save</button>
                </div>
            </div>
        </div>`;
    },

    calcLedgerTotal() {
        const a = parseFloat(document.getElementById('lmAmount').value) || 0;
        const g = parseFloat(document.getElementById('lmGST').value) || 0;
        document.getElementById('lmTotal').value = (a + g).toFixed(2);
    },

    openLedgerModal(data) {
        document.getElementById('ledgerModalTitle').textContent = data ? 'Edit Invoice' : 'New Invoice';
        document.getElementById('lmId').value = data ? data.id : '';
        document.getElementById('lmInvoiceNo').value = data ? data.invoice_number : '';
        document.getElementById('lmInvoiceDate').value = data ? (data.invoice_date || '').slice(0, 10) : '';
        document.getElementById('lmVendor').value = data ? data.vendor_name : (this.vendorsList[0] || {}).name || '';
        document.getElementById('lmProject').value = data ? data.project_id : AppData.projects[0]?.id || '';
        document.getElementById('lmDesc').value = data ? data.description : '';
        document.getElementById('lmAmount').value = data ? data.invoice_amount : '';
        document.getElementById('lmGST').value = data ? data.gst_amount : '';
        document.getElementById('lmTotal').value = data ? data.total_amount : '';
        document.getElementById('lmReceivedDate').value = data ? (data.bill_received_date || '').slice(0, 10) : '';
        document.getElementById('lmDueDate').value = data ? (data.payment_due_date || '').slice(0, 10) : '';
        document.getElementById('lmPayStatus').value = data ? data.payment_status : 'Pending';
        document.getElementById('lmPayMode').value = data ? data.payment_mode : '';
        document.getElementById('lmPayDate').value = data ? (data.payment_date || '').slice(0, 10) : '';
        document.getElementById('ledgerModalOverlay').classList.add('open');
    },

    closeLedgerModal() {
        document.getElementById('ledgerModalOverlay').classList.remove('open');
    },

    editLedger(id) {
        const rec = this.ledgerData.find(r => r.id === id);
        if (rec) this.openLedgerModal(rec);
    },

    async saveLedger() {
        const id = document.getElementById('lmId').value || ('BL' + Date.now().toString().slice(-6));
        const payload = {
            id,
            project_id: document.getElementById('lmProject').value,
            vendor_name: document.getElementById('lmVendor').value,
            invoice_number: document.getElementById('lmInvoiceNo').value,
            invoice_date: document.getElementById('lmInvoiceDate').value || null,
            description: document.getElementById('lmDesc').value,
            invoice_amount: parseFloat(document.getElementById('lmAmount').value) || 0,
            gst_amount: parseFloat(document.getElementById('lmGST').value) || 0,
            total_amount: parseFloat(document.getElementById('lmTotal').value) || 0,
            bill_received_date: document.getElementById('lmReceivedDate').value || null,
            payment_due_date: document.getElementById('lmDueDate').value || null,
            payment_status: document.getElementById('lmPayStatus').value,
            payment_date: document.getElementById('lmPayDate').value || null,
            payment_mode: document.getElementById('lmPayMode').value
        };
        if (!payload.invoice_number) { alert('Invoice number is required'); return; }
        try {
            const isEdit = document.getElementById('lmId').value;
            const res = await fetch('/api/billing-ledger', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to save');
            this.closeLedgerModal();
            await this.loadData();
            this.switchTab('fin-ledger');
        } catch (e) { alert('Error: ' + e.message); }
    },

    async deleteLedger(id) {
        if (!confirm('Delete this invoice record?')) return;
        try {
            await fetch('/api/billing-ledger', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            await this.loadData();
            this.switchTab('fin-ledger');
        } catch (e) { alert('Error: ' + e.message); }
    },

    exportLedgerExcel() {
        const rows = [['Invoice No', 'Vendor', 'Project', 'Description', 'Amount', 'GST', 'Total', 'Due Date', 'Status']];
        this.ledgerData.forEach(r => {
            const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '';
            rows.push([r.invoice_number, r.vendor_name, proj, r.description, r.invoice_amount, r.gst_amount, r.total_amount, r.payment_due_date || '', r.payment_status]);
        });
        this._downloadCSV(rows, 'Billing_Ledger.csv');
    },

    // =========================================
    //  ACCRUAL BUDGET
    // =========================================
    renderAccrual() {
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
        const totalBudget = this.accrualData.reduce((s, r) => s + Number(r.budget_amount || 0), 0);
        const totalActual = this.accrualData.reduce((s, r) => s + Number(r.actual_accrual || 0), 0);
        const totalVariance = totalBudget - totalActual;

        return `
        <div class="fin-page-header">
            <h2>Accrual Budget <small>Monthly Cost Tracking</small></h2>
            <div class="fin-page-actions">
                <button class="btn btn-outline btn-sm" onclick="FinancePage.exportAccrualExcel()">Export Excel</button>
                <button class="btn btn-primary btn-sm" onclick="FinancePage.openAccrualModal()">+ New Entry</button>
            </div>
        </div>

        <div class="fin-kpi-row" style="grid-template-columns:repeat(3,1fr)">
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Total Budget</div>
                <div class="fin-kpi-value">${fmt(totalBudget)}</div>
            </div>
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Total Actual</div>
                <div class="fin-kpi-value ${totalActual > totalBudget ? 'danger' : ''}">${fmt(totalActual)}</div>
            </div>
            <div class="fin-kpi-card">
                <div class="fin-kpi-label">Total Variance</div>
                <div class="fin-kpi-value ${totalVariance < 0 ? 'danger' : 'success'}">${fmt(totalVariance)}</div>
            </div>
        </div>

        <div class="fin-charts-grid" style="margin-bottom:20px;">
            <div class="fin-chart-card"><h4>Budget vs Actual by Month</h4><canvas id="accrualMonthChart"></canvas></div>
            <div class="fin-chart-card"><h4>Cost Category Breakdown</h4><canvas id="accrualCatChart"></canvas></div>
        </div>

        <div class="fin-filter-row">
            <select class="fin-filter-input" id="accrualProjectFilter"><option value="">All Projects</option>${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
            <select class="fin-filter-input" id="accrualMonthFilter"><option value="">All Months</option><option value="2026-01">Jan 2026</option><option value="2026-02">Feb 2026</option><option value="2026-03">Mar 2026</option></select>
            <select class="fin-filter-input" id="accrualCatFilter"><option value="">All Categories</option><option>Infra</option><option>Software</option><option>Vendor</option><option>Misc</option></select>
        </div>

        <div class="fin-table-wrap">
            <table class="fin-table" id="accrualTable">
                <thead><tr><th>Month</th><th>Project</th><th>Department</th><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th><th>Notes</th><th>Actions</th></tr></thead>
                <tbody>
                    ${this.accrualData.map(r => {
                        const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '—';
                        const v = Number(r.variance || 0);
                        return `<tr>
                            <td><strong>${r.month}</strong></td>
                            <td>${proj}</td>
                            <td>${r.department || '—'}</td>
                            <td>${r.cost_category || '—'}</td>
                            <td class="amount">${fmt(r.budget_amount)}</td>
                            <td class="amount">${fmt(r.actual_accrual)}</td>
                            <td class="amount ${v >= 0 ? 'positive' : 'negative'}">${v >= 0 ? '+' : ''}${fmt(v)}</td>
                            <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.notes || ''}">${r.notes || '—'}</td>
                            <td class="fin-actions">
                                <button class="fin-action-btn" onclick="FinancePage.editAccrual('${r.id}')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                <button class="fin-action-btn delete" onclick="FinancePage.deleteAccrual('${r.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Accrual Modal -->
        <div class="fin-modal-overlay" id="accrualModalOverlay">
            <div class="fin-modal">
                <div class="fin-modal-header"><h3 id="accrualModalTitle">New Accrual Entry</h3><button class="modal-close" onclick="FinancePage.closeAccrualModal()">&times;</button></div>
                <div class="fin-modal-body">
                    <input type="hidden" id="amId">
                    <div class="form-row">
                        <div class="form-group"><label>Month</label><input type="month" class="form-input" id="amMonth"></div>
                        <div class="form-group"><label>Project</label><select class="form-input" id="amProject">${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Department</label><select class="form-input" id="amDept">${this.departmentsList.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Cost Category</label><select class="form-input" id="amCat"><option>Infra</option><option>Software</option><option>Vendor</option><option>Misc</option></select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Budget Amount</label><input type="number" class="form-input" id="amBudget" placeholder="0"></div>
                        <div class="form-group"><label>Actual Accrual</label><input type="number" class="form-input" id="amActual" placeholder="0"></div>
                    </div>
                    <div class="form-group"><label>Notes</label><input type="text" class="form-input" id="amNotes" placeholder="Notes..."></div>
                </div>
                <div class="fin-modal-footer">
                    <button class="btn btn-secondary" onclick="FinancePage.closeAccrualModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="FinancePage.saveAccrual()">Save</button>
                </div>
            </div>
        </div>`;
    },

    openAccrualModal(data) {
        document.getElementById('accrualModalTitle').textContent = data ? 'Edit Accrual Entry' : 'New Accrual Entry';
        document.getElementById('amId').value = data ? data.id : '';
        document.getElementById('amMonth').value = data ? data.month : '';
        document.getElementById('amProject').value = data ? data.project_id : AppData.projects[0]?.id || '';
        document.getElementById('amDept').value = data ? data.department : (this.departmentsList[0] || {}).name || '';
        document.getElementById('amCat').value = data ? data.cost_category : 'Infra';
        document.getElementById('amBudget').value = data ? data.budget_amount : '';
        document.getElementById('amActual').value = data ? data.actual_accrual : '';
        document.getElementById('amNotes').value = data ? data.notes : '';
        document.getElementById('accrualModalOverlay').classList.add('open');
    },
    closeAccrualModal() { document.getElementById('accrualModalOverlay').classList.remove('open'); },
    editAccrual(id) { const r = this.accrualData.find(x => x.id === id); if (r) this.openAccrualModal(r); },

    async saveAccrual() {
        const id = document.getElementById('amId').value || ('AC' + Date.now().toString().slice(-6));
        const payload = {
            id,
            project_id: document.getElementById('amProject').value,
            month: document.getElementById('amMonth').value,
            department: document.getElementById('amDept').value,
            cost_category: document.getElementById('amCat').value,
            budget_amount: parseFloat(document.getElementById('amBudget').value) || 0,
            actual_accrual: parseFloat(document.getElementById('amActual').value) || 0,
            notes: document.getElementById('amNotes').value
        };
        if (!payload.month) { alert('Month is required'); return; }
        try {
            const isEdit = document.getElementById('amId').value;
            await fetch('/api/accrual-budget', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            this.closeAccrualModal();
            await this.loadData();
            this.switchTab('fin-accrual');
        } catch (e) { alert('Error: ' + e.message); }
    },

    async deleteAccrual(id) {
        if (!confirm('Delete this accrual entry?')) return;
        try {
            await fetch('/api/accrual-budget', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            await this.loadData();
            this.switchTab('fin-accrual');
        } catch (e) { alert('Error: ' + e.message); }
    },

    exportAccrualExcel() {
        const rows = [['Month', 'Project', 'Department', 'Category', 'Budget', 'Actual', 'Variance', 'Notes']];
        this.accrualData.forEach(r => {
            const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '';
            rows.push([r.month, proj, r.department, r.cost_category, r.budget_amount, r.actual_accrual, r.variance, r.notes]);
        });
        this._downloadCSV(rows, 'Accrual_Budget.csv');
    },

    initAccrualCharts() {
        const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94A3B8', font: { size: 11 } } } }, scales: { x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.03)' } }, y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } } } };
        const months = [...new Set(this.accrualData.map(r => r.month))].sort();
        const budgetByMonth = months.map(m => this.accrualData.filter(r => r.month === m).reduce((s, r) => s + Number(r.budget_amount || 0), 0));
        const actualByMonth = months.map(m => this.accrualData.filter(r => r.month === m).reduce((s, r) => s + Number(r.actual_accrual || 0), 0));
        const el1 = document.getElementById('accrualMonthChart');
        if (el1) new Chart(el1, { type: 'bar', data: { labels: months, datasets: [{ label: 'Budget', data: budgetByMonth, backgroundColor: '#3B82F6' }, { label: 'Actual', data: actualByMonth, backgroundColor: '#F59E0B' }] }, options: chartOpts });
        const catData = {};
        this.accrualData.forEach(r => { catData[r.cost_category || 'Other'] = (catData[r.cost_category || 'Other'] || 0) + Number(r.actual_accrual || 0); });
        const el2 = document.getElementById('accrualCatChart');
        if (el2) new Chart(el2, { type: 'doughnut', data: { labels: Object.keys(catData), datasets: [{ data: Object.values(catData), backgroundColor: ['#3B82F6', '#F59E0B', '#22C55E', '#A855F7'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8' } } } } });
    },

    // =========================================
    //  BILLS RECEIVED
    // =========================================
    renderBills() {
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
        const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

        return `
        <div class="fin-page-header">
            <h2>Bills Received <small>Vendor Bill Tracking</small></h2>
            <div class="fin-page-actions">
                <button class="btn btn-primary btn-sm" onclick="FinancePage.openBillModal()">+ New Bill</button>
            </div>
        </div>

        <!-- Workflow -->
        <div class="fin-workflow">
            <div class="fin-workflow-step done"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Bill Received</div>
            <span class="fin-workflow-arrow">→</span>
            <div class="fin-workflow-step active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/></svg> Finance Verification</div>
            <span class="fin-workflow-arrow">→</span>
            <div class="fin-workflow-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Manager Approval</div>
            <span class="fin-workflow-arrow">→</span>
            <div class="fin-workflow-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> Payment Release</div>
        </div>

        <div class="fin-filter-row">
            <select class="fin-filter-input" id="billsApprovalFilter"><option value="">All Approval</option><option>Pending</option><option>Verified</option><option>Approved</option><option>Rejected</option></select>
            <select class="fin-filter-input" id="billsPayFilter"><option value="">All Payment</option><option>Unpaid</option><option>Processing</option><option>Paid</option></select>
            <select class="fin-filter-input" id="billsVendorFilter"><option value="">All Vendors</option>${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select>
        </div>

        <div class="fin-table-wrap">
            <table class="fin-table">
                <thead><tr><th>Bill ID</th><th>Vendor</th><th>Project</th><th>Invoice No</th><th>Amount</th><th>Department</th><th>Approval</th><th>Approved By</th><th>Payment</th><th>Due Date</th><th>Actions</th></tr></thead>
                <tbody>
                    ${this.billsData.map(r => {
                        const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '—';
                        return `<tr>
                            <td><strong>${r.id}</strong></td>
                            <td>${r.vendor_name}</td>
                            <td>${proj}</td>
                            <td>${r.invoice_number}</td>
                            <td class="amount">${fmt(r.amount)}</td>
                            <td>${r.department || '—'}</td>
                            <td><span class="fin-badge ${(r.approval_status || '').toLowerCase()}">${r.approval_status}</span></td>
                            <td>${r.approved_by || '—'}</td>
                            <td><span class="fin-badge ${(r.payment_status || '').toLowerCase()}">${r.payment_status}</span></td>
                            <td>${fmtDate(r.due_date)}</td>
                            <td class="fin-actions">
                                <button class="fin-action-btn" onclick="FinancePage.editBill('${r.id}')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                <button class="fin-action-btn delete" onclick="FinancePage.deleteBill('${r.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Bill Modal -->
        <div class="fin-modal-overlay" id="billModalOverlay">
            <div class="fin-modal">
                <div class="fin-modal-header"><h3 id="billModalTitle">New Bill</h3><button class="modal-close" onclick="FinancePage.closeBillModal()">&times;</button></div>
                <div class="fin-modal-body">
                    <input type="hidden" id="bmId">
                    <div class="form-row">
                        <div class="form-group"><label>Vendor</label><select class="form-input" id="bmVendor">${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Project</label><select class="form-input" id="bmProject">${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Invoice Number</label><input type="text" class="form-input" id="bmInvoiceNo"></div>
                        <div class="form-group"><label>Invoice Date</label><input type="date" class="form-input" id="bmInvoiceDate"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Amount</label><input type="number" class="form-input" id="bmAmount" placeholder="0"></div>
                        <div class="form-group"><label>Department</label><select class="form-input" id="bmDept">${this.departmentsList.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Approval Status</label><select class="form-input" id="bmApproval"><option>Pending</option><option>Verified</option><option>Approved</option><option>Rejected</option></select></div>
                        <div class="form-group"><label>Approved By</label><select class="form-input" id="bmApprovedBy"><option value="">—</option>${(AppData.team || []).map(m => `<option value="${m.name}">${m.name}</option>`).join('')}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Payment Status</label><select class="form-input" id="bmPayStatus"><option>Unpaid</option><option>Processing</option><option>Paid</option></select></div>
                        <div class="form-group"><label>Due Date</label><input type="date" class="form-input" id="bmDueDate"></div>
                    </div>
                </div>
                <div class="fin-modal-footer">
                    <button class="btn btn-secondary" onclick="FinancePage.closeBillModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="FinancePage.saveBill()">Save</button>
                </div>
            </div>
        </div>`;
    },

    openBillModal(data) {
        document.getElementById('billModalTitle').textContent = data ? 'Edit Bill' : 'New Bill';
        document.getElementById('bmId').value = data ? data.id : '';
        document.getElementById('bmVendor').value = data ? data.vendor_name : (this.vendorsList[0] || {}).name || '';
        document.getElementById('bmProject').value = data ? data.project_id : AppData.projects[0]?.id || '';
        document.getElementById('bmInvoiceNo').value = data ? data.invoice_number : '';
        document.getElementById('bmInvoiceDate').value = data ? (data.invoice_date || '').slice(0, 10) : '';
        document.getElementById('bmAmount').value = data ? data.amount : '';
        document.getElementById('bmDept').value = data ? data.department : (this.departmentsList[0] || {}).name || '';
        document.getElementById('bmApproval').value = data ? data.approval_status : 'Pending';
        document.getElementById('bmApprovedBy').value = data ? data.approved_by : '';
        document.getElementById('bmPayStatus').value = data ? data.payment_status : 'Unpaid';
        document.getElementById('bmDueDate').value = data ? (data.due_date || '').slice(0, 10) : '';
        document.getElementById('billModalOverlay').classList.add('open');
    },
    closeBillModal() { document.getElementById('billModalOverlay').classList.remove('open'); },
    editBill(id) { const r = this.billsData.find(x => x.id === id); if (r) this.openBillModal(r); },

    async saveBill() {
        const id = document.getElementById('bmId').value || ('BR' + Date.now().toString().slice(-6));
        const payload = {
            id,
            vendor_name: document.getElementById('bmVendor').value,
            project_id: document.getElementById('bmProject').value,
            invoice_number: document.getElementById('bmInvoiceNo').value,
            invoice_date: document.getElementById('bmInvoiceDate').value || null,
            amount: parseFloat(document.getElementById('bmAmount').value) || 0,
            department: document.getElementById('bmDept').value,
            approval_status: document.getElementById('bmApproval').value,
            approved_by: document.getElementById('bmApprovedBy').value,
            payment_status: document.getElementById('bmPayStatus').value,
            due_date: document.getElementById('bmDueDate').value || null
        };
        if (!payload.invoice_number) { alert('Invoice number is required'); return; }
        try {
            const isEdit = document.getElementById('bmId').value;
            await fetch('/api/bills-received', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            this.closeBillModal();
            await this.loadData();
            this.switchTab('fin-bills');
        } catch (e) { alert('Error: ' + e.message); }
    },

    async deleteBill(id) {
        if (!confirm('Delete this bill record?')) return;
        try {
            await fetch('/api/bills-received', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            await this.loadData();
            this.switchTab('fin-bills');
        } catch (e) { alert('Error: ' + e.message); }
    },

    // =========================================
    //  PAYMENTS
    // =========================================
    renderPayments() {
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
        const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

        return `
        <div class="fin-page-header">
            <h2>Payment Tracker <small>Vendor Payments</small></h2>
            <div class="fin-page-actions">
                <button class="btn btn-primary btn-sm" onclick="FinancePage.openPaymentModal()">+ New Payment</button>
            </div>
        </div>

        <div class="fin-filter-row">
            <select class="fin-filter-input" id="payStatusFilter"><option value="">All Status</option><option>Pending</option><option>Processing</option><option>Paid</option></select>
            <select class="fin-filter-input" id="payVendorFilter"><option value="">All Vendors</option>${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select>
        </div>

        <div class="fin-table-wrap">
            <table class="fin-table">
                <thead><tr><th>Payment ID</th><th>Vendor</th><th>Invoice No</th><th>Amount</th><th>Date</th><th>Mode</th><th>Ref No</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    ${this.paymentsData.map(r => {
                        const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '—';
                        return `<tr>
                            <td><strong>${r.id}</strong></td>
                            <td>${r.vendor_name}</td>
                            <td>${r.invoice_number || '—'}</td>
                            <td class="amount" style="font-weight:700">${fmt(r.payment_amount)}</td>
                            <td>${fmtDate(r.payment_date)}</td>
                            <td>${r.payment_mode || '—'}</td>
                            <td>${r.reference_number || '—'}</td>
                            <td>${proj}</td>
                            <td><span class="fin-badge ${(r.status || '').toLowerCase()}">${r.status}</span></td>
                            <td class="fin-actions">
                                <button class="fin-action-btn" onclick="FinancePage.editPayment('${r.id}')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                <button class="fin-action-btn delete" onclick="FinancePage.deletePayment('${r.id}')" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Payment Modal -->
        <div class="fin-modal-overlay" id="paymentModalOverlay">
            <div class="fin-modal">
                <div class="fin-modal-header"><h3 id="paymentModalTitle">New Payment</h3><button class="modal-close" onclick="FinancePage.closePaymentModal()">&times;</button></div>
                <div class="fin-modal-body">
                    <input type="hidden" id="pmId">
                    <div class="form-row">
                        <div class="form-group"><label>Vendor</label><select class="form-input" id="pmVendor">${this.vendorsList.map(v => `<option value="${v.name}">${v.name}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Invoice Number</label><input type="text" class="form-input" id="pmInvoiceNo"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Payment Amount</label><input type="number" class="form-input" id="pmAmount" placeholder="0"></div>
                        <div class="form-group"><label>Payment Date</label><input type="date" class="form-input" id="pmDate"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Payment Mode</label><select class="form-input" id="pmMode"><option value="">—</option><option>NEFT</option><option>RTGS</option><option>UPI</option><option>Cheque</option><option>Cash</option></select></div>
                        <div class="form-group"><label>Reference Number</label><input type="text" class="form-input" id="pmRef" placeholder="e.g. NEFT-XXX"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Project</label><select class="form-input" id="pmProject">${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Status</label><select class="form-input" id="pmStatus"><option>Pending</option><option>Processing</option><option>Paid</option></select></div>
                    </div>
                    <div class="form-group"><label>Remarks</label><input type="text" class="form-input" id="pmRemarks" placeholder="Remarks..."></div>
                </div>
                <div class="fin-modal-footer">
                    <button class="btn btn-secondary" onclick="FinancePage.closePaymentModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="FinancePage.savePayment()">Save</button>
                </div>
            </div>
        </div>`;
    },

    openPaymentModal(data) {
        document.getElementById('paymentModalTitle').textContent = data ? 'Edit Payment' : 'New Payment';
        document.getElementById('pmId').value = data ? data.id : '';
        document.getElementById('pmVendor').value = data ? data.vendor_name : (this.vendorsList[0] || {}).name || '';
        document.getElementById('pmInvoiceNo').value = data ? data.invoice_number : '';
        document.getElementById('pmAmount').value = data ? data.payment_amount : '';
        document.getElementById('pmDate').value = data ? (data.payment_date || '').slice(0, 10) : '';
        document.getElementById('pmMode').value = data ? data.payment_mode : '';
        document.getElementById('pmRef').value = data ? data.reference_number : '';
        document.getElementById('pmProject').value = data ? data.project_id : AppData.projects[0]?.id || '';
        document.getElementById('pmStatus').value = data ? data.status : 'Pending';
        document.getElementById('pmRemarks').value = data ? data.remarks : '';
        document.getElementById('paymentModalOverlay').classList.add('open');
    },
    closePaymentModal() { document.getElementById('paymentModalOverlay').classList.remove('open'); },
    editPayment(id) { const r = this.paymentsData.find(x => x.id === id); if (r) this.openPaymentModal(r); },

    async savePayment() {
        const id = document.getElementById('pmId').value || ('PAY' + Date.now().toString().slice(-6));
        const payload = {
            id,
            vendor_name: document.getElementById('pmVendor').value,
            invoice_number: document.getElementById('pmInvoiceNo').value,
            payment_amount: parseFloat(document.getElementById('pmAmount').value) || 0,
            payment_date: document.getElementById('pmDate').value || null,
            payment_mode: document.getElementById('pmMode').value,
            reference_number: document.getElementById('pmRef').value,
            project_id: document.getElementById('pmProject').value,
            remarks: document.getElementById('pmRemarks').value,
            status: document.getElementById('pmStatus').value
        };
        try {
            const isEdit = document.getElementById('pmId').value;
            await fetch('/api/payments', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            this.closePaymentModal();
            await this.loadData();
            this.switchTab('fin-payments');
        } catch (e) { alert('Error: ' + e.message); }
    },

    async deletePayment(id) {
        if (!confirm('Delete this payment record?')) return;
        try {
            await fetch('/api/payments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            await this.loadData();
            this.switchTab('fin-payments');
        } catch (e) { alert('Error: ' + e.message); }
    },

    // =========================================
    //  REPORTS
    // =========================================
    renderReports() {
        return `
        <div class="fin-page-header">
            <h2>Financial Reports <small>Generate & Export</small></h2>
        </div>

        <div class="fin-report-grid">
            <div class="fin-report-card" onclick="FinancePage.generateReport('accrual')">
                <h4>📊 Monthly Accrual Report</h4>
                <p>Budget vs actual accrual, variance analysis by month and project.</p>
                <div class="fin-report-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();FinancePage.exportReportCSV('accrual')">Export Excel</button>
                </div>
            </div>
            <div class="fin-report-card" onclick="FinancePage.generateReport('vendor-outstanding')">
                <h4>📋 Vendor Outstanding Report</h4>
                <p>All unpaid and pending vendor invoices with aging analysis.</p>
                <div class="fin-report-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();FinancePage.exportReportCSV('vendor-outstanding')">Export Excel</button>
                </div>
            </div>
            <div class="fin-report-card" onclick="FinancePage.generateReport('project-expense')">
                <h4>💰 Project Expense Report</h4>
                <p>Total expenses per project with category breakdown.</p>
                <div class="fin-report-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();FinancePage.exportReportCSV('project-expense')">Export Excel</button>
                </div>
            </div>
            <div class="fin-report-card" onclick="FinancePage.generateReport('payment-register')">
                <h4>🧾 Payment Register</h4>
                <p>Complete register of all payments made to vendors.</p>
                <div class="fin-report-actions">
                    <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();FinancePage.exportReportCSV('payment-register')">Export Excel</button>
                </div>
            </div>
        </div>

        <div id="reportPreview"></div>`;
    },

    generateReport(type) {
        const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
        const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
        const container = document.getElementById('reportPreview');
        if (!container) return;

        let html = '';
        if (type === 'accrual') {
            html = `<div class="fin-table-wrap"><h4 style="padding:12px 16px;margin:0;color:var(--text-primary)">Monthly Accrual Report</h4>
                <table class="fin-table"><thead><tr><th>Month</th><th>Project</th><th>Dept</th><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th></tr></thead><tbody>
                ${this.accrualData.map(r => {
                    const v = Number(r.variance || 0);
                    const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '—';
                    return `<tr><td>${r.month}</td><td>${proj}</td><td>${r.department}</td><td>${r.cost_category}</td><td class="amount">${fmt(r.budget_amount)}</td><td class="amount">${fmt(r.actual_accrual)}</td><td class="amount ${v >= 0 ? 'positive' : 'negative'}">${fmt(v)}</td></tr>`;
                }).join('')}
                </tbody></table></div>`;
        } else if (type === 'vendor-outstanding') {
            const outstanding = this.ledgerData.filter(r => r.payment_status !== 'Paid');
            html = `<div class="fin-table-wrap"><h4 style="padding:12px 16px;margin:0;color:var(--text-primary)">Vendor Outstanding Report</h4>
                <table class="fin-table"><thead><tr><th>Invoice</th><th>Vendor</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Aging (Days)</th></tr></thead><tbody>
                ${outstanding.map(r => {
                    const aging = r.payment_due_date ? Math.max(0, Math.floor((Date.now() - new Date(r.payment_due_date)) / 86400000)) : 0;
                    return `<tr><td>${r.invoice_number}</td><td>${r.vendor_name}</td><td class="amount">${fmt(r.total_amount)}</td><td>${fmtDate(r.payment_due_date)}</td><td><span class="fin-badge ${(r.payment_status || '').toLowerCase()}">${r.payment_status}</span></td><td style="color:${aging > 30 ? 'var(--danger)' : aging > 0 ? '#F59E0B' : 'var(--success)'}">${aging}d</td></tr>`;
                }).join('')}
                </tbody></table></div>`;
        } else if (type === 'project-expense') {
            const projExpenses = {};
            this.accrualData.forEach(r => {
                const pName = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || 'Unknown';
                if (!projExpenses[pName]) projExpenses[pName] = { budget: 0, actual: 0 };
                projExpenses[pName].budget += Number(r.budget_amount || 0);
                projExpenses[pName].actual += Number(r.actual_accrual || 0);
            });
            html = `<div class="fin-table-wrap"><h4 style="padding:12px 16px;margin:0;color:var(--text-primary)">Project Expense Report</h4>
                <table class="fin-table"><thead><tr><th>Project</th><th>Budget</th><th>Actual</th><th>Variance</th><th>Utilization</th></tr></thead><tbody>
                ${Object.entries(projExpenses).map(([name, d]) => {
                    const v = d.budget - d.actual;
                    const util = d.budget > 0 ? ((d.actual / d.budget) * 100).toFixed(1) : 0;
                    return `<tr><td><strong>${name}</strong></td><td class="amount">${fmt(d.budget)}</td><td class="amount">${fmt(d.actual)}</td><td class="amount ${v >= 0 ? 'positive' : 'negative'}">${fmt(v)}</td><td>${util}%</td></tr>`;
                }).join('')}
                </tbody></table></div>`;
        } else if (type === 'payment-register') {
            html = `<div class="fin-table-wrap"><h4 style="padding:12px 16px;margin:0;color:var(--text-primary)">Payment Register</h4>
                <table class="fin-table"><thead><tr><th>ID</th><th>Vendor</th><th>Invoice</th><th>Amount</th><th>Date</th><th>Mode</th><th>Ref</th><th>Status</th></tr></thead><tbody>
                ${this.paymentsData.map(r => `<tr><td>${r.id}</td><td>${r.vendor_name}</td><td>${r.invoice_number || '—'}</td><td class="amount">${fmt(r.payment_amount)}</td><td>${fmtDate(r.payment_date)}</td><td>${r.payment_mode || '—'}</td><td>${r.reference_number || '—'}</td><td><span class="fin-badge ${(r.status || '').toLowerCase()}">${r.status}</span></td></tr>`).join('')}
                </tbody></table></div>`;
        }
        container.innerHTML = html;
    },

    exportReportCSV(type) {
        const fmt = v => Number(v);
        if (type === 'accrual') {
            const rows = [['Month', 'Project', 'Department', 'Category', 'Budget', 'Actual', 'Variance']];
            this.accrualData.forEach(r => {
                const proj = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || '';
                rows.push([r.month, proj, r.department, r.cost_category, fmt(r.budget_amount), fmt(r.actual_accrual), fmt(r.variance)]);
            });
            this._downloadCSV(rows, 'Monthly_Accrual_Report.csv');
        } else if (type === 'vendor-outstanding') {
            const outstanding = this.ledgerData.filter(r => r.payment_status !== 'Paid');
            const rows = [['Invoice', 'Vendor', 'Total Amount', 'Due Date', 'Status']];
            outstanding.forEach(r => rows.push([r.invoice_number, r.vendor_name, fmt(r.total_amount), r.payment_due_date || '', r.payment_status]));
            this._downloadCSV(rows, 'Vendor_Outstanding_Report.csv');
        } else if (type === 'project-expense') {
            const projExpenses = {};
            this.accrualData.forEach(r => {
                const pName = (AppData.projects.find(p => p.id === r.project_id) || {}).name || r.project_id || 'Unknown';
                if (!projExpenses[pName]) projExpenses[pName] = { budget: 0, actual: 0 };
                projExpenses[pName].budget += Number(r.budget_amount || 0);
                projExpenses[pName].actual += Number(r.actual_accrual || 0);
            });
            const rows = [['Project', 'Budget', 'Actual', 'Variance']];
            Object.entries(projExpenses).forEach(([name, d]) => rows.push([name, d.budget, d.actual, d.budget - d.actual]));
            this._downloadCSV(rows, 'Project_Expense_Report.csv');
        } else if (type === 'payment-register') {
            const rows = [['ID', 'Vendor', 'Invoice', 'Amount', 'Date', 'Mode', 'Ref', 'Status']];
            this.paymentsData.forEach(r => rows.push([r.id, r.vendor_name, r.invoice_number, fmt(r.payment_amount), r.payment_date || '', r.payment_mode, r.reference_number, r.status]));
            this._downloadCSV(rows, 'Payment_Register.csv');
        }
    },

    // =========================================
    //  SHARED UTILITIES
    // =========================================
    _downloadCSV(rows, filename) {
        const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // =========================================
    //  DATA LOADING & INITIALIZATION
    // =========================================
    async loadData() {
        try {
            const [ledger, accrual, bills, payments, vendors, departments] = await Promise.all([
                fetch('/api/billing-ledger').then(r => r.ok ? r.json() : []),
                fetch('/api/accrual-budget').then(r => r.ok ? r.json() : []),
                fetch('/api/bills-received').then(r => r.ok ? r.json() : []),
                fetch('/api/payments').then(r => r.ok ? r.json() : []),
                fetch('/api/vendors').then(r => r.ok ? r.json() : []),
                fetch('/api/departments').then(r => r.ok ? r.json() : [])
            ]);
            this.ledgerData = ledger;
            this.accrualData = accrual;
            this.billsData = bills;
            this.paymentsData = payments;
            this.vendorsList = vendors;
            this.departmentsList = departments;
        } catch (e) {
            console.warn('Finance data load failed:', e.message);
        }
    },

    initSubPage() {
        if (this.currentTab === 'fin-dashboard') this.initDashboardCharts();
        if (this.currentTab === 'fin-accrual') this.initAccrualCharts();

        // Bind filters
        this.bindFilters();

        // Bind modal overlay close
        document.querySelectorAll('.fin-modal-overlay').forEach(ov => {
            ov.addEventListener('click', (e) => { if (e.target === ov) ov.classList.remove('open'); });
        });
    },

    bindFilters() {
        // Ledger filters
        const ledgerSearch = document.getElementById('ledgerSearch');
        const ledgerVendor = document.getElementById('ledgerVendorFilter');
        const ledgerProject = document.getElementById('ledgerProjectFilter');
        const ledgerStatus = document.getElementById('ledgerStatusFilter');
        if (ledgerSearch || ledgerVendor || ledgerProject || ledgerStatus) {
            const filterLedger = () => {
                const q = (ledgerSearch?.value || '').toLowerCase();
                const v = ledgerVendor?.value || '';
                const p = ledgerProject?.value || '';
                const s = ledgerStatus?.value || '';
                document.querySelectorAll('#ledgerTable tbody tr').forEach(row => {
                    const text = row.textContent.toLowerCase();
                    const show = (!q || text.includes(q)) &&
                        (!v || row.children[1]?.textContent === v) &&
                        (!p || text.includes(p.toLowerCase())) &&
                        (!s || row.querySelector('.fin-badge')?.textContent === s);
                    row.style.display = show ? '' : 'none';
                });
            };
            [ledgerSearch, ledgerVendor, ledgerProject, ledgerStatus].forEach(el => el?.addEventListener('input', filterLedger));
            [ledgerVendor, ledgerProject, ledgerStatus].forEach(el => el?.addEventListener('change', filterLedger));
        }

        // Accrual filters
        const accrualProject = document.getElementById('accrualProjectFilter');
        const accrualMonth = document.getElementById('accrualMonthFilter');
        const accrualCat = document.getElementById('accrualCatFilter');
        if (accrualProject || accrualMonth || accrualCat) {
            const filterAccrual = () => {
                const p = accrualProject?.value || '';
                const m = accrualMonth?.value || '';
                const c = accrualCat?.value || '';
                document.querySelectorAll('#accrualTable tbody tr').forEach(row => {
                    const text = row.textContent.toLowerCase();
                    const show = (!p || text.includes(p.toLowerCase())) &&
                        (!m || row.children[0]?.textContent?.trim() === m) &&
                        (!c || row.children[3]?.textContent?.trim() === c);
                    row.style.display = show ? '' : 'none';
                });
            };
            [accrualProject, accrualMonth, accrualCat].forEach(el => el?.addEventListener('change', filterAccrual));
        }

        // Bills filters
        const billsApproval = document.getElementById('billsApprovalFilter');
        const billsPay = document.getElementById('billsPayFilter');
        const billsVendor = document.getElementById('billsVendorFilter');
        if (billsApproval || billsPay || billsVendor) {
            const filterBills = () => {
                const a = billsApproval?.value || '';
                const p = billsPay?.value || '';
                const v = billsVendor?.value || '';
                document.querySelectorAll('.fin-table tbody tr').forEach(row => {
                    if (!row.closest('#accrualTable') && !row.closest('#ledgerTable')) {
                        const badges = row.querySelectorAll('.fin-badge');
                        const show = (!a || (badges[0] && badges[0].textContent === a)) &&
                            (!p || (badges[1] && badges[1].textContent === p)) &&
                            (!v || row.children[1]?.textContent === v);
                        row.style.display = show ? '' : 'none';
                    }
                });
            };
            [billsApproval, billsPay, billsVendor].forEach(el => el?.addEventListener('change', filterBills));
        }

        // Payment filters
        const payStatus = document.getElementById('payStatusFilter');
        const payVendor = document.getElementById('payVendorFilter');
        if (payStatus || payVendor) {
            const filterPay = () => {
                const s = payStatus?.value || '';
                const v = payVendor?.value || '';
                document.querySelectorAll('.fin-table tbody tr').forEach(row => {
                    if (!row.closest('#accrualTable') && !row.closest('#ledgerTable')) {
                        const badge = row.querySelector('.fin-badge');
                        const show = (!s || (badge && badge.textContent === s)) &&
                            (!v || row.children[1]?.textContent === v);
                        row.style.display = show ? '' : 'none';
                    }
                });
            };
            [payStatus, payVendor].forEach(el => el?.addEventListener('change', filterPay));
        }
    },

    async init() {
        await this.loadData();

        // Re-render with loaded data
        const main = document.getElementById('financeMain');
        if (main) {
            main.innerHTML = this.renderSubPage();
            this.initSubPage();
        }

        // Bind sidebar navigation
        document.querySelectorAll('.finance-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.finTab;
                if (tab) FinancePage.switchTab(tab);
            });
        });
    }
};
