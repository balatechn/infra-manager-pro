/* =============================================
   Infra Manager Pro — Reports Page
   ============================================= */

const ReportsPage = {
    render() {
        const activeProjects = AppData.projects.filter(p => p.status !== 'Completed');
        const totalBudget = AppData.projects.reduce((s, p) => s + p.budget, 0);
        const usedBudget = AppData.projects.reduce((s, p) => s + p.budgetUsed, 0);

        return `
        <div class="page-header">
            <h1>Reports <small>Stakeholder Dashboard</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    Schedule Report
                </button>
                <button class="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Generate Report
                </button>
            </div>
        </div>

        <!-- Report Types -->
        <h3 class="section-title">AVAILABLE REPORTS</h3>
        <div class="reports-grid">
            <div class="report-card">
                <div class="report-icon" style="background:var(--primary-bg);color:var(--primary);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h4>Weekly Project Report</h4>
                <p>Summary of all project activities, milestones achieved, and blockers from the past week.</p>
            </div>
            <div class="report-card">
                <div class="report-icon" style="background:var(--success-bg);color:var(--success);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <h4>Monthly Project Report</h4>
                <p>Comprehensive monthly overview with progress tracking, budget burn rate, and forecasts.</p>
            </div>
            <div class="report-card">
                <div class="report-icon" style="background:var(--danger-bg);color:var(--danger);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h4>Delayed Tasks Report</h4>
                <p>All overdue tasks, blocked items, and schedule slippage analysis across projects.</p>
            </div>
            <div class="report-card">
                <div class="report-icon" style="background:var(--warning-bg);color:var(--warning);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                </div>
                <h4>Budget Report</h4>
                <p>Detailed budget utilization, cost breakdown by project, and remaining budget forecasts.</p>
            </div>
            <div class="report-card">
                <div class="report-icon" style="background:var(--info-bg);color:var(--info);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h4>Risk Report</h4>
                <p>Risk assessment matrix, mitigation strategies, and risk distribution across all active projects.</p>
            </div>
            <div class="report-card">
                <div class="report-icon" style="background:rgba(139,92,246,0.1);color:#8B5CF6;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <h4>Resource Report</h4>
                <p>Team utilization, workload distribution, and resource allocation recommendations.</p>
            </div>
        </div>

        <!-- Dashboard Charts -->
        <h3 class="section-title">STAKEHOLDER DASHBOARD</h3>
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3>Project Completion Overview</h3></div>
                <div class="chart-container">
                    <canvas id="reportCompletionChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3>Budget Utilization</h3></div>
                <div class="chart-container">
                    <canvas id="reportBudgetChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3>Risk Distribution</h3></div>
                <div class="chart-container">
                    <canvas id="reportRiskChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3>Timeline Variance</h3></div>
                <div class="chart-container">
                    <canvas id="reportTimelineChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Summary Table -->
        <div class="table-container" style="margin-top:16px;">
            <div class="table-header">
                <h3>Project Summary</h3>
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download CSV
                </button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Budget</th>
                        <th>Spent</th>
                        <th>Remaining</th>
                        <th>Risk Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppData.projects.map(p => {
                        const budgetPct = Math.round((p.budgetUsed / p.budget) * 100);
                        const risk = budgetPct > 85 ? 'High' : budgetPct > 60 ? 'Medium' : 'Low';
                        const riskClass = risk === 'High' ? 'badge-priority-high' : risk === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low';
                        return `
                        <tr>
                            <td style="font-weight:500;">${p.name}</td>
                            <td>${Components.badge(p.status, AppData.getStatusBadgeClass(p.status))}</td>
                            <td>${Components.progressBar(p.progress)}</td>
                            <td>${AppData.formatCurrency(p.budget)}</td>
                            <td>${AppData.formatCurrency(p.budgetUsed)}</td>
                            <td style="color:var(--success);">${AppData.formatCurrency(p.budget - p.budgetUsed)}</td>
                            <td>${Components.badge(risk, riskClass)}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    },

    initCharts() {
        // Completion chart
        const ccCtx = document.getElementById('reportCompletionChart');
        if (ccCtx) {
            new Chart(ccCtx, {
                type: 'bar',
                data: {
                    labels: AppData.projects.map(p => p.name.split(' ').slice(0, 2).join(' ')),
                    datasets: [{
                        label: 'Completed',
                        data: AppData.projects.map(p => p.progress),
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderRadius: 4,
                        barPercentage: 0.4
                    }, {
                        label: 'Remaining',
                        data: AppData.projects.map(p => 100 - p.progress),
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: 4,
                        barPercentage: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
                    scales: { y: { stacked: true, max: 100, ticks: { callback: v => v + '%' } }, x: { stacked: true, grid: { display: false } } }
                }
            });
        }

        // Budget chart
        const bcCtx = document.getElementById('reportBudgetChart');
        if (bcCtx) {
            new Chart(bcCtx, {
                type: 'bar',
                data: {
                    labels: AppData.projects.map(p => p.name.split(' ').slice(0, 2).join(' ')),
                    datasets: [{
                        label: 'Spent',
                        data: AppData.projects.map(p => p.budgetUsed / 100000),
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderRadius: 4,
                        barPercentage: 0.4
                    }, {
                        label: 'Total Budget',
                        data: AppData.projects.map(p => p.budget / 100000),
                        backgroundColor: 'rgba(37, 99, 235, 0.3)',
                        borderRadius: 4,
                        barPercentage: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
                    scales: { y: { ticks: { callback: v => '₹' + v + 'L' } }, x: { grid: { display: false } } }
                }
            });
        }

        // Risk Distribution
        const rrCtx = document.getElementById('reportRiskChart');
        if (rrCtx) {
            new Chart(rrCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                    datasets: [{
                        data: [3, 2, 1],
                        backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 12 } } },
                    cutout: '60%'
                }
            });
        }

        // Timeline Variance
        const tvCtx = document.getElementById('reportTimelineChart');
        if (tvCtx) {
            new Chart(tvCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                    datasets: [{
                        label: 'Planned Progress',
                        data: [10, 20, 30, 40, 50, 60, 70, 80],
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3
                    }, {
                        label: 'Actual Progress',
                        data: [8, 15, 25, 32, 42, 50, 58, 65],
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
                    scales: { y: { beginAtZero: true, ticks: { callback: v => v + '%' } } }
                }
            });
        }
    },

    init() {
        this.initCharts();
    }
};
