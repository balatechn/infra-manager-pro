/* =============================================
   Infra Manager Pro — Gantt Timeline Page
   ============================================= */

const GanttPage = {
    // Generate months: Jan 2026 to Jul 2026
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    weeksPerMonth: [4, 4, 5, 4, 4, 5, 4],
    startDate: new Date(2026, 0, 1),
    cellWidth: 80,

    render() {
        const totalWeeks = this.weeksPerMonth.reduce((a, b) => a + b, 0);

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
            <button class="gantt-zoom-btn active">Weeks</button>
            <button class="gantt-zoom-btn">Months</button>
            <button class="gantt-zoom-btn">Quarters</button>
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
                <div class="gantt-timeline-header" style="width:${totalWeeks * this.cellWidth}px;">
                    ${this.renderTimelineHeader()}
                </div>
                <div class="gantt-rows" style="width:${totalWeeks * this.cellWidth}px;">
                    ${this.renderGanttRows(totalWeeks)}
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
        let html = `
        <div class="gantt-task-item level-${level}">
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
        let html = '';
        this.months.forEach((month, i) => {
            const weeks = this.weeksPerMonth[i];
            html += `<div class="gantt-month-group" style="width:${weeks * this.cellWidth}px;">
                <div class="gantt-month-label">${month} 2026</div>
                <div class="gantt-weeks">`;
            for (let w = 0; w < weeks; w++) {
                const weekNum = this.weeksPerMonth.slice(0, i).reduce((a, b) => a + b, 0) + w + 1;
                const isToday = month === 'Mar' && (w === 1 || w === 2);
                html += `<div class="gantt-week ${isToday ? 'today' : ''}" style="width:${this.cellWidth}px;">W${weekNum}</div>`;
            }
            html += '</div></div>';
        });
        return html;
    },

    renderGanttRows(totalWeeks) {
        let html = '';
        let rowIndex = 0;
        
        AppData.tasks.forEach(task => {
            html += this.renderGanttRow(task, totalWeeks, rowIndex, true);
            rowIndex++;
            if (task.children) {
                task.children.forEach(child => {
                    html += this.renderGanttRow(child, totalWeeks, rowIndex, false);
                    rowIndex++;
                    if (child.children) {
                        child.children.forEach(gc => {
                            html += this.renderGanttRow(gc, totalWeeks, rowIndex, false);
                            rowIndex++;
                        });
                    }
                });
            }
        });
        return html;
    },

    renderGanttRow(task, totalWeeks, rowIndex, isParent) {
        const start = this.getWeekOffset(task.startDate);
        const end = this.getWeekOffset(task.endDate);
        const barLeft = start * this.cellWidth;
        const barWidth = Math.max((end - start) * this.cellWidth, 20);

        let barClass = isParent ? 'parent' : 'child';
        if (task.progress === 100) barClass = 'completed';
        if (task.priority === 'High' && task.progress === 0 && task.dependency) barClass += ' critical';

        // Background grid cells
        let cells = '';
        for (let i = 0; i < totalWeeks; i++) {
            const isToday = i >= 9 && i <= 11; // ~March weeks
            cells += `<div class="gantt-cell ${isToday ? 'today' : ''}" style="width:${this.cellWidth}px;"></div>`;
        }

        return `
        <div class="gantt-row">
            <div class="gantt-row-bg">${cells}</div>
            <div class="gantt-bar ${barClass}" style="left:${barLeft}px;width:${barWidth}px;" title="${task.name} (${task.progress}%)" data-tooltip="${task.name}">
                ${barWidth > 60 ? task.name : ''}
            </div>
        </div>`;
    },

    getWeekOffset(dateStr) {
        const date = new Date(dateStr);
        const diffMs = date - this.startDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.max(0, diffDays / 7);
    },

    init() {
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
    }
};
