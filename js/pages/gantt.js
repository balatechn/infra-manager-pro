/* =============================================
   Infra Manager Pro — Gantt Timeline Page
   ============================================= */

const GanttPage = {
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 6, 31), // Jul 31 2026
    zoomLevel: 'weeks', // 'weeks' | 'months' | 'quarters'
    editingTask: null,

    // Zoom configurations
    getZoomConfig() {
        const start = this.startDate;
        const end = this.endDate;
        if (this.zoomLevel === 'weeks') {
            const totalWeeks = Math.ceil((end - start) / (7 * 86400000));
            return { totalCols: totalWeeks, cellWidth: 80, unit: 'weeks' };
        } else if (this.zoomLevel === 'months') {
            const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
            return { totalCols: months, cellWidth: 160, unit: 'months' };
        } else {
            // quarters
            const startQ = Math.floor(start.getMonth() / 3);
            const endQ = Math.floor(end.getMonth() / 3);
            const quarters = (end.getFullYear() - start.getFullYear()) * 4 + endQ - startQ + 1;
            return { totalCols: quarters, cellWidth: 320, unit: 'quarters' };
        }
    },

    render() {
        const cfg = this.getZoomConfig();
        const totalWidth = cfg.totalCols * cfg.cellWidth;

        return `
        <div class="page-header">
            <h1>Gantt Timeline <small>Project Planning</small></h1>
            <div class="page-actions">
                <button class="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export PDF
                </button>
            </div>
        </div>

        <!-- Controls -->
        <div class="gantt-controls">
            <button class="gantt-zoom-btn ${this.zoomLevel === 'weeks' ? 'active' : ''}" data-zoom="weeks">Weeks</button>
            <button class="gantt-zoom-btn ${this.zoomLevel === 'months' ? 'active' : ''}" data-zoom="months">Months</button>
            <button class="gantt-zoom-btn ${this.zoomLevel === 'quarters' ? 'active' : ''}" data-zoom="quarters">Quarters</button>
            <div class="gantt-legend">
                <div class="gantt-legend-item"><div class="legend-color parent"></div> Parent Task</div>
                <div class="gantt-legend-item"><div class="legend-color child"></div> Sub Task</div>
                <div class="gantt-legend-item"><div class="legend-color critical"></div> Critical</div>
                <div class="gantt-legend-item"><div class="legend-color completed"></div> Completed</div>
                <div class="gantt-legend-item"><div class="legend-color milestone"></div> Milestone</div>
            </div>
        </div>

        <div class="gantt-wrapper" style="height: calc(100vh - 240px);">
            <!-- Left Panel - Task List -->
            <div class="gantt-left">
                <div class="gantt-left-header">
                    <div>Task Name</div>
                    <div>Assigned To</div>
                    <div>Due Date</div>
                    <div style="text-align:right">Duration</div>
                </div>
                <div class="gantt-task-list">
                    ${this.renderTaskList()}
                </div>
            </div>

            <!-- Right Panel - Timeline -->
            <div class="gantt-right">
                <div class="gantt-timeline-header" style="width:${totalWidth}px;">
                    ${this.renderTimelineHeader()}
                </div>
                <div class="gantt-rows" style="width:${totalWidth}px;">
                    ${this.renderGanttRows(cfg)}
                </div>
            </div>
        </div>

        <!-- Task Edit Modal -->
        <div class="task-modal-overlay" id="ganttModalOverlay">
            <div class="task-modal">
                <div class="task-modal-header">
                    <h3 id="ganttModalTitle">Edit Task</h3>
                    <button class="modal-close" onclick="GanttPage.closeModal()">&times;</button>
                </div>
                <div class="task-modal-body">
                    <input type="hidden" id="gmId">
                    <div class="form-group">
                        <label>Task Name</label>
                        <input type="text" class="form-input" id="gmName" placeholder="Enter task name">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Project</label>
                            <select class="form-input" id="gmProject">
                                ${AppData.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select class="form-input" id="gmPriority">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" class="form-input" id="gmStart">
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input type="date" class="form-input" id="gmEnd">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Assigned To</label>
                            <select class="form-input" id="gmAssigned">
                                ${(AppData.team || []).map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-input" id="gmStatus">
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
                            <input type="text" class="form-input" id="gmDuration" placeholder="e.g. 5 days">
                        </div>
                        <div class="form-group">
                            <label>Progress (%)</label>
                            <input type="number" class="form-input" id="gmProgress" min="0" max="100" value="0">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Dependency</label>
                        <input type="text" class="form-input" id="gmDependency" placeholder="e.g. T001">
                    </div>
                </div>
                <div class="task-modal-footer">
                    <button class="btn btn-danger btn-sm" onclick="GanttPage.deleteTask()" style="margin-right:auto">Delete</button>
                    <button class="btn btn-secondary" onclick="GanttPage.closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="GanttPage.saveTask()">Save</button>
                </div>
            </div>
        </div>`;
    },

    renderTaskList() {
        let html = '';
        AppData.tasks.forEach(task => {
            html += this.renderTaskItem(task, 0);
        });
        return html;
    },

    renderTaskItem(task, level) {
        const hasChildren = task.children && task.children.length > 0;
        const initials = task.assignedTo ? task.assignedTo.split(' ').map(n=>n[0]).join('') : '';
        const firstName = task.assignedTo ? task.assignedTo.split(' ')[0] : '—';
        const dueDate = task.endDate ? AppData.formatShortDate(task.endDate) : '—';
        const escapedId = task.id.replace(/'/g, "\\'");
        let html = `
        <div class="gantt-task-item level-${level}" onclick="GanttPage.openEditTask('${escapedId}')" title="Click to edit">
            <div class="gantt-task-name">
                ${hasChildren ? `<span class="expand-icon expanded"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></span>` : ''}
                <span>${task.name}</span>
            </div>
            <div class="gantt-task-assignee"><span class="avatar bg-${(task.assignedTo ? task.assignedTo.charCodeAt(0) % 5 : 0) + 1}" style="width:20px;height:20px;font-size:0.5rem;">${initials}</span> ${firstName}</div>
            <div class="gantt-task-due">${dueDate}</div>
            <div class="gantt-task-duration">${task.duration}</div>
        </div>`;

        if (hasChildren) {
            task.children.forEach(child => {
                html += this.renderTaskItem(child, level + 1);
            });
        }
        return html;
    },

    renderTimelineHeader() {
        const cfg = this.getZoomConfig();
        let html = '';

        if (cfg.unit === 'weeks') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
            const weeksPerMonth = [4, 4, 5, 4, 4, 5, 4];
            months.forEach((month, i) => {
                const weeks = weeksPerMonth[i];
                html += `<div class="gantt-month-group" style="width:${weeks * cfg.cellWidth}px;">
                    <div class="gantt-month-label">${month} 2026</div>
                    <div class="gantt-weeks">`;
                for (let w = 0; w < weeks; w++) {
                    const weekNum = weeksPerMonth.slice(0, i).reduce((a, b) => a + b, 0) + w + 1;
                    const isToday = month === 'Mar' && (w === 1 || w === 2);
                    html += `<div class="gantt-week ${isToday ? 'today' : ''}" style="width:${cfg.cellWidth}px;">W${weekNum}</div>`;
                }
                html += '</div></div>';
            });
        } else if (cfg.unit === 'months') {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
            monthNames.forEach((month, i) => {
                const isCurrent = i === 2; // March
                html += `<div class="gantt-month-group" style="width:${cfg.cellWidth}px;">
                    <div class="gantt-month-label" style="line-height:42px;">${month} 2026</div>
                </div>`;
            });
        } else {
            // Quarters
            const qLabels = ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul)'];
            qLabels.forEach((label, i) => {
                html += `<div class="gantt-month-group" style="width:${cfg.cellWidth}px;">
                    <div class="gantt-month-label" style="line-height:42px;">${label} 2026</div>
                </div>`;
            });
        }
        return html;
    },

    renderGanttRows(cfg) {
        let html = '';
        let rowIndex = 0;
        
        AppData.tasks.forEach(task => {
            html += this.renderGanttRow(task, cfg, rowIndex, true);
            rowIndex++;
            if (task.children) {
                task.children.forEach(child => {
                    html += this.renderGanttRow(child, cfg, rowIndex, false);
                    rowIndex++;
                    if (child.children) {
                        child.children.forEach(gc => {
                            html += this.renderGanttRow(gc, cfg, rowIndex, false);
                            rowIndex++;
                        });
                    }
                });
            }
        });
        return html;
    },

    renderGanttRow(task, cfg, rowIndex, isParent) {
        const offset = this.getOffset(task.startDate, cfg);
        const endOffset = this.getOffset(task.endDate, cfg);
        const barLeft = offset * cfg.cellWidth;
        const barWidth = Math.max((endOffset - offset) * cfg.cellWidth, 20);

        let barClass = isParent ? 'parent' : 'child';
        if (task.progress === 100) barClass = 'completed';
        if (task.priority === 'High' && task.progress === 0 && task.dependency) barClass += ' critical';

        const escapedId = task.id.replace(/'/g, "\\'");

        // Background grid cells
        let cells = '';
        for (let i = 0; i < cfg.totalCols; i++) {
            const isToday = cfg.unit === 'weeks' ? (i >= 9 && i <= 11) : cfg.unit === 'months' ? (i === 2) : (i === 0);
            cells += `<div class="gantt-cell ${isToday ? 'today' : ''}" style="width:${cfg.cellWidth}px;"></div>`;
        }

        return `
        <div class="gantt-row">
            <div class="gantt-row-bg">${cells}</div>
            <div class="gantt-bar ${barClass}" style="left:${barLeft}px;width:${barWidth}px;" title="${task.name} (${task.progress}%)" data-tooltip="${task.name}" onclick="GanttPage.openEditTask('${escapedId}')">
                ${barWidth > 60 ? task.name : ''}
            </div>
        </div>`;
    },

    getOffset(dateStr, cfg) {
        const date = new Date(dateStr);
        const diffMs = date - this.startDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (cfg.unit === 'weeks') {
            return Math.max(0, diffDays / 7);
        } else if (cfg.unit === 'months') {
            // Fractional month offset
            const monthDiff = (date.getFullYear() - this.startDate.getFullYear()) * 12 + date.getMonth() - this.startDate.getMonth();
            const dayInMonth = date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            return Math.max(0, monthDiff + dayInMonth);
        } else {
            // Fractional quarter offset
            const monthDiff = (date.getFullYear() - this.startDate.getFullYear()) * 12 + date.getMonth() - this.startDate.getMonth();
            const dayInMonth = date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            return Math.max(0, (monthDiff + dayInMonth) / 3);
        }
    },

    // === Task Edit Modal ===
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

    openEditTask(taskId) {
        const task = this.findTask(taskId);
        if (!task) return;
        document.getElementById('ganttModalTitle').textContent = 'Edit Task';
        document.getElementById('gmId').value = task.id;
        document.getElementById('gmName').value = task.name;
        document.getElementById('gmProject').value = task.projectId || '';
        document.getElementById('gmPriority').value = task.priority || 'Medium';
        document.getElementById('gmStart').value = task.startDate || '';
        document.getElementById('gmEnd').value = task.endDate || '';
        document.getElementById('gmAssigned').value = task.assignedTo || '';
        document.getElementById('gmStatus').value = task.status || 'Planned';
        document.getElementById('gmDuration').value = task.duration || '';
        document.getElementById('gmProgress').value = task.progress || 0;
        document.getElementById('gmDependency').value = task.dependency || '';
        this.editingTask = task;
        document.getElementById('ganttModalOverlay').classList.add('open');
    },

    closeModal() {
        document.getElementById('ganttModalOverlay').classList.remove('open');
        this.editingTask = null;
    },

    async saveTask() {
        const id = document.getElementById('gmId').value;
        const name = document.getElementById('gmName').value.trim();
        if (!name) { alert('Task name is required'); return; }

        const payload = {
            id,
            name,
            project_id: document.getElementById('gmProject').value,
            assigned_to: document.getElementById('gmAssigned').value,
            start_date: document.getElementById('gmStart').value || null,
            end_date: document.getElementById('gmEnd').value || null,
            duration: document.getElementById('gmDuration').value || '',
            dependency: document.getElementById('gmDependency').value || '',
            progress: parseInt(document.getElementById('gmProgress').value) || 0,
            status: document.getElementById('gmStatus').value,
            priority: document.getElementById('gmPriority').value
        };

        try {
            const res = await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to update task');
            this.closeModal();
            await this.reloadAndRefresh();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    async deleteTask() {
        if (!this.editingTask) return;
        const task = this.editingTask;
        const hasChildren = task.children && task.children.length > 0;
        const msg = hasChildren
            ? `Delete "${task.name}" and all its sub-tasks?`
            : `Delete "${task.name}"?`;
        if (!confirm(msg)) return;

        try {
            const res = await fetch('/api/tasks', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id })
            });
            if (!res.ok) throw new Error('Failed to delete task');
            this.closeModal();
            await this.reloadAndRefresh();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    async reloadAndRefresh() {
        try {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                AppData.tasks = data.map(t => AppData._mapTask(t));
            }
        } catch (e) {
            console.warn('Could not reload tasks:', e.message);
        }
        // Re-render the gantt content
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.render();
            this.init();
        }
    },

    setZoom(level) {
        this.zoomLevel = level;
        // Re-render the gantt content
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.render();
            this.init();
        }
    },

    init() {
        // Zoom button clicks
        document.querySelectorAll('.gantt-zoom-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const zoom = btn.dataset.zoom;
                if (zoom) GanttPage.setZoom(zoom);
            });
        });

        // Sync scroll between left and right panels
        const rightPanel = document.querySelector('.gantt-right');
        const leftList = document.querySelector('.gantt-task-list');
        if (rightPanel && leftList) {
            rightPanel.addEventListener('scroll', () => {
                leftList.scrollTop = rightPanel.scrollTop;
            });
            leftList.addEventListener('scroll', () => {
                rightPanel.scrollTop = leftList.scrollTop;
            });
        }

        // Close modal on overlay click
        const overlay = document.getElementById('ganttModalOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) GanttPage.closeModal();
            });
        }
    }
};
