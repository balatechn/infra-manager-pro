/* =============================================
   Infra Manager Pro — Settings Page
   ============================================= */

const SettingsPage = {
    render() {
        return `
        <div class="page-header">
            <h1>Settings <small>Admin Controls</small></h1>
        </div>

        <div class="settings-layout">
            <!-- Settings Nav -->
            <div>
                <div class="settings-nav">
                    <div class="settings-nav-item active" onclick="SettingsPage.switchSection(this, 'general')">General</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'notifications')">Notifications</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'integrations')">Integrations</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'security')">Security</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'billing')">Billing</div>
                    <div class="settings-nav-item" onclick="SettingsPage.switchSection(this, 'team')">Team Management</div>
                </div>
            </div>

            <!-- Settings Content -->
            <div id="settingsContent">
                ${this.renderGeneral()}
            </div>
        </div>`;
    },

    renderGeneral() {
        return `
        <div class="settings-section">
            <h3>General Settings</h3>
            <p class="desc">Manage your workspace and application preferences.</p>

            <div class="form-group">
                <label>Organization Name</label>
                <input type="text" class="form-input" value="Infra Manager Pro">
            </div>
            <div class="form-group">
                <label>Default Time Zone</label>
                <select class="form-input">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>UTC</option>
                    <option>Asia/Singapore (SGT, UTC+8:00)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date Format</label>
                <select class="form-input">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                </select>
            </div>
            <div class="form-group">
                <label>Currency</label>
                <select class="form-input">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                </select>
            </div>

            <div style="margin-top:24px;">
                <h3 style="font-size:0.9375rem;">Preferences</h3>
                <div class="setting-row">
                    <div class="setting-label">
                        <h4>Dark Mode</h4>
                        <p>Use dark theme across the application</p>
                    </div>
                    <div class="toggle active" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="setting-row">
                    <div class="setting-label">
                        <h4>Compact View</h4>
                        <p>Reduce spacing for denser information display</p>
                    </div>
                    <div class="toggle" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="setting-row">
                    <div class="setting-label">
                        <h4>Auto-refresh Dashboard</h4>
                        <p>Automatically refresh dashboard data every 5 minutes</p>
                    </div>
                    <div class="toggle active" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="setting-row">
                    <div class="setting-label">
                        <h4>Show Weekend in Gantt</h4>
                        <p>Display weekend days in Gantt timeline view</p>
                    </div>
                    <div class="toggle" onclick="this.classList.toggle('active')"></div>
                </div>
            </div>

            <div style="margin-top:20px;display:flex;gap:8px;">
                <button class="btn btn-primary">Save Changes</button>
                <button class="btn btn-secondary">Reset</button>
            </div>
        </div>`;
    },

    renderNotifications() {
        return `
        <div class="settings-section">
            <h3>Notification Settings</h3>
            <p class="desc">Configure how and when you receive notifications.</p>

            <div class="setting-row">
                <div class="setting-label">
                    <h4>Email Notifications</h4>
                    <p>Receive email alerts for important updates</p>
                </div>
                <div class="toggle active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-row">
                <div class="setting-label">
                    <h4>Task Assignments</h4>
                    <p>Get notified when a task is assigned to you</p>
                </div>
                <div class="toggle active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-row">
                <div class="setting-label">
                    <h4>Project Updates</h4>
                    <p>Get notified about project status changes</p>
                </div>
                <div class="toggle active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-row">
                <div class="setting-label">
                    <h4>Budget Alerts</h4>
                    <p>Alert when project exceeds 80% budget</p>
                </div>
                <div class="toggle active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-row">
                <div class="setting-label">
                    <h4>Deadline Reminders</h4>
                    <p>Remind 3 days before task deadlines</p>
                </div>
                <div class="toggle active" onclick="this.classList.toggle('active')"></div>
            </div>
            <div class="setting-row">
                <div class="setting-label">
                    <h4>Weekly Digest</h4>
                    <p>Receive weekly summary report via email</p>
                </div>
                <div class="toggle" onclick="this.classList.toggle('active')"></div>
            </div>

            <div style="margin-top:20px;display:flex;gap:8px;">
                <button class="btn btn-primary">Save Changes</button>
            </div>
        </div>`;
    },

    renderIntegrations() {
        return `
        <div class="settings-section">
            <h3>Integrations</h3>
            <p class="desc">Connect with third-party tools and services.</p>

            <div class="setting-row">
                <div class="setting-label" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:36px;height:36px;background:var(--primary-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
                    </div>
                    <div>
                        <h4>Microsoft Teams</h4>
                        <p>Send notifications to Teams channels</p>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm">Connect</button>
            </div>
            <div class="setting-row">
                <div class="setting-label" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:36px;height:36px;background:var(--success-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div>
                        <h4>Slack</h4>
                        <p>Integration for real-time updates</p>
                    </div>
                </div>
                <span class="badge badge-active">Connected</span>
            </div>
            <div class="setting-row">
                <div class="setting-label" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:36px;height:36px;background:var(--warning-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                    </div>
                    <div>
                        <h4>Jira</h4>
                        <p>Sync tasks with Jira issues</p>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm">Connect</button>
            </div>
            <div class="setting-row">
                <div class="setting-label" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:36px;height:36px;background:var(--info-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                        <h4>Google Calendar</h4>
                        <p>Sync milestones and deadlines</p>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm">Connect</button>
            </div>
        </div>`;
    },

    switchSection(el, section) {
        document.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        
        const content = document.getElementById('settingsContent');
        switch(section) {
            case 'general': content.innerHTML = this.renderGeneral(); break;
            case 'notifications': content.innerHTML = this.renderNotifications(); break;
            case 'integrations': content.innerHTML = this.renderIntegrations(); break;
            case 'security':
                content.innerHTML = `<div class="settings-section"><h3>Security</h3><p class="desc">Manage security settings, 2FA, and access controls.</p>
                    <div class="setting-row"><div class="setting-label"><h4>Two-Factor Authentication</h4><p>Add extra security to your account</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>Session Timeout</h4><p>Auto-logout after 30 minutes of inactivity</p></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
                    <div class="setting-row"><div class="setting-label"><h4>IP Whitelisting</h4><p>Restrict access to specific IP addresses</p></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
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
            case 'team':
                content.innerHTML = `<div class="settings-section"><h3>Team Management</h3><p class="desc">Manage team members and their roles.</p>
                    <table class="data-table"><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                    ${AppData.team.map(m => `<tr><td><div style="display:flex;align-items:center;gap:8px;"><span class="avatar ${m.avatar}" style="width:28px;height:28px;font-size:0.625rem;">${m.initials}</span><span style="font-weight:500;">${m.name}</span></div></td><td>${m.role}</td><td><span class="badge badge-active">Active</span></td><td>${Components.actionButtons()}</td></tr>`).join('')}
                    </tbody></table>
                    <div style="margin-top:16px;"><button class="btn btn-primary btn-sm">Invite Member</button></div></div>`;
                break;
        }
    },

    init() {}
};
