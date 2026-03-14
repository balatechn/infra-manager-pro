/* =============================================
   Infra Manager Pro — Project Details Page
   ============================================= */

const ProjectDetailsPage = {
    currentTab: 'overview',

    render(projectId) {
        const project = AppData.projects.find(p => p.id === projectId);
        if (!project) return '<div class="empty-state"><p>Project not found</p></div>';

        const budgetPct = Math.round((project.budgetUsed / project.budget) * 100);
        const projectTasks = AppData.tasks.filter(t => t.projectId === projectId);

        return `
        ${Components.breadcrumbs([
            { label: 'Dashboard', page: 'dashboard' },
            { label: 'Projects', page: 'projects' },
            { label: project.name }
        ])}

        <!-- Project Header -->
        <div class="project-detail-header">
            <div class="header-top">
                <div>
                    <h2 class="project-title">${project.name}</h2>
                    <p style="color:var(--text-muted);font-size:0.875rem;margin-top:4px;">${project.client} • ${project.location}</p>
                </div>
                <div style="display:flex;gap:8px;">
                    ${Components.badge(project.status, AppData.getStatusBadgeClass(project.status))}
                    <button class="btn btn-outline btn-sm">Edit Project</button>
                </div>
            </div>
            <div class="project-meta">
                <div class="project-meta-item">
                    <label>Manager</label>
                    <span>${project.manager}</span>
                </div>
                <div class="project-meta-item">
                    <label>Start Date</label>
                    <span>${AppData.formatDate(project.startDate)}</span>
                </div>
                <div class="project-meta-item">
                    <label>End Date</label>
                    <span>${AppData.formatDate(project.endDate)}</span>
                </div>
                <div class="project-meta-item">
                    <label>Budget</label>
                    <span>${AppData.formatCurrency(project.budget)}</span>
                </div>
                <div class="project-meta-item">
                    <label>Budget Used</label>
                    <span style="color:${budgetPct > 85 ? 'var(--danger)' : 'var(--text-primary)'}">${budgetPct}% (${AppData.formatCurrency(project.budgetUsed)})</span>
                </div>
                <div class="project-meta-item">
                    <label>Progress</label>
                    <span>${project.progress}%</span>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            <button class="tab active" onclick="ProjectDetailsPage.switchTab('overview', '${projectId}')">Overview</button>
            <button class="tab" onclick="ProjectDetailsPage.switchTab('tasks', '${projectId}')">Tasks</button>
            <button class="tab" onclick="ProjectDetailsPage.switchTab('files', '${projectId}')">Files</button>
            <button class="tab" onclick="ProjectDetailsPage.switchTab('issues', '${projectId}')">Issues</button>
        </div>

        <div id="projectTabContent">
            ${this.renderOverview(project, projectTasks)}
        </div>`;
    },

    renderOverview(project, projectTasks) {
        const budgetPct = Math.round((project.budgetUsed / project.budget) * 100);
        return `
        <div class="project-overview-grid">
            <div>
                <!-- Description -->
                <div class="card" style="margin-bottom:16px;">
                    <div class="card-header"><h3>Description</h3></div>
                    <div class="card-body">
                        <p style="color:var(--text-secondary);line-height:1.7;">${project.description}</p>
                    </div>
                </div>

                <!-- Milestones -->
                <div class="card" style="margin-bottom:16px;">
                    <div class="card-header"><h3>Milestones</h3></div>
                    <div class="milestone-list">
                        ${project.milestones.map(m => `
                        <div class="milestone-item">
                            <div class="milestone-check ${m.status}">
                                ${m.status === 'done' ?
                                    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' :
                                    m.status === 'current' ?
                                    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="4"/></svg>' :
                                    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="8"/></svg>'}
                            </div>
                            <div class="milestone-text">
                                <h5>${m.name}</h5>
                                <span>${AppData.formatDate(m.date)}</span>
                            </div>
                            ${Components.badge(m.status === 'done' ? 'Done' : m.status === 'current' ? 'In Progress' : 'Upcoming',
                                m.status === 'done' ? 'badge-completed' : m.status === 'current' ? 'badge-in-progress' : 'badge-planned')}
                        </div>`).join('')}
                    </div>
                </div>

                <!-- Tasks Summary -->
                <div class="card">
                    <div class="card-header">
                        <h3>Tasks (${projectTasks.length})</h3>
                        <button class="btn btn-outline btn-sm" onclick="App.navigate('tasks')">View All</button>
                    </div>
                    ${projectTasks.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Assigned To</th>
                                <th>Progress</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${projectTasks.map(t => `
                            <tr>
                                <td style="font-weight:500;">${t.name}</td>
                                <td>${t.assignedTo}</td>
                                <td>${Components.progressBar(t.progress)}</td>
                                <td>${Components.badge(t.status, AppData.getStatusBadgeClass(t.status))}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>` : '<div class="empty-state"><p>No tasks yet</p></div>'}
                </div>
            </div>

            <div>
                <!-- Progress Chart -->
                <div class="card" style="margin-bottom:16px;">
                    <div class="card-header"><h3>Progress</h3></div>
                    <div style="text-align:center;padding:20px 0;">
                        <div style="position:relative;display:inline-block;">
                            <canvas id="projectProgressDonut" width="160" height="160"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Team -->
                <div class="card" style="margin-bottom:16px;">
                    <div class="card-header"><h3>Team Members</h3></div>
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        ${project.team.map((name, i) => {
                            const member = AppData.team.find(t => t.name === name);
                            return `
                            <div style="display:flex;align-items:center;gap:10px;padding:6px 0;">
                                <span class="avatar bg-${(i % 5) + 1}">${name.split(' ').map(n => n[0]).join('')}</span>
                                <div>
                                    <div style="font-size:0.8125rem;font-weight:500;">${name}</div>
                                    <div style="font-size:0.6875rem;color:var(--text-muted);">${member ? member.role : 'Team Member'}</div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <!-- Budget -->
                <div class="card">
                    <div class="card-header"><h3>Budget</h3></div>
                    <div style="padding:8px 0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span style="font-size:0.75rem;color:var(--text-muted);">Used</span>
                            <span style="font-size:0.75rem;font-weight:600;">${budgetPct}%</span>
                        </div>
                        <div class="progress-bar" style="height:8px;">
                            <div class="progress-fill ${budgetPct > 85 ? 'red' : budgetPct > 60 ? 'orange' : 'blue'}" style="width:${budgetPct}%"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-top:12px;">
                            <div>
                                <div style="font-size:0.6875rem;color:var(--text-muted);">Spent</div>
                                <div style="font-size:1rem;font-weight:700;">${AppData.formatCurrency(project.budgetUsed)}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.6875rem;color:var(--text-muted);">Remaining</div>
                                <div style="font-size:1rem;font-weight:700;color:var(--success);">${AppData.formatCurrency(project.budget - project.budgetUsed)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    switchTab(tab, projectId) {
        this.currentTab = tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        const project = AppData.projects.find(p => p.id === projectId);
        const projectTasks = AppData.tasks.filter(t => t.projectId === projectId);
        const container = document.getElementById('projectTabContent');
        
        if (tab === 'overview') {
            container.innerHTML = this.renderOverview(project, projectTasks);
            this.initOverviewCharts(project);
        } else if (tab === 'tasks') {
            container.innerHTML = `<div class="card"><div class="card-header"><h3>Project Tasks</h3></div>
                <p style="color:var(--text-muted);padding:20px;font-size:0.875rem;">Navigate to <a href="#" onclick="App.navigate('tasks');return false;">Task Manager</a> for full task hierarchy view.</p></div>`;
        } else if (tab === 'files') {
            container.innerHTML = `<div class="card"><div class="card-header"><h3>Project Files</h3></div>
                <div class="empty-state" style="padding:40px;"><p>No files uploaded yet. Drag and drop files here.</p></div></div>`;
        } else if (tab === 'issues') {
            container.innerHTML = `<div class="card"><div class="card-header"><h3>Issues</h3><button class="btn btn-primary btn-sm">Report Issue</button></div>
                <div class="empty-state" style="padding:40px;"><p>No issues reported for this project.</p></div></div>`;
        }
    },

    initOverviewCharts(project) {
        const ctx = document.getElementById('projectProgressDonut');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Remaining'],
                    datasets: [{
                        data: [project.progress, 100 - project.progress],
                        backgroundColor: ['#2563EB', 'rgba(255,255,255,0.05)'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    cutout: '75%'
                },
                plugins: [{
                    id: 'centerText',
                    afterDraw(chart) {
                        const { ctx, width, height } = chart;
                        ctx.save();
                        ctx.fillStyle = '#F1F5F9';
                        ctx.font = 'bold 28px Inter';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(project.progress + '%', width / 2, height / 2);
                        ctx.restore();
                    }
                }]
            });
        }
    },

    init(projectId) {
        const project = AppData.projects.find(p => p.id === projectId);
        if (project) this.initOverviewCharts(project);
    }
};
