/* =============================================
   Infra Manager Pro — Teams Page
   ============================================= */

const TeamsPage = {
    render() {
        return `
        <div class="page-header">
            <h1>Team Workload <small>Resource Planning</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                </button>
                <button class="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    Add Member
                </button>
            </div>
        </div>

        <!-- Summary Stats -->
        <div class="stat-cards">
            ${Components.statCard('Total Engineers', AppData.team.length, '', '', 'blue',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>')}
            ${Components.statCard('High Load', AppData.team.filter(t => t.load === 'High').length, '', '', 'red',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>')}
            ${Components.statCard('Active Tasks', AppData.team.reduce((sum, t) => sum + t.tasks, 0), '', '', 'orange',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>')}
            ${Components.statCard('Completed', AppData.team.reduce((sum, t) => sum + t.completed, 0), '', '', 'green',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>')}
        </div>

        <!-- Engineer Cards -->
        <h3 class="section-title">ENGINEERS</h3>
        <div class="team-grid">
            ${AppData.team.map(member => {
                const loadClass = member.load === 'High' ? 'load-high' : member.load === 'Medium' ? 'load-medium' : 'load-low';
                const utilization = Math.round((member.tasks / 10) * 100);
                return `
                <div class="engineer-card">
                    <span class="avatar ${member.avatar}" style="width:44px;height:44px;font-size:0.875rem;">${member.initials}</span>
                    <div class="engineer-info">
                        <h4>${member.name}</h4>
                        <span>${member.role}</span>
                        <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
                            ${member.skills.map(s => `<span style="font-size:0.5625rem;padding:1px 6px;background:var(--bg-tertiary);border-radius:4px;color:var(--text-muted);">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div class="engineer-stats">
                        <div>
                            <div class="eng-stat-value">${member.tasks}</div>
                            <div class="eng-stat-label">Tasks</div>
                        </div>
                        <div>
                            <div class="eng-stat-value">${member.completed}</div>
                            <div class="eng-stat-label">Done</div>
                        </div>
                    </div>
                    <span class="load-badge ${loadClass}">${member.load}</span>
                </div>`;
            }).join('')}
        </div>

        <!-- Charts -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3>Workload Distribution</h3></div>
                <div class="chart-container">
                    <canvas id="workloadDistChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3>Resource Allocation by Project</h3></div>
                <div class="chart-container">
                    <canvas id="resourceAllocChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Detailed Table -->
        <div class="table-container">
            <div class="table-header">
                <h3>Team Details</h3>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Engineer</th>
                        <th>Role</th>
                        <th>Tasks</th>
                        <th>Completed</th>
                        <th>Utilization</th>
                        <th>Load</th>
                        <th>Projects</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppData.team.map(m => {
                        const util = Math.round(((m.tasks - m.completed) / 8) * 100);
                        return `
                        <tr>
                            <td>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span class="avatar ${m.avatar}" style="width:28px;height:28px;font-size:0.625rem;">${m.initials}</span>
                                    <span style="font-weight:500;">${m.name}</span>
                                </div>
                            </td>
                            <td>${m.role}</td>
                            <td>${m.tasks}</td>
                            <td>${m.completed}</td>
                            <td>${Components.progressBar(Math.min(util, 100))}</td>
                            <td><span class="load-badge ${m.load === 'High' ? 'load-high' : m.load === 'Medium' ? 'load-medium' : 'load-low'}">${m.load}</span></td>
                            <td>${m.projects.length} projects</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    },

    initCharts() {
        // Workload Distribution
        const wdCtx = document.getElementById('workloadDistChart');
        if (wdCtx) {
            new Chart(wdCtx, {
                type: 'radar',
                data: {
                    labels: AppData.team.map(t => t.name.split(' ')[0]),
                    datasets: [{
                        label: 'Active Tasks',
                        data: AppData.team.map(t => t.tasks - t.completed),
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: '#2563EB',
                        pointBackgroundColor: '#2563EB',
                        borderWidth: 2
                    }, {
                        label: 'Completed',
                        data: AppData.team.map(t => t.completed),
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: '#22C55E',
                        pointBackgroundColor: '#22C55E',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
                    scales: { r: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.06)' }, angleLines: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94A3B8' } } }
                }
            });
        }

        // Resource Allocation
        const raCtx = document.getElementById('resourceAllocChart');
        if (raCtx) {
            const projectNames = AppData.projects.filter(p => p.status !== 'Completed').map(p => p.name.split(' ').slice(0, 2).join(' '));
            const teamCounts = AppData.projects.filter(p => p.status !== 'Completed').map(p => p.team.length);
            
            new Chart(raCtx, {
                type: 'bar',
                data: {
                    labels: projectNames,
                    datasets: [{
                        label: 'Team Members',
                        data: teamCounts,
                        backgroundColor: ['#2563EB', '#06B6D4', '#F59E0B', '#8B5CF6', '#22C55E'],
                        borderRadius: 6,
                        barPercentage: 0.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true, grid: { display: false } }, y: { grid: { display: false } } }
                }
            });
        }
    },

    init() {
        this.initCharts();
    }
};
