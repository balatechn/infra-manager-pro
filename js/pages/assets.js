/* =============================================
   Infra Manager Pro — Assets Page
   ============================================= */

const AssetsPage = {
    render() {
        const categories = {};
        AppData.assets.forEach(a => {
            categories[a.category] = (categories[a.category] || 0) + 1;
        });

        const statusCounts = {};
        AppData.assets.forEach(a => {
            statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
        });

        const catIcons = {
            'Switches': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></svg>',
            'Firewalls': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'Routers': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="10" y1="12" x2="10.01" y2="12"/></svg>',
            'Cameras': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
            'UPS': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
            'Access Points': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
            'Servers': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
            'Cables': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg>',
            'NVR': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            'Workstations': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
        };

        const catColors = ['var(--primary-bg)', 'var(--danger-bg)', 'var(--success-bg)', 'var(--warning-bg)', 'var(--info-bg)'];
        const catTextColors = ['var(--primary)', 'var(--danger)', 'var(--success)', 'var(--warning)', 'var(--info)'];

        return `
        <div class="page-header">
            <h1>Assets <small>Infrastructure Equipment Tracking</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                </button>
                <button class="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Asset
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="stat-cards">
            ${Components.statCard('Total Assets', AppData.assets.length, '', '', 'blue',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>')}
            ${Components.statCard('Deployed', statusCounts['Deployed'] || 0, '', '', 'green',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>')}
            ${Components.statCard('In Warehouse', (statusCounts['In Warehouse'] || 0) + (statusCounts['Ordered'] || 0), '', '', 'orange',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>')}
            ${Components.statCard('Categories', Object.keys(categories).length, '', '', 'cyan',
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>')}
        </div>

        <!-- Categories -->
        <h3 class="section-title">CATEGORIES</h3>
        <div class="asset-categories">
            ${Object.entries(categories).map(([cat, count], i) => `
                <div class="asset-category">
                    <div class="cat-icon" style="background:${catColors[i % catColors.length]};color:${catTextColors[i % catTextColors.length]};">
                        ${catIcons[cat] || catIcons['Switches']}
                    </div>
                    <h4>${cat}</h4>
                    <span>${count} items</span>
                </div>
            `).join('')}
        </div>

        <!-- Filters -->
        ${Components.filterBar([
            { type: 'search', placeholder: 'Search assets...', id: 'assetSearch' },
            { type: 'select', placeholder: 'All Categories', id: 'assetCatFilter', options: Object.keys(categories) },
            { type: 'select', placeholder: 'All Status', id: 'assetStatusFilter', options: Object.keys(statusCounts) },
            { type: 'select', placeholder: 'All Projects', id: 'assetProjectFilter', options: AppData.projects.map(p => p.name) }
        ])}

        <!-- Asset Table -->
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Asset ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Project</th>
                        <th>Serial</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppData.assets.map(a => {
                        const project = AppData.projects.find(p => p.id === a.project);
                        const statusClass = a.status === 'Deployed' ? 'badge-active' : a.status === 'In Warehouse' ? 'badge-planned' : a.status === 'In Transit' ? 'badge-in-progress' : a.status === 'Ordered' ? 'badge-near-completion' : 'badge-active';
                        return `
                        <tr>
                            <td style="font-weight:500;color:var(--primary-light);">${a.id}</td>
                            <td style="font-weight:500;">${a.name}</td>
                            <td>${a.category}</td>
                            <td>${a.location}</td>
                            <td>${project ? project.name.split(' ').slice(0, 2).join(' ') : '—'}</td>
                            <td style="font-family:monospace;font-size:0.75rem;color:var(--text-muted);">${a.serial}</td>
                            <td>${Components.badge(a.status, statusClass)}</td>
                            <td>${Components.actionButtons()}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    },

    init() {
        const searchInput = document.getElementById('assetSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                document.querySelectorAll('.data-table tbody tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
                });
            });
        }
    }
};
