/* =============================================
   Infra Manager Pro — Projects Page
   ============================================= */

const ProjectsPage = {
    render() {
        return `
        <div class="page-header">
            <h1>Projects <small>${AppData.projects.length} total</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                </button>
                <button class="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Project
                </button>
            </div>
        </div>

        <!-- Stat Cards -->
        <div class="stat-cards">
            ${Components.statCard('Total Projects', AppData.projects.length, '', '', 'blue',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>')}
            ${Components.statCard('Active', AppData.projects.filter(p => p.status === 'Active').length, '', '', 'green',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>')}
            ${Components.statCard('Near Completion', AppData.projects.filter(p => p.status === 'Near Completion').length, '', '', 'orange',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>')}
            ${Components.statCard('Completed', AppData.projects.filter(p => p.status === 'Completed').length, '', '', 'cyan',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>')}
        </div>

        <!-- Filters -->
        ${Components.filterBar([
            { type: 'search', placeholder: 'Search projects...', id: 'projectSearch' },
            { type: 'select', placeholder: 'All Status', id: 'statusFilter', options: ['Active', 'Planned', 'Near Completion', 'Completed', 'Delayed'] },
            { type: 'select', placeholder: 'All Regions', id: 'regionFilter', options: ['South', 'North KA', 'West', 'East'] },
            { type: 'select', placeholder: 'All Managers', id: 'managerFilter', options: [...new Set(AppData.projects.map(p => p.manager))] }
        ])}

        <!-- Project Table -->
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Location</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Budget</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppData.projects.map(p => {
                        const colors = ['blue', 'green', 'orange', 'red', 'cyan'];
                        const colorIdx = AppData.projects.indexOf(p) % colors.length;
                        const bgColor = ['var(--primary-bg)', 'var(--success-bg)', 'var(--warning-bg)', 'var(--danger-bg)', 'var(--info-bg)'][colorIdx];
                        const iconColor = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)'][colorIdx];
                        return `
                        <tr class="clickable-row" onclick="App.navigate('project-details', '${p.id}')">
                            <td>
                                <div class="project-name-cell">
                                    <div class="project-icon" style="background:${bgColor};color:${iconColor}">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                                    </div>
                                    <div class="project-name-text">
                                        <h4>${p.name}</h4>
                                        <span>${p.id}</span>
                                    </div>
                                </div>
                            </td>
                            <td>${p.client}</td>
                            <td>${p.location}</td>
                            <td>${AppData.formatShortDate(p.startDate)}</td>
                            <td>${AppData.formatShortDate(p.endDate)}</td>
                            <td>${Components.progressBar(p.progress)}</td>
                            <td>${Components.badge(p.status, AppData.getStatusBadgeClass(p.status))}</td>
                            <td>${AppData.formatCurrency(p.budget)}</td>
                            <td>${Components.actionButtons()}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    },

    init() {
        // Search filter
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                document.querySelectorAll('.data-table tbody tr').forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }
};
