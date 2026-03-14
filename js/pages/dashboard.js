/* =============================================
   Infra Manager Pro — Dashboard Page
   ============================================= */

const DashboardPage = {
    render() {
        const activeProjects = AppData.projects.filter(p => p.status === 'Active' || p.status === 'Near Completion').length;
        const delayedProjects = AppData.projects.filter(p => p.status === 'Delayed').length;
        const completedProjects = AppData.projects.filter(p => p.status === 'Completed').length;
        const totalBudget = AppData.projects.reduce((sum, p) => sum + p.budget, 0);
        const usedBudget = AppData.projects.reduce((sum, p) => sum + p.budgetUsed, 0);
        const budgetPct = Math.round((usedBudget / totalBudget) * 100);
        const avgProgress = Math.round(AppData.projects.reduce((sum, p) => sum + p.progress, 0) / AppData.projects.length);

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

        <!-- Stat Cards -->
        <div class="stat-cards">
            ${Components.statCard('Active Projects', activeProjects, '+2 this month', 'positive', 'blue',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>')}
            ${Components.statCard('Delayed Projects', delayedProjects, 'None currently', 'positive', 'red',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>')}
            ${Components.statCard('Budget Utilized', budgetPct + '%', AppData.formatCurrency(usedBudget) + ' of ' + AppData.formatCurrency(totalBudget), '', 'orange',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>')}
            ${Components.statCard('Avg Completion', avgProgress + '%', completedProjects + ' projects done', 'positive', 'green',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>')}
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3>Project Progress</h3>
                    <select class="filter-input" style="width:auto;padding:4px 28px 4px 8px;font-size:0.75rem;">
                        <option>All Projects</option>
                        <option>Active Only</option>
                    </select>
                </div>
                <div class="chart-container">
                    <canvas id="projectProgressChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3>Team Workload</h3>
                </div>
                <div class="chart-container">
                    <canvas id="teamWorkloadChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3>Budget Overview</h3>
                </div>
                <div class="chart-container">
                    <canvas id="budgetChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3>Task Status Distribution</h3>
                </div>
                <div class="chart-container">
                    <canvas id="taskStatusChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Recent Activities & Projects -->
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <h3>Recent Activity</h3>
                    <button class="btn btn-outline btn-sm">View All</button>
                </div>
                <div class="activity-list">
                    ${AppData.activities.map(a => `
                        <div class="activity-item">
                            <div class="activity-dot ${a.type}"></div>
                            <div class="activity-text">${a.text}</div>
                            <div class="activity-time">${a.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px;">
                <div class="card">
                    <div class="card-header">
                        <h3>Upcoming Milestones</h3>
                    </div>
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
                <div class="card">
                    <div class="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <button class="btn btn-outline" onclick="document.getElementById('createTaskModal').classList.add('open')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            New Task
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('projects')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                            Projects
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('reports')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                            Reports
                        </button>
                        <button class="btn btn-outline" onclick="App.navigate('gantt')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>
                            Gantt View
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    initCharts() {
        // Chart.js defaults
        Chart.defaults.color = '#94A3B8';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
        Chart.defaults.font.family = 'Inter';
        Chart.defaults.font.size = 11;

        // Project Progress Chart
        const ppCtx = document.getElementById('projectProgressChart');
        if (ppCtx) {
            new Chart(ppCtx, {
                type: 'bar',
                data: {
                    labels: AppData.projects.map(p => p.name.split(' ').slice(0, 2).join(' ')),
                    datasets: [{
                        label: 'Progress',
                        data: AppData.projects.map(p => p.progress),
                        backgroundColor: AppData.projects.map(p => {
                            if (p.progress >= 75) return 'rgba(34, 197, 94, 0.8)';
                            if (p.progress >= 40) return 'rgba(37, 99, 235, 0.8)';
                            return 'rgba(245, 158, 11, 0.8)';
                        }),
                        borderRadius: 4,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // Team Workload Chart
        const twCtx = document.getElementById('teamWorkloadChart');
        if (twCtx) {
            new Chart(twCtx, {
                type: 'bar',
                data: {
                    labels: AppData.team.map(t => t.name.split(' ')[0]),
                    datasets: [
                        {
                            label: 'Active Tasks',
                            data: AppData.team.map(t => t.tasks - t.completed),
                            backgroundColor: 'rgba(37, 99, 235, 0.8)',
                            borderRadius: 4,
                            barPercentage: 0.5
                        },
                        {
                            label: 'Completed',
                            data: AppData.team.map(t => t.completed),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                            borderRadius: 4,
                            barPercentage: 0.5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 12 } } },
                    scales: {
                        y: { beginAtZero: true, stacked: true },
                        x: { grid: { display: false }, stacked: true }
                    }
                }
            });
        }

        // Budget Chart
        const bCtx = document.getElementById('budgetChart');
        if (bCtx) {
            new Chart(bCtx, {
                type: 'doughnut',
                data: {
                    labels: AppData.projects.filter(p => p.status !== 'Completed').map(p => p.name.split(' ').slice(0, 2).join(' ')),
                    datasets: [{
                        data: AppData.projects.filter(p => p.status !== 'Completed').map(p => p.budgetUsed),
                        backgroundColor: ['#2563EB', '#06B6D4', '#F59E0B', '#8B5CF6', '#22C55E'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { boxWidth: 10, padding: 12 } }
                    },
                    cutout: '65%'
                }
            });
        }

        // Task Status Chart
        const tsCtx = document.getElementById('taskStatusChart');
        if (tsCtx) {
            const allTasks = [];
            AppData.tasks.forEach(t => {
                allTasks.push(t);
                if (t.children) t.children.forEach(c => {
                    allTasks.push(c);
                    if (c.children) c.children.forEach(gc => allTasks.push(gc));
                });
            });
            const statusCounts = {};
            allTasks.forEach(t => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });
            
            new Chart(tsCtx, {
                type: 'polarArea',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: [
                            'rgba(6, 182, 212, 0.7)',
                            'rgba(37, 99, 235, 0.7)',
                            'rgba(34, 197, 94, 0.7)',
                            'rgba(245, 158, 11, 0.7)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 12 } } },
                    scales: { r: { display: false } }
                }
            });
        }
    }
};
