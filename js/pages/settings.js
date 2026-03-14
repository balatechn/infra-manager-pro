/* =============================================
   Infra Manager Pro — Settings Page
   (User Management + Role-Based Access Control)
   ============================================= */

const SettingsPage = {
    users: [],
    roles: [],
    allPermissions: [],
    groupedPermissions: {},
    selectedRoleId: null,
    _selectedRoleData: null,

    render() {
        return `
        <div class="page-header">
            <h1>Settings <small>Admin Controls</small></h1>
        </div>

        <div class="settings-layout">
            <div>
                <div class="settings-nav">
                    <div class="settings-nav-item active" onclick="SettingsPage.switchSection(this, 'general')">General</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'notifications')">Notifications</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'integrations')">Integrations</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'security')">Security</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'billing')">Billing</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'users')">User Management</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'roles')">Roles &amp; Permissions</div>
                </div>
            </div>

            <div id="settingsContent">
                ${this.renderGeneral()}
            </div>
        </div>

        <!-- Add/Edit User Modal -->
        <div class="modal-overlay" id="userModal">
            <div class="modal-panel">
                <h3 id="userModalTitle">Add New User</h3>
                <input type="hidden" id="editUserId">
                <div class="form-row">
                    <div class="form-group"><label>Full Name</label><input type="text" class="form-input" id="userName" placeholder="e.g. Arun Kumar"></div>
                    <div class="form-group"><label>Email</label><input type="email" class="form-input" id="userEmail" placeholder="e.g. arun@company.io"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Role</label><select class="form-input" id="userRole"></select></div>
                    <div class="form-group"><label>Department</label><input type="text" class="form-input" id="userDept" placeholder="e.g. Network Engineering"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Phone</label><input type="text" class="form-input" id="userPhone" placeholder="+91 98765 43210"></div>
                    <div class="form-group"><label>Status</label><select class="form-input" id="userStatus"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary btn-sm" onclick="SettingsPage.closeUserModal()">Cancel</button>
                    <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveUser()">Save User</button>
                </div>
            </div>
        </div>

        <!-- Reset Password Modal -->
        <div class="modal-overlay" id="resetPwdModal">
            <div class="modal-panel">
                <h3>Reset Password</h3>
                <input type="hidden" id="resetPwdUserId">
                <p style="font-size:0.85rem;color:var(--text-secondary);margin:0 0 16px;">Set a new password for <strong id="resetPwdUserName"></strong></p>
                <div class="form-group"><label>New Password</label><input type="password" class="form-input" id="resetPwdNew" placeholder="Enter new password"></div>
                <div class="form-group"><label>Confirm Password</label><input type="password" class="form-input" id="resetPwdConfirm" placeholder="Confirm new password"></div>
                <div id="resetPwdError" style="color:#EF4444;font-size:0.8rem;min-height:20px;margin-bottom:6px;"></div>
                <div class="modal-actions">
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('resetPwdModal').classList.remove('open')">Cancel</button>
                    <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveResetPassword()">Reset Password</button>
                </div>
            </div>
        </div>

        <!-- Add/Edit Role Modal -->
        <div class="modal-overlay" id="roleModal">
            <div class="modal-panel">
                <h3 id="roleModalTitle">Create New Role</h3>
                <input type="hidden" id="editRoleId">
                <div class="form-group"><label>Role Name</label><input type="text" class="form-input" id="roleName" placeholder="e.g. Team Lead"></div>
                <div class="form-group"><label>Description</label><input type="text" class="form-input" id="roleDesc" placeholder="Brief description of this role..."></div>
                <div class="form-group">
                    <label>Color</label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${['#EF4444','#F59E0B','#22C55E','#2563EB','#8B5CF6','#EC4899','#06B6D4','#94A3B8'].map(c =>
                            `<div class="color-pick" data-color="${c}" onclick="SettingsPage.pickRoleColor(this)" style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;border:2px solid transparent;"></div>`
                        ).join('')}
                    </div>
                    <input type="hidden" id="roleColor" value="#2563EB">
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary btn-sm" onclick="SettingsPage.closeRoleModal()">Cancel</button>
                    <button class="btn btn-primary btn-sm" onclick="SettingsPage.saveRole()">Save Role</button>
                </div>
            </div>
        </div>`;
    },

    /* ===== General ===== */
    renderGeneral() {
        return `
        <div class="settings-section">
            <h3>General Settings</h3>
            <p class="desc">Manage your workspace and application preferences.</p>
            <div class="form-group"><label>Organization Name</label><input type="text" class="form-input" value="Infra Manager Pro"></div>
            <div class="form-group"><label>Default Time Zone</label><select class="form-input"><option>Asia/Kolkata (IST, UTC+5:30)</option><option>UTC</option><option>Asia/Singapore (SGT, UTC+8:00)</option></select></div>
            <div class="form-group"><label>Date Format</label><select class="form-input"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
            <div class="form-group"><label>Currency</label><select class="form-input"><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select></div>
            <div style="margin-top:24px;">
                <h3 style="font-size:0.9375rem;">Preferences</h3>
                <div class="setting-row"><div class="setting-label"><h4>Dark Mode</h4><p>Use dark theme across the application</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                <div class="setting-row"><div class="setting-label"><h4>Compact View</h4><p>Reduce spacing for denser information display</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
                <div class="setting-row"><div class="setting-label"><h4>Auto-refresh Dashboard</h4><p>Automatically refresh dashboard data every 5 minutes</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                <div class="setting-row"><div class="setting-label"><h4>Show Weekend in Gantt</h4><p>Display weekend days in Gantt timeline view</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
            </div>
            <div style="margin-top:20px;display:flex;gap:8px;">
                <button class="btn btn-primary">Save Changes</button>
                <button class="btn btn-secondary">Reset</button>
            </div>
        </div>`;
    },

    /* ===== Notifications ===== */
    renderNotifications() {
        return `
        <div class="settings-section">
            <h3>Notification Settings</h3>
            <p class="desc">Configure how and when you receive notifications.</p>
            <div class="setting-row"><div class="setting-label"><h4>Email Notifications</h4><p>Receive email alerts for important updates</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
            <div class="setting-row"><div class="setting-label"><h4>Task Assignments</h4><p>Get notified when a task is assigned to you</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
            <div class="setting-row"><div class="setting-label"><h4>Project Updates</h4><p>Get notified about project status changes</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
            <div class="setting-row"><div class="setting-label"><h4>Budget Alerts</h4><p>Alert when project exceeds 80% budget</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
            <div class="setting-row"><div class="setting-label"><h4>Deadline Reminders</h4><p>Remind 3 days before task deadlines</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
            <div class="setting-row"><div class="setting-label"><h4>Weekly Digest</h4><p>Receive weekly summary report via email</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
            <div style="margin-top:20px;"><button class="btn btn-primary">Save Changes</button></div>
        </div>`;
    },

    /* ===== Integrations ===== */
    renderIntegrations() {
        const integrations = [
            { name:'Microsoft Teams', desc:'Send notifications to Teams channels', icon:'📧', bg:'--primary-bg', connected:false },
            { name:'Slack', desc:'Integration for real-time updates', icon:'💬', bg:'--success-bg', connected:true },
            { name:'Jira', desc:'Sync tasks with Jira issues', icon:'📦', bg:'--warning-bg', connected:false },
            { name:'Google Calendar', desc:'Sync milestones and deadlines', icon:'📅', bg:'--info-bg', connected:false }
        ];
        return `
        <div class="settings-section">
            <h3>Integrations</h3>
            <p class="desc">Connect with third-party tools and services.</p>
            ${integrations.map(i => `
                <div class="setting-row">
                    <div class="setting-label" style="display:flex;align-items:center;gap:12px;">
                        <div style="width:36px;height:36px;background:var(${i.bg});border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">${i.icon}</div>
                        <div><h4>${i.name}</h4><p>${i.desc}</p></div>
                    </div>
                    ${i.connected ? '<span class="badge badge-active">Connected</span>' : '<button class="btn btn-outline btn-sm">Connect</button>'}
                </div>`).join('')}
        </div>`;
    },

    /* ===== USER MANAGEMENT ===== */
    renderUsers() {
        const active = this.users.filter(u => u.status === 'Active').length;
        const inactive = this.users.filter(u => u.status === 'Inactive').length;
        return `
        <div class="settings-section">
            <div class="user-mgmt-header">
                <div><h3>User Management</h3><p class="desc" style="margin-bottom:0;">Manage users, assign roles, and control access.</p></div>
                <button class="btn btn-primary btn-sm" onclick="SettingsPage.openUserModal()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add User
                </button>
            </div>
            <div class="user-mgmt-stats">
                <div class="user-stat-card"><div class="stat-val">${this.users.length}</div><div class="stat-lbl">Total Users</div></div>
                <div class="user-stat-card"><div class="stat-val" style="color:var(--success)">${active}</div><div class="stat-lbl">Active</div></div>
                <div class="user-stat-card"><div class="stat-val" style="color:var(--text-muted)">${inactive}</div><div class="stat-lbl">Inactive</div></div>
                <div class="user-stat-card"><div class="stat-val" style="color:var(--primary-light)">${this.roles.length}</div><div class="stat-lbl">Roles</div></div>
            </div>
            <div style="margin-bottom:12px;">
                <input type="text" class="form-input" placeholder="Search users by name, email, role..." id="userSearchInput" oninput="SettingsPage.filterUsers(this.value)" style="max-width:360px;">
            </div>
            <table class="data-table">
                <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Last Active</th><th style="width:150px;">Actions</th></tr></thead>
                <tbody id="usersTableBody">${this.renderUserRows(this.users)}</tbody>
            </table>
        </div>`;
    },

    renderUserRows(users) {
        if (!users.length) return '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">No users found</td></tr>';
        return users.map(u => {
            const roleName = u.role_name || 'Unassigned';
            const roleColor = u.role_color || '#94A3B8';
            const statusCls = u.status === 'Active' ? 'active' : 'inactive';
            const lastActive = u.last_active ? this.timeAgo(u.last_active) : 'Never';
            return `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span class="avatar ${u.avatar || 'bg-1'}" style="width:32px;height:32px;font-size:0.625rem;">${this.escapeHtml(u.initials || '')}</span>
                        <div><div style="font-weight:600;font-size:0.8125rem;">${this.escapeHtml(u.name)}</div><div style="font-size:0.6875rem;color:var(--text-muted);">${this.escapeHtml(u.email)}</div></div>
                    </div>
                </td>
                <td><span class="role-badge"><span class="role-dot" style="background:${roleColor}"></span>${this.escapeHtml(roleName)}</span></td>
                <td style="font-size:0.8125rem;">${this.escapeHtml(u.department || '—')}</td>
                <td><span style="display:flex;align-items:center;gap:6px;font-size:0.8125rem;"><span class="status-dot ${statusCls}"></span>${u.status}</span></td>
                <td style="font-size:0.75rem;color:var(--text-muted);">${lastActive}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" title="Edit" onclick="SettingsPage.openUserModal(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button class="action-btn" title="Reset Password" onclick="SettingsPage.openResetPassword(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></button>
                        <button class="action-btn" title="${u.status==='Active'?'Deactivate':'Activate'}" onclick="SettingsPage.toggleUserStatus(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${u.status==='Active'?'<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>':'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}</svg></button>
                        <button class="action-btn" title="Delete" onclick="SettingsPage.deleteUser(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    },

    filterUsers(query) {
        const q = query.toLowerCase();
        const filtered = this.users.filter(u =>
            u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
            (u.role_name||'').toLowerCase().includes(q) || (u.department||'').toLowerCase().includes(q)
        );
        document.getElementById('usersTableBody').innerHTML = this.renderUserRows(filtered);
    },

    openUserModal(userId) {
        const modal = document.getElementById('userModal');
        document.getElementById('userRole').innerHTML = this.roles.map(r => `<option value="${r.id}">${this.escapeHtml(r.name)}</option>`).join('');
        if (userId) {
            const user = this.users.find(u => u.id === userId);
            if (!user) return;
            document.getElementById('userModalTitle').textContent = 'Edit User';
            document.getElementById('editUserId').value = userId;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role_id || '';
            document.getElementById('userDept').value = user.department || '';
            document.getElementById('userPhone').value = user.phone || '';
            document.getElementById('userStatus').value = user.status;
        } else {
            document.getElementById('userModalTitle').textContent = 'Add New User';
            document.getElementById('editUserId').value = '';
            document.getElementById('userName').value = '';
            document.getElementById('userEmail').value = '';
            document.getElementById('userDept').value = '';
            document.getElementById('userPhone').value = '';
            document.getElementById('userStatus').value = 'Active';
        }
        modal.classList.add('open');
    },

    closeUserModal() { document.getElementById('userModal').classList.remove('open'); },

    async saveUser() {
        const id = document.getElementById('editUserId').value;
        const payload = {
            name: document.getElementById('userName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            role_id: parseInt(document.getElementById('userRole').value),
            department: document.getElementById('userDept').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            status: document.getElementById('userStatus').value
        };
        if (!payload.name || !payload.email) { alert('Name and email are required.'); return; }

        try {
            const method = id ? 'PUT' : 'POST';
            if (id) payload.id = parseInt(id);
            const res = await fetch('/api/users', { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            if (!res.ok) { const err = await res.json(); alert(err.error || 'Failed to save user'); return; }
            const saved = await res.json();
            if (id) { const idx = this.users.findIndex(u => u.id === parseInt(id)); if (idx >= 0) this.users[idx] = saved; }
            else this.users.push(saved);
            this.closeUserModal();
            document.getElementById('settingsContent').innerHTML = this.renderUsers();
        } catch(e) { alert('Network error. Please try again.'); }
    },

    async toggleUserStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        try {
            const res = await fetch('/api/users', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: userId, status: user.status === 'Active' ? 'Inactive' : 'Active' }) });
            if (res.ok) { const updated = await res.json(); const idx = this.users.findIndex(u => u.id === userId); if (idx >= 0) this.users[idx] = updated; document.getElementById('settingsContent').innerHTML = this.renderUsers(); }
        } catch(e) {}
    },

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user || !confirm('Delete user "' + user.name + '"? This cannot be undone.')) return;
        try {
            const res = await fetch('/api/users?id=' + userId, { method:'DELETE' });
            if (res.ok) { this.users = this.users.filter(u => u.id !== userId); document.getElementById('settingsContent').innerHTML = this.renderUsers(); }
        } catch(e) {}
    },

    openResetPassword(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        document.getElementById('resetPwdUserId').value = userId;
        document.getElementById('resetPwdUserName').textContent = user.name + ' (' + user.email + ')';
        document.getElementById('resetPwdNew').value = '';
        document.getElementById('resetPwdConfirm').value = '';
        document.getElementById('resetPwdError').textContent = '';
        document.getElementById('resetPwdModal').classList.add('open');
    },

    saveResetPassword() {
        const userId = document.getElementById('resetPwdUserId').value;
        const newPwd = document.getElementById('resetPwdNew').value;
        const confirmPwd = document.getElementById('resetPwdConfirm').value;
        const errorEl = document.getElementById('resetPwdError');

        if (!newPwd || newPwd.length < 6) { errorEl.textContent = 'Password must be at least 6 characters'; return; }
        if (newPwd !== confirmPwd) { errorEl.textContent = 'Passwords do not match'; return; }

        // Update login credentials if resetting for the logged-in admin
        const session = JSON.parse(localStorage.getItem('infraSession') || '{}');
        const user = this.users.find(u => u.id === parseInt(userId));
        if (user && user.email === session.email) {
            localStorage.setItem('infraAdminPwd', newPwd);
        }
        // Store the password hash for the user (client-side for demo)
        const pwdStore = JSON.parse(localStorage.getItem('infraUserPwds') || '{}');
        pwdStore[userId] = newPwd;
        localStorage.setItem('infraUserPwds', JSON.stringify(pwdStore));

        document.getElementById('resetPwdModal').classList.remove('open');
        alert('Password reset successfully for ' + (user ? user.name : 'user') + '.');
    },

    /* ===== ROLES & PERMISSIONS ===== */
    renderRoles() {
        return `
        <div class="settings-section">
            <div class="user-mgmt-header">
                <div><h3>Roles &amp; Permissions</h3><p class="desc" style="margin-bottom:0;">Define roles and control what each role can access.</p></div>
                <button class="btn btn-primary btn-sm" onclick="SettingsPage.openRoleModal()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Create Role
                </button>
            </div>
            <div class="role-cards" id="roleCards">${this.roles.map(r => this.renderRoleCard(r)).join('')}</div>
            <div id="rolePermissions">${this.selectedRoleId ? this.renderPermissionsPanel() : '<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:0.875rem;">Select a role above to view and manage its permissions</div>'}</div>
        </div>`;
    },

    renderRoleCard(role) {
        const sel = this.selectedRoleId === role.id;
        return `
        <div class="role-card ${sel?'selected':''}" onclick="SettingsPage.selectRole(${role.id}, this)">
            <div class="role-card-header">
                <h4><span class="role-dot" style="background:${role.color};width:10px;height:10px;border-radius:50%;display:inline-block;"></span> ${this.escapeHtml(role.name)}
                ${role.is_system ? ' <span style="font-size:0.5625rem;background:var(--bg-tertiary);padding:1px 6px;border-radius:8px;font-weight:400;color:var(--text-muted);">System</span>' : ''}</h4>
                ${!role.is_system ? `<button class="action-btn" title="Edit" onclick="event.stopPropagation();SettingsPage.openRoleModal(${role.id})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>` : ''}
            </div>
            <p>${this.escapeHtml(role.description || '')}</p>
            <div class="role-card-footer"><span>${role.user_count||0} user${(role.user_count||0)!==1?'s':''}</span><span>${role.permission_count||0} permissions</span></div>
        </div>`;
    },

    async selectRole(roleId, cardEl) {
        this.selectedRoleId = roleId;
        try { const res = await fetch('/api/roles?id=' + roleId); if (res.ok) this._selectedRoleData = await res.json(); } catch(e) {}
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        if (cardEl) cardEl.classList.add('selected');
        document.getElementById('rolePermissions').innerHTML = this.renderPermissionsPanel();
    },

    renderPermissionsPanel() {
        const role = this._selectedRoleData;
        if (!role) return '';
        const rolePermIds = new Set((role.permissions||[]).map(p => p.id));
        const moduleIcons = { Dashboard:'📊', Projects:'📁', Tasks:'✅', Kanban:'📋', Gantt:'📈', Teams:'👥', Reports:'📑', Assets:'🖥️', Settings:'⚙️', Users:'🔐' };
        return `
        <div style="border-top:1px solid var(--border-light);padding-top:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-size:0.9375rem;display:flex;align-items:center;gap:8px;">
                    <span class="role-dot" style="background:${role.color};width:10px;height:10px;border-radius:50%;display:inline-block;"></span>
                    ${this.escapeHtml(role.name)} — Permissions
                </h3>
                <button class="btn btn-primary btn-sm" onclick="SettingsPage.savePermissions(${role.id})">Save Permissions</button>
            </div>
            <div class="perm-grid">
                ${Object.entries(this.groupedPermissions).map(([mod, perms]) => `
                    <div class="perm-module">
                        <h5><span class="module-icon">${moduleIcons[mod]||'📦'}</span>${mod}<span style="font-weight:400;font-size:0.625rem;color:var(--text-muted);margin-left:auto;">${perms.filter(p=>rolePermIds.has(p.id)).length}/${perms.length}</span></h5>
                        ${perms.map(p => `<div class="perm-item"><label><input type="checkbox" value="${p.id}" data-perm-id="${p.id}" ${rolePermIds.has(p.id)?'checked':''}> ${this.escapeHtml(p.name)}</label></div>`).join('')}
                    </div>`).join('')}
            </div>
        </div>`;
    },

    async savePermissions(roleId) {
        const perms = [];
        document.querySelectorAll('[data-perm-id]').forEach(cb => { if (cb.checked) perms.push(parseInt(cb.value)); });
        try {
            const res = await fetch('/api/roles', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: roleId, permissions: perms }) });
            if (res.ok) {
                await this.loadData();
                document.getElementById('settingsContent').innerHTML = this.renderRoles();
                this.selectedRoleId = roleId;
                const rRes = await fetch('/api/roles?id=' + roleId);
                if (rRes.ok) this._selectedRoleData = await rRes.json();
                document.getElementById('rolePermissions').innerHTML = this.renderPermissionsPanel();
                document.querySelectorAll('.role-card').forEach(c => { if (c.getAttribute('onclick') && c.getAttribute('onclick').includes(roleId)) c.classList.add('selected'); });
            }
        } catch(e) { alert('Failed to save permissions.'); }
    },

    openRoleModal(roleId) {
        const modal = document.getElementById('roleModal');
        if (roleId) {
            const role = this.roles.find(r => r.id === roleId);
            if (!role) return;
            document.getElementById('roleModalTitle').textContent = 'Edit Role';
            document.getElementById('editRoleId').value = roleId;
            document.getElementById('roleName').value = role.name;
            document.getElementById('roleDesc').value = role.description || '';
            document.getElementById('roleColor').value = role.color || '#2563EB';
            document.querySelectorAll('.color-pick').forEach(c => { c.style.border = c.dataset.color === role.color ? '2px solid white' : '2px solid transparent'; });
        } else {
            document.getElementById('roleModalTitle').textContent = 'Create New Role';
            document.getElementById('editRoleId').value = '';
            document.getElementById('roleName').value = '';
            document.getElementById('roleDesc').value = '';
            document.getElementById('roleColor').value = '#2563EB';
            document.querySelectorAll('.color-pick').forEach(c => { c.style.border = c.dataset.color === '#2563EB' ? '2px solid white' : '2px solid transparent'; });
        }
        modal.classList.add('open');
    },

    closeRoleModal() { document.getElementById('roleModal').classList.remove('open'); },

    pickRoleColor(el) {
        document.querySelectorAll('.color-pick').forEach(c => c.style.border = '2px solid transparent');
        el.style.border = '2px solid white';
        document.getElementById('roleColor').value = el.dataset.color;
    },

    async saveRole() {
        const id = document.getElementById('editRoleId').value;
        const payload = { name: document.getElementById('roleName').value.trim(), description: document.getElementById('roleDesc').value.trim(), color: document.getElementById('roleColor').value };
        if (!payload.name) { alert('Role name is required.'); return; }
        try {
            const method = id ? 'PUT' : 'POST';
            if (id) payload.id = parseInt(id);
            const res = await fetch('/api/roles', { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            if (!res.ok) { const err = await res.json(); alert(err.error || 'Failed to save role'); return; }
            await this.loadData();
            this.closeRoleModal();
            document.getElementById('settingsContent').innerHTML = this.renderRoles();
        } catch(e) { alert('Network error. Please try again.'); }
    },

    /* ===== Section Switcher ===== */
    switchSection(el, section) {
        document.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        const content = document.getElementById('settingsContent');
        switch(section) {
            case 'general': content.innerHTML = this.renderGeneral(); break;
            case 'notifications': content.innerHTML = this.renderNotifications(); break;
            case 'integrations': content.innerHTML = this.renderIntegrations(); break;
            case 'users': content.innerHTML = this.renderUsers(); break;
            case 'roles':
                this.selectedRoleId = null;
                this._selectedRoleData = null;
                content.innerHTML = this.renderRoles();
                break;
            case 'security':
                content.innerHTML = `<div class="settings-section"><h3>Security</h3><p class="desc">Manage security settings, 2FA, and access controls.</p>
                    <div class="setting-row"><div class="setting-label"><h4>Two-Factor Authentication</h4><p>Add extra security to your account</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>Session Timeout</h4><p>Auto-logout after 30 minutes of inactivity</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>IP Whitelisting</h4><p>Restrict access to specific IP addresses</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>Audit Logging</h4><p>Track all user actions and changes</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>Password Policy</h4><p>Require strong passwords (min 12 chars, uppercase, numbers, symbols)</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                    <div style="margin-top:20px;"><button class="btn btn-primary">Save Changes</button></div></div>`;
                break;
            case 'billing':
                content.innerHTML = `<div class="settings-section"><h3>Billing</h3><p class="desc">Manage your subscription and payment details.</p>
                    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg, var(--primary), #7C3AED);border:none;padding:24px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div><h4 style="color:white;font-size:1.1rem;">Enterprise Plan</h4><p style="color:rgba(255,255,255,0.7);font-size:0.8125rem;">Unlimited projects • 50 team members • Priority support</p></div>
                            <div style="text-align:right;"><div style="font-size:1.75rem;font-weight:700;color:white;">₹24,999</div><div style="color:rgba(255,255,255,0.7);font-size:0.75rem;">/month</div></div>
                        </div>
                    </div>
                    <div class="setting-row"><div class="setting-label"><h4>Next Billing Date</h4><p>April 1, 2026</p></div><button class="btn btn-outline btn-sm">Change Plan</button></div>
                    <div class="setting-row"><div class="setting-label"><h4>Payment Method</h4><p>VISA ending in 4242</p></div><button class="btn btn-outline btn-sm">Update</button></div></div>`;
                break;
        }
    },

    /* ===== Data Loading ===== */
    async loadData() {
        try {
            const [uRes, rRes, pRes] = await Promise.all([fetch('/api/users'), fetch('/api/roles'), fetch('/api/permissions')]);
            if (uRes.ok) this.users = await uRes.json();
            if (rRes.ok) this.roles = await rRes.json();
            if (pRes.ok) { const d = await pRes.json(); this.allPermissions = d.permissions; this.groupedPermissions = d.grouped; }
        } catch(e) {
            console.warn('RBAC API unavailable, using fallback:', e.message);
            this.users = (AppData.team||[]).map((m,i) => ({ id:i+1, name:m.name, email:m.name.toLowerCase().replace(' ','.')+'@inframanager.io', initials:m.initials, avatar:m.avatar, role_name:m.role, role_color:'#2563EB', department:'', status:'Active', last_active:new Date().toISOString() }));
            this.roles = [
                { id:1, name:'Admin', description:'Full system access', color:'#EF4444', is_system:true, user_count:1, permission_count:24 },
                { id:2, name:'Project Manager', description:'Manage projects and teams', color:'#2563EB', is_system:true, user_count:2, permission_count:21 },
                { id:3, name:'Engineer', description:'Task execution and updates', color:'#22C55E', is_system:true, user_count:5, permission_count:10 },
                { id:4, name:'Viewer', description:'Read-only access', color:'#94A3B8', is_system:true, user_count:2, permission_count:8 }
            ];
        }
    },

    /* ===== Helpers ===== */
    escapeHtml(str) { if (!str) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; },
    timeAgo(dateStr) {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff/60) + 'm ago';
        if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
        if (diff < 604800) return Math.floor(diff/86400) + 'd ago';
        return new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    },

    async init() { await this.loadData(); }
};
