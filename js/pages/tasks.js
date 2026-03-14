/* =============================================
   Infra Manager Pro — Task Management Page
   ============================================= */

const TasksPage = {
    expandedTasks: new Set(['T001', 'T002', 'T003', 'T004', 'T005']),

    render() {
        return `
        <div class="page-header">
            <h1>Task Manager <small>Hierarchical View</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm" onclick="TasksPage.expandAll()">Expand All</button>
                <button class="btn btn-outline btn-sm" onclick="TasksPage.collapseAll()">Collapse All</button>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('createTaskModal').classList.add('open')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Task
                </button>
            </div>
        </div>

        ${Components.filterBar([
            { type: 'search', placeholder: 'Search tasks...', id: 'taskSearch' },
            { type: 'select', placeholder: 'All Projects', id: 'taskProjectFilter', options: AppData.projects.map(p => p.name) },
            { type: 'select', placeholder: 'All Status', id: 'taskStatusFilter', options: ['Completed', 'In Progress', 'Planned', 'Blocked'] },
            { type: 'select', placeholder: 'All Priority', id: 'taskPriorityFilter', options: ['High', 'Medium', 'Low'] }
        ])}

        <div class="table-container">
            <div class="task-hierarchy" id="taskHierarchy">
                <!-- Header -->
                <div class="task-row header">
                    <div>Task Name</div>
                    <div>Start</div>
                    <div>End</div>
                    <div>Duration</div>
                    <div>Assigned To</div>
                    <div>Dependency</div>
                    <div>Progress</div>
                    <div>Status</div>
                </div>
                <!-- Task Rows -->
                ${this.renderTaskRows()}
            </div>
        </div>`;
    },

    renderTaskRows() {
        let html = '';
        AppData.tasks.forEach(task => {
            html += this.renderTask(task, 0);
        });
        return html;
    },

    renderTask(task, level) {
        const hasChildren = task.children && task.children.length > 0;
        const isExpanded = this.expandedTasks.has(task.id);
        const project = AppData.projects.find(p => p.id === task.projectId);

        let html = `
        <div class="task-row level-${level}" data-task-id="${task.id}" data-level="${level}">
            <div class="task-name-cell">
                ${hasChildren ? `
                <button class="task-expand ${isExpanded ? 'expanded' : ''}" onclick="TasksPage.toggleTask('${task.id}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>` : '<span style="width:20px;display:inline-block;"></span>'}
                <span style="font-weight:${level === 0 ? '600' : '400'};">
                    ${level === 0 && project ? '<span style="color:var(--primary-light);font-size:0.6875rem;margin-right:6px;">[' + project.name.split(' ').slice(0, 2).join(' ') + ']</span>' : ''}
                    ${task.name}
                </span>
            </div>
            <div>${AppData.formatShortDate(task.startDate)}</div>
            <div>${AppData.formatShortDate(task.endDate)}</div>
            <div>${task.duration}</div>
            <div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="avatar bg-${(task.assignedTo.charCodeAt(0) % 5) + 1}" style="width:22px;height:22px;font-size:0.5625rem;">${task.assignedTo.split(' ').map(n=>n[0]).join('')}</span>
                    <span style="font-size:0.75rem;">${task.assignedTo.split(' ')[0]}</span>
                </div>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${task.dependency || '—'}</div>
            <div>${Components.progressBar(task.progress)}</div>
            <div>${Components.badge(task.status, AppData.getStatusBadgeClass(task.status))}</div>
        </div>`;

        if (hasChildren && isExpanded) {
            task.children.forEach(child => {
                html += this.renderTask(child, level + 1);
            });
        }

        return html;
    },

    toggleTask(taskId) {
        if (this.expandedTasks.has(taskId)) {
            this.expandedTasks.delete(taskId);
        } else {
            this.expandedTasks.add(taskId);
        }
        this.refresh();
    },

    expandAll() {
        const addIds = (tasks) => {
            tasks.forEach(t => {
                this.expandedTasks.add(t.id);
                if (t.children) addIds(t.children);
            });
        };
        addIds(AppData.tasks);
        this.refresh();
    },

    collapseAll() {
        this.expandedTasks.clear();
        this.refresh();
    },

    refresh() {
        const container = document.getElementById('taskHierarchy');
        if (container) {
            container.innerHTML = `
                <div class="task-row header">
                    <div>Task Name</div>
                    <div>Start</div>
                    <div>End</div>
                    <div>Duration</div>
                    <div>Assigned To</div>
                    <div>Dependency</div>
                    <div>Progress</div>
                    <div>Status</div>
                </div>
                ${this.renderTaskRows()}`;
        }
    },

    init() {
        const searchInput = document.getElementById('taskSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                document.querySelectorAll('.task-row:not(.header)').forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }
};
