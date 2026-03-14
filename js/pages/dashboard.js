/* =============================================
   Infra Manager Pro — Dashboard Page
   ============================================= */

const DashboardPage = {
    render() {
        const totalProjects = AppData.projects.length;
        const activeProjects = AppData.projects.filter(p => p.status === 'Active' || p.status === 'Near Completion').length;
        const completedProjects = AppData.projects.filter(p => p.status === 'Completed').length;
        const totalBudget = AppData.projects.reduce((sum, p) => sum + p.budget, 0);
        const usedBudget = AppData.projects.reduce((sum, p) => sum + p.budgetUsed, 0);

        // Collect all tasks flat
        const allTasks = [];
        AppData.tasks.forEach(t => {
            allTasks.push(t);
            if (t.children) t.children.forEach(c => {
                allTasks.push(c);
                if (c.children) c.children.forEach(gc => allTasks.push(gc));
            });
        });
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
        const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
        const overdueTasks = allTasks.filter(t => new Date(t.endDate) < new Date() && t.status !== 'Completed').length;
        const onTimePct = totalTasks > 0 ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100) : 100;

        // Scope issues
        const blockedTasks = allTasks.filter(t => t.status === 'Blocked').length;
        const highPriority = allTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

        // Remaining effort (sum of uncompleted task progress remaining)
        const remainingEffort = allTasks.reduce((sum, t) => sum + (100 - t.progress), 0);

        return `
        <div class="page-header">
            <h1>Dashboard <small>Executive Overview</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                </button>
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    March 2026
                </button>
            </div>
        </div>

        <!-- Navy Blue KPI Banner -->
        <div class="dash-kpi-banner">
            <div class="kpi-section kpi-stats">
                <div class="kpi-big-num">${totalProjects}</div>
                <div class="kpi-label">Projects</div>
                <div class="kpi-big-num" style="margin-top:12px;">${remainingEffort.toFixed(1)}</div>
                <div class="kpi-label">Remaining Effort</div>
            </div>
            <div class="kpi-section kpi-time">
                <div class="kpi-section-title">Time</div>
                <div class="kpi-donut-wrap">
                    <canvas id="kpiTimeChart" width="130" height="130"></canvas>
                </div>
                ${overdueTasks > 0 ? `<div class="kpi-overdue-tag">Overdue ${Math.round((overdueTasks/totalTasks)*100)}%</div>` : ''}
            </div>
            <div class="kpi-section kpi-scope">
                <div class="kpi-section-title">Scope</div>
                <div class="kpi-hbars">
                    <div class="kpi-hbar-row"><span>Blocked</span><div class="kpi-hbar"><div class="kpi-hbar-fill" style="width:${Math.min(blockedTasks*20,100)}%;background:#3B82F6;"></div></div><span>${blockedTasks}</span></div>
                    <div class="kpi-hbar-row"><span>High Priority</span><div class="kpi-hbar"><div class="kpi-hbar-fill" style="width:${Math.min(highPriority*10,100)}%;background:#3B82F6;"></div></div><span>${highPriority}</span></div>
                    <div class="kpi-hbar-row"><span>In Progress</span><div class="kpi-hbar"><div class="kpi-hbar-fill" style="width:${Math.min(inProgressTasks*10,100)}%;background:#3B82F6;"></div></div><span>${inProgressTasks}</span></div>
                </div>
            </div>
            <div class="kpi-section kpi-costs">
                <div class="kpi-section-title">Costs</div>
                <div class="kpi-cost-chart-wrap">
                    <canvas id="kpiCostChart" width="160" height="120"></canvas>
                </div>
                <div class="kpi-cost-legend">
                    <span><span class="legend-dot" style="background:#334155;"></span> Budget</span>
                    <span><span class="legend-dot" style="background:#60A5FA;"></span> Actual</span>
                </div>
            </div>
        </div>

        <!-- Lower Dashboard Grid: Projects Table + Workload -->
        <div class="dash-lower-grid">
            <!-- Projects Summary Table -->
            <div class="dash-projects-section">
                <h2 class="dash-section-title">Projects</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Progress</th>
                                <th>%</th>
                                <th>Scope</th>
                                <th>Time</th>
                                <th>Remaining Budget</th>
                                <th>Days till Due</th>
                                <th>Remaining Effort</th>
                                <th>Worked</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppData.projects.map(p => {
                                const remaining = p.budget - p.budgetUsed;
                                const daysLeft = Math.round((new Date(p.endDate) - new Date()) / (1000*60*60*24));
                                const pTasks = allTasks.filter(t => t.projectId === p.id);
                                const pRemaining = pTasks.reduce((s,t) => s + (100 - t.progress), 0);
                                const pWorked = pTasks.reduce((s,t) => s + t.progress, 0);
                                const scopeOk = !pTasks.some(t => t.status === 'Blocked');
                                const timeOk = daysLeft > 0;
                                return `<tr>
                                    <td style="font-weight:600;">${p.name}</td>
                                    <td><div class="progress-bar" style="min-width:100px;"><div class="progress-fill blue" style="width:${p.progress}%;"></div></div></td>
                                    <td>${p.progress}%</td>
                                    <td><span class="scope-dot ${scopeOk ? 'ok' : 'warn'}"></span></td>
                                    <td><span class="scope-dot ${timeOk ? 'ok' : 'warn'}"></span></td>
                                    <td>${AppData.formatCurrency(remaining)}</td>
                                    <td style="${daysLeft < 0 ? 'color:var(--danger);font-weight:600;' : ''}">${daysLeft}</td>
                                    <td>${(pRemaining/100).toFixed(1)}</td>
                                    <td>${(pWorked/100).toFixed(1)}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Work Load Panel -->
            <div class="dash-workload-section">
                <h2 class="dash-section-title">Work Load</h2>
                <div class="card" style="padding:16px;">
                    <div class="workload-chart-wrap">
                        <canvas id="workloadChart"></canvas>
                    </div>
                </div>

                <!-- Upcoming Milestones -->
                <h2 class="dash-section-title" style="margin-top:16px;">Upcoming Milestones</h2>
                <div class="card" style="padding:16px;">
                    <div class="milestone-list">
                        ${AppData.projects.filter(p => p.status !== 'Completed').flatMap(p =>
                            p.milestones.filter(m => m.status === 'current').map(m => ({...m, project: p.name}))
                        ).slice(0, 4).map(m => `
                            <div class="milestone-item">
                                <div class="milestone-check current">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <div class="milestone-text">
                                    <h5>${m.name}</h5>
                                    <span>${m.project} • ${AppData.formatShortDate(m.date)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    },

    initCharts() {
        Chart.defaults.color = '#94A3B8';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
        Chart.defaults.font.family = 'Inter';
        Chart.defaults.font.size = 11;

        // Collect all tasks flat
        const allTasks = [];
        AppData.tasks.forEach(t => {
            allTasks.push(t);
            if (t.children) t.children.forEach(c => {
                allTasks.push(c);
                if (c.children) c.children.forEach(gc => allTasks.push(gc));
            });
        });
        const totalTasks = allTasks.length;
        const overdueTasks = allTasks.filter(t => new Date(t.endDate) < new Date() && t.status !== 'Completed').length;
        const onTimePct = totalTasks > 0 ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100) : 100;

        // KPI Time Donut
        const timeCtx = document.getElementById('kpiTimeChart');
        if (timeCtx) {
            new Chart(timeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['On Time', 'Overdue'],
                    datasets: [{
                        data: [onTimePct, 100 - onTimePct],
                        backgroundColor: ['#3B82F6', '#F59E0B'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    }
                },
                plugins: [{
                    id: 'centerText',
                    afterDraw(chart) {
                        const { ctx, width, height } = chart;
                        ctx.save();
                        ctx.fillStyle = '#E2E8F0';
                        ctx.font = '600 13px Inter';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('On Time ' + onTimePct + '%', width / 2, height / 2);
                        ctx.restore();
                    }
                }]
            });
        }

        // KPI Cost Bar Chart
        const costCtx = document.getElementById('kpiCostChart');
        if (costCtx) {
            const prjs = AppData.projects.filter(p => p.status !== 'Completed').slice(0, 4);
            new Chart(costCtx, {
                type: 'bar',
                data: {
                    labels: prjs.map(p => p.name.split(' ')[0]),
                    datasets: [
                        { label: 'Budget', data: prjs.map(p => p.budget / 100000), backgroundColor: '#334155', borderRadius: 3, barPercentage: 0.5 },
                        { label: 'Actual', data: prjs.map(p => p.budgetUsed / 100000), backgroundColor: '#60A5FA', borderRadius: 3, barPercentage: 0.5 }
                    ]
                },
                options: {
                    responsive: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#94A3B8', callback: v => '₹' + v + 'L', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { ticks: { color: '#94A3B8', font: { size: 9 } }, grid: { display: false } }
                    }
                }
            });
        }

        // Workload Horizontal Bar Chart
        const wlCtx = document.getElementById('workloadChart');
        if (wlCtx) {
            new Chart(wlCtx, {
                type: 'bar',
                data: {
                    labels: AppData.team.map(t => t.name.split(' ')[0]),
                    datasets: [
                        {
                            label: 'Active',
                            data: AppData.team.map(t => t.tasks - t.completed),
                            backgroundColor: '#3B82F6',
                            borderRadius: 3,
                            barPercentage: 0.6
                        },
                        {
                            label: 'Completed',
                            data: AppData.team.map(t => t.completed),
                            backgroundColor: '#94A3B8',
                            borderRadius: 3,
                            barPercentage: 0.6
                        },
                        {
                            label: 'Overdue',
                            data: AppData.team.map(() => Math.floor(Math.random() * 3)),
                            backgroundColor: '#F59E0B',
                            borderRadius: 3,
                            barPercentage: 0.6
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } } },
                    scales: {
                        x: { beginAtZero: true, stacked: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                        y: { stacked: true, grid: { display: false } }
                    }
                }
            });
        }
    }
};
