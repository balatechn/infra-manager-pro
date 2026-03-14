/* =============================================
   Infra Manager Pro — Shared Components
   ============================================= */

const Components = {
    /**
     * Create a stat card HTML
     */
    statCard(title, value, change, changeType, iconClass, iconSvg) {
        return `
        <div class="stat-card">
            <div class="stat-info">
                <h4>${title}</h4>
                <div class="stat-value">${value}</div>
                ${change ? `<div class="stat-change ${changeType}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${changeType === 'positive' ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 9 12 15 18 9"/>'}
                    </svg>
                    ${change}
                </div>` : ''}
            </div>
            <div class="stat-icon ${iconClass}">
                ${iconSvg}
            </div>
        </div>`;
    },

    /**
     * Create a progress bar HTML
     */
    progressBar(progress, showText = true) {
        const color = AppData.getProgressColor(progress);
        return `
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div class="progress-fill ${color}" style="width:${progress}%"></div>
            </div>
            ${showText ? `<span class="progress-text">${progress}%</span>` : ''}
        </div>`;
    },

    /**
     * Create a badge
     */
    badge(text, className) {
        return `<span class="badge ${className}">${text}</span>`;
    },

    /**
     * Create avatar
     */
    avatar(initials, bgClass) {
        return `<span class="avatar ${bgClass}">${initials}</span>`;
    },

    /**
     * Create avatar stack from team array
     */
    avatarStack(team, max = 3) {
        const avatars = team.slice(0, max).map((name, i) => {
            const initials = name.split(' ').map(n => n[0]).join('');
            return `<span class="avatar bg-${(i % 5) + 1}">${initials}</span>`;
        }).join('');
        const extra = team.length > max ? `<span class="avatar bg-5">+${team.length - max}</span>` : '';
        return `<div class="avatar-stack">${avatars}${extra}</div>`;
    },

    /**
     * Create breadcrumbs
     */
    breadcrumbs(items) {
        return `<div class="breadcrumbs">${items.map((item, i) => {
            if (i === items.length - 1) {
                return `<span class="current">${item.label}</span>`;
            }
            return `<a href="#" onclick="App.navigate('${item.page}');return false;">${item.label}</a><span class="separator">/</span>`;
        }).join('')}</div>`;
    },

    /**
     * Create action buttons for table rows
     */
    actionButtons() {
        return `
        <div class="action-btns">
            <button class="action-btn" title="View">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="action-btn" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn" title="More">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
        </div>`;
    },

    /**
     * Create filter bar
     */
    filterBar(filters) {
        return `<div class="filter-bar">
            ${filters.map(f => {
                if (f.type === 'search') {
                    return `<input type="text" class="filter-input" placeholder="${f.placeholder}" id="${f.id || ''}">`;
                }
                if (f.type === 'select') {
                    return `<select class="filter-input" id="${f.id || ''}">
                        <option value="">${f.placeholder}</option>
                        ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
                    </select>`;
                }
                return '';
            }).join('')}
        </div>`;
    }
};
