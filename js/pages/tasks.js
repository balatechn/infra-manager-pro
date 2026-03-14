/* =============================================
   Infra Manager Pro — Task Management Page
   ============================================= */

const TasksPage = {
    expandedTasks: new Set(['T001', 'T002', 'T003', 'T004', 'T005']),
    editingTask: null,

    render() {
        return `
        <div class="page-header">
            <h1>Task Manager <small>Hierarchical View</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm" onclick="TasksPage.expandAll()">Expand All</button>
                <button class="btn btn-outline btn-sm" onclick="TasksPage.collapseAll()">Collapse All</button>
                <button class="btn btn-primary btn-sm" onclick="TasksPage.openNewTask()">
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
                <div class="task-row header">
                    <div>Task Name</div>
                    <div>Start</div>
                    <div>End</div>
                    <div>Duration</div>
                    <div>Assigned To</div>
                    <div>Progress</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
                ${this.renderTaskRows()}
            </div>
        </div>

        <!-- Task Edit/Create Modal -->
        <div class="task-modal-overlay" id="taskModalOverlay">
            <div class="task-modal">
                <div class="task-modal-header">
                    <h3 id="taskModalTitle">New Task</h3>
                    <button class="modal-close" onclick="TasksPage.closeModal()">&times;</button>
                </div>
                <div class="task-modal-body">
                    <input type="hidden" id="tmId">
                    <input type="hidden" id="tmParentId">
                    <div class="form-group">
                        <label>Task Name</label>
                        <input type="text" class="form-input" id="tmName" placeholder="Enter task name">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Project</label>
                            <select class="form-input" id="tmProject">
                                ${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select class="form-input" id="tmPriority">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" class="form-input" id="tmStart">
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input type="date" class="form-input" id="tmEnd">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Assigned To</label>
                            <select class="form-input" id="tmAssigned">
                                ${(AppData.team || []).map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-input" id="tmStatus">
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Duration</label>
                            <input type="text" class="form-input" id="tmDuration" placeholder="e.g. 5 days">
                        </div>
                        <div class="form-group">
                            <label>Progress (%)</label>
                            <input type="number" class="form-input" id="tmProgress" min="0" max="100" value="0">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Dependency</label>
                        <input type="text" class="form-input" id="tmDependency" placeholder="e.g. T001">
                    </div>
                </div>
                <div class="task-modal-footer">
                    <button class="btn btn-secondary" onclick="TasksPage.closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="TasksPage.saveTask()">Save</button>
                </div>
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

        const escapedId = task.id.replace(/'/g, "\\'");

        let html = `
        <div class="task-row level-${level}" data-task-id="${task.id}" data-level="${level}">
            <div class="task-name-cell">
                ${hasChildren ? `
                <button class="task-expand ${isExpanded ? 'expanded' : ''}" onclick="TasksPage.toggleTask('${escapedId}')">
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
            <div>${Components.progressBar(task.progress)}</div>
            <div>${Components.badge(task.status, AppData.getStatusBadgeClass(task.status))}</div>
            <div class="task-actions">
                <button class="task-action-btn edit" title="Edit" onclick="TasksPage.openEditTask('${escapedId}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                ${level === 0 ? `<button class="task-action-btn add-sub" title="Add Sub-Task" onclick="TasksPage.openSubTask('${escapedId}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>` : ''}
                <button class="task-action-btn delete" title="Delete" onclick="TasksPage.deleteTask('${escapedId}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
            </div>
        </div>`;

        if (hasChildren && isExpanded) {
            task.children.forEach(child => {
                html += this.renderTask(child, level + 1);
            });
        }

        return html;
    },

    // Find a task recursively in the hierarchy
    findTask(taskId, tasks) {
        for (const t of (tasks || AppData.tasks)) {
            if (t.id === taskId) return t;
            if (t.children) {
                const found = this.findTask(taskId, t.children);
                if (found) return found;
            }
        }
        return null;
    },

    openNewTask() {
        document.getElementById('taskModalTitle').textContent = 'New Task';
        document.getElementById('tmId').value = '';
        document.getElementById('tmParentId').value = '';
        document.getElementById('tmName').value = '';
        document.getElementById('tmProject').value = AppData.projects[0]?.id || '';
        document.getElementById('tmPriority').value = 'Medium';
        document.getElementById('tmStart').value = '';
        document.getElementById('tmEnd').value = '';
        document.getElementById('tmAssigned').value = (AppData.team[0] || {}).name || '';
        document.getElementById('tmStatus').value = 'Planned';
        document.getElementById('tmDuration').value = '';
        document.getElementById('tmProgress').value = '0';
        document.getElementById('tmDependency').value = '';
        this.editingTask = null;
        document.getElementById('taskModalOverlay').classList.add('open');
    },

    openEditTask(taskId) {
        const task = this.findTask(taskId);
        if (!task) return;
        document.getElementById('taskModalTitle').textContent = 'Edit Task';
        document.getElementById('tmId').value = task.id;
        document.getElementById('tmParentId').value = '';
        document.getElementById('tmName').value = task.name;
        document.getElementById('tmProject').value = task.projectId || '';
        document.getElementById('tmPriority').value = task.priority || 'Medium';
        document.getElementById('tmStart').value = task.startDate || '';
        document.getElementById('tmEnd').value = task.endDate || '';
        document.getElementById('tmAssigned').value = task.assignedTo || '';
        document.getElementById('tmStatus').value = task.status || 'Planned';
        document.getElementById('tmDuration').value = task.duration || '';
        document.getElementById('tmProgress').value = task.progress || 0;
        document.getElementById('tmDependency').value = task.dependency || '';
        this.editingTask = task;
        document.getElementById('taskModalOverlay').classList.add('open');
    },

    openSubTask(parentId) {
        const parent = this.findTask(parentId);
        if (!parent) return;
        document.getElementById('taskModalTitle').textContent = 'New Sub-Task (under ' + parent.name + ')';
        document.getElementById('tmId').value = '';
        document.getElementById('tmParentId').value = parentId;
        document.getElementById('tmName').value = '';
        document.getElementById('tmProject').value = parent.projectId || AppData.projects[0]?.id || '';
        document.getElementById('tmPriority').value = 'Medium';
        document.getElementById('tmStart').value = '';
        document.getElementById('tmEnd').value = '';
        document.getElementById('tmAssigned').value = parent.assignedTo || '';
        document.getElementById('tmStatus').value = 'Planned';
        document.getElementById('tmDuration').value = '';
        document.getElementById('tmProgress').value = '0';
        document.getElementById('tmDependency').value = '';
        this.editingTask = null;
        document.getElementById('taskModalOverlay').classList.add('open');
    },

    closeModal() {
        document.getElementById('taskModalOverlay').classList.remove('open');
        this.editingTask = null;
    },

    async saveTask() {
        const id = document.getElementById('tmId').value;
        const parentId = document.getElementById('tmParentId').value;
        const name = document.getElementById('tmName').value.trim();
        if (!name) { alert('Task name is required'); return; }

        const payload = {
            name,
            project_id: document.getElementById('tmProject').value,
            assigned_to: document.getElementById('tmAssigned').value,
            start_date: document.getElementById('tmStart').value || null,
            end_date: document.getElementById('tmEnd').value || null,
            duration: document.getElementById('tmDuration').value || '',
            dependency: document.getElementById('tmDependency').value || '',
            progress: parseInt(document.getElementById('tmProgress').value) || 0,
            status: document.getElementById('tmStatus').value,
            priority: document.getElementById('tmPriority').value
        };

        try {
            if (id) {
                // Update existing task
                payload.id = id;
                const res = await fetch('/api/tasks', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Failed to update task');
            } else {
                // Create new task
                payload.id = 'T' + String(Date.now()).slice(-6);
                if (parentId) payload.parent_id = parentId;
                const res = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Failed to create task');
            }

            this.closeModal();
            await this.reloadTasks();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    async deleteTask(taskId) {
        const task = this.findTask(taskId);
        if (!task) return;
        const hasChildren = task.children && task.children.length > 0;
        const msg = hasChildren
            ? `Delete "${task.name}" and all its sub-tasks?`
            : `Delete "${task.name}"?`;
        if (!confirm(msg)) return;

        try {
            const res = await fetch('/api/tasks', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId })
            });
            if (!res.ok) throw new Error('Failed to delete task');
            await this.reloadTasks();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    async reloadTasks() {
        try {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                AppData.tasks = data.map(t => AppData._mapTask(t));
            }
        } catch (e) {
            console.warn('Could not reload tasks:', e.message);
        }
        this.refresh();
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
                    <div>Progress</div>
                    <div>Status</div>
                    <div>Actions</div>
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

        // Close modal on overlay click
        const overlay = document.getElementById('taskModalOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) TasksPage.closeModal();
            });
        }
    }
};
