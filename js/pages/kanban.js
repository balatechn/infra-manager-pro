/* =============================================
   Infra Manager Pro — Kanban Board Page
   ============================================= */

const KanbanPage = {
    columns: [
        { id: 'backlog', label: 'Backlog', dotClass: 'backlog' },
        { id: 'planned', label: 'Planned', dotClass: 'planned' },
        { id: 'in-progress', label: 'In Progress', dotClass: 'in-progress' },
        { id: 'testing', label: 'Testing', dotClass: 'testing' },
        { id: 'completed', label: 'Completed', dotClass: 'completed' },
        { id: 'blocked', label: 'Blocked', dotClass: 'blocked' }
    ],

    draggedCard: null,

    render() {
        return `
        <div class="page-header">
            <h1>Kanban Board <small>Execution Tracking</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
                    Filter
                </button>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('createTaskModal').classList.add('open')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Task
                </button>
            </div>
        </div>

        <div class="kanban-filters">
            <input type="text" class="filter-input" placeholder="Search cards..." id="kanbanSearch">
            <select class="filter-input" id="kanbanProjectFilter">
                <option value="">All Projects</option>
                ${[...new Set(AppData.kanbanTasks.map(t => t.project))].map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <select class="filter-input" id="kanbanPriorityFilter">
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
        </div>

        <div class="kanban-wrapper" id="kanbanBoard">
            ${this.columns.map(col => {
                const tasks = AppData.kanbanTasks.filter(t => t.column === col.id);
                return `
                <div class="kanban-column" data-column="${col.id}">
                    <div class="kanban-column-header">
                        <div class="column-title">
                            <div class="column-dot ${col.dotClass}"></div>
                            <h4>${col.label}</h4>
                        </div>
                        <span class="column-count">${tasks.length}</span>
                    </div>
                    <div class="kanban-column-body" data-column="${col.id}"
                         ondragover="KanbanPage.handleDragOver(event)"
                         ondrop="KanbanPage.handleDrop(event, '${col.id}')"
                         ondragleave="KanbanPage.handleDragLeave(event)">
                        ${tasks.map(task => this.renderCard(task)).join('')}
                    </div>
                    <div style="padding:0 10px 10px;">
                        <button class="kanban-add-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Task
                        </button>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    },

    renderCard(task) {
        const priorityClass = task.priority === 'High' ? 'badge-priority-high' : task.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low';
        const avatarIdx = (task.assignee.charCodeAt(0) % 5) + 1;
        const initials = task.assignee.split(' ').map(n => n[0]).join('');
        const isOverdue = new Date(task.dueDate) < new Date() && task.column !== 'completed';

        return `
        <div class="kanban-card" draggable="true" data-task-id="${task.id}"
             ondragstart="KanbanPage.handleDragStart(event, '${task.id}')">
            <div class="kanban-card-header">
                <h5>${task.title}</h5>
                <span class="badge ${priorityClass}" style="flex-shrink:0;margin-left:8px;">${task.priority}</span>
            </div>
            <div class="kanban-card-project">${task.project}</div>
            <div class="kanban-card-tags">
                ${task.tags.map(tag => `<span class="kanban-tag ${tag}">${tag}</span>`).join('')}
            </div>
            <div class="kanban-card-footer">
                <div class="kanban-card-meta">
                    <div class="meta-item" style="${isOverdue ? 'color:var(--danger);' : ''}">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                        ${AppData.formatShortDate(task.dueDate)}
                    </div>
                    ${task.comments > 0 ? `<div class="meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        ${task.comments}
                    </div>` : ''}
                    ${task.attachments > 0 ? `<div class="meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                        ${task.attachments}
                    </div>` : ''}
                </div>
                <span class="avatar bg-${avatarIdx}" style="width:24px;height:24px;font-size:0.5625rem;" title="${task.assignee}">${initials}</span>
            </div>
        </div>`;
    },

    handleDragStart(event, taskId) {
        this.draggedCard = taskId;
        event.target.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
    },

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    },

    handleDragLeave(event) {
        event.currentTarget.classList.remove('drag-over');
    },

    handleDrop(event, columnId) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        
        if (this.draggedCard) {
            const task = AppData.kanbanTasks.find(t => t.id === this.draggedCard);
            if (task) {
                task.column = columnId;
                this.refreshBoard();
                // Persist to API
                fetch('/api/kanban', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: task.id, column_status: columnId })
                }).catch(() => {});
            }
            this.draggedCard = null;
        }
    },

    refreshBoard() {
        const board = document.getElementById('kanbanBoard');
        if (board) {
            board.innerHTML = this.columns.map(col => {
                const tasks = AppData.kanbanTasks.filter(t => t.column === col.id);
                return `
                <div class="kanban-column" data-column="${col.id}">
                    <div class="kanban-column-header">
                        <div class="column-title">
                            <div class="column-dot ${col.dotClass}"></div>
                            <h4>${col.label}</h4>
                        </div>
                        <span class="column-count">${tasks.length}</span>
                    </div>
                    <div class="kanban-column-body" data-column="${col.id}"
                         ondragover="KanbanPage.handleDragOver(event)"
                         ondrop="KanbanPage.handleDrop(event, '${col.id}')"
                         ondragleave="KanbanPage.handleDragLeave(event)">
                        ${tasks.map(task => this.renderCard(task)).join('')}
                    </div>
                    <div style="padding:0 10px 10px;">
                        <button class="kanban-add-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Task
                        </button>
                    </div>
                </div>`;
            }).join('');
        }
    },

    init() {
        const searchInput = document.getElementById('kanbanSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                document.querySelectorAll('.kanban-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }
    }
};
