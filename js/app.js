/* =============================================
   Infra Manager Pro — Main Application Controller
   ============================================= */

const App = {
    currentPage: 'dashboard',
    currentParams: null,

    async init() {
        // Check if user is logged in
        const session = localStorage.getItem('infraSession');
        if (!session) {
            this.showLogin();
            return;
        }
        this.showApp();
        // Load data from Neon DB API (falls back to static data)
        await AppData.loadFromAPI();
        this.bindNavigation();
        this.bindModal();
        this.bindNotifications();
        this.bindUserMenu();
        this.bindSidebar();
        this.bindKeyboard();
        this.bindTheme();
        this.navigate('dashboard');
    },

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.querySelector('.top-nav').style.display = 'none';
        document.getElementById('pageNav').style.display = 'none';
        document.getElementById('mainContent').style.display = 'none';

        const form = document.getElementById('loginForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');

            if (email === 'admin@infrapro.com' && pass === 'admin123') {
                localStorage.setItem('infraSession', JSON.stringify({ user: 'Admin Manager', email: email, loginAt: Date.now() }));
                errorEl.textContent = '';
                this.init(); // Re-init with session
            } else {
                errorEl.textContent = 'Invalid email or password';
            }
        };
    },

    showApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.querySelector('.top-nav').style.display = '';
        document.getElementById('pageNav').style.display = '';
        document.getElementById('mainContent').style.display = '';
    },

    logout() {
        localStorage.removeItem('infraSession');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.querySelector('.top-nav').style.display = 'none';
        document.getElementById('pageNav').style.display = 'none';
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginError').textContent = '';
    },

    destroyCharts() {
        // Destroy all active Chart.js instances to prevent canvas reuse errors
        const charts = Object.values(Chart.instances || {});
        charts.forEach(chart => chart.destroy());
    },

    navigate(page, params = null) {
        this.currentPage = page;
        this.currentParams = params;

        // Destroy existing charts before rendering new page
        if (typeof Chart !== 'undefined') {
            this.destroyCharts();
        }

        // Update nav active state
        document.querySelectorAll('.page-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Render page
        const main = document.getElementById('mainContent');
        switch(page) {
            case 'dashboard':
                main.innerHTML = DashboardPage.render();
                DashboardPage.initCharts();
                break;
            case 'projects':
                main.innerHTML = ProjectsPage.render();
                ProjectsPage.init();
                break;
            case 'project-details':
                main.innerHTML = ProjectDetailsPage.render(params);
                ProjectDetailsPage.init(params);
                // Keep projects active in nav
                document.querySelectorAll('.page-nav-item').forEach(item => {
                    item.classList.toggle('active', item.dataset.page === 'projects');
                });
                break;
            case 'tasks':
                main.innerHTML = TasksPage.render();
                TasksPage.init();
                break;
            case 'gantt':
                main.innerHTML = GanttPage.render();
                GanttPage.init();
                break;
            case 'kanban':
                main.innerHTML = KanbanPage.render();
                KanbanPage.init();
                break;
            case 'teams':
                main.innerHTML = TeamsPage.render();
                TeamsPage.init();
                break;
            case 'reports':
                main.innerHTML = ReportsPage.render();
                ReportsPage.init();
                break;
            case 'assets':
                main.innerHTML = AssetsPage.render();
                AssetsPage.init();
                break;
            case 'finance':
                main.innerHTML = FinancePage.render();
                FinancePage.init();
                break;
            case 'settings':
                main.innerHTML = SettingsPage.render();
                SettingsPage.init();
                break;
            default:
                main.innerHTML = '<div class="empty-state"><p>Page not found</p></div>';
        }

        // Scroll to top
        main.scrollTop = 0;
        window.scrollTo(0, 0);

        // Close mobile nav
        document.getElementById('pageNav').classList.remove('open');
    },

    bindNavigation() {
        document.querySelectorAll('.page-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.navigate(item.dataset.page);
            });
        });
    },

    bindModal() {
        const modal = document.getElementById('createTaskModal');
        const createBtn = document.getElementById('createTaskBtn');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelModal');

        if (createBtn) {
            createBtn.addEventListener('click', () => modal.classList.add('open'));
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => modal.classList.remove('open'));
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('open');
            });
        }
    },

    bindNotifications() {
        const btn = document.getElementById('notificationsBtn');
        const panel = document.getElementById('notificationPanel');

        if (btn && panel) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && e.target !== btn) {
                    panel.classList.remove('open');
                }
            });
        }
    },

    bindSidebar() {
        const toggle = document.getElementById('mobileMenuToggle');
        const pageNav = document.getElementById('pageNav');

        if (toggle && pageNav) {
            toggle.addEventListener('click', () => {
                pageNav.classList.toggle('open');
            });

            // Close nav when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && !pageNav.contains(e.target) && !toggle.contains(e.target)) {
                    pageNav.classList.remove('open');
                }
            });
        }
    },

    bindTheme() {
        const toggle = document.getElementById('themeToggle');
        // Apply saved preference
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.body.classList.add('light-mode');
        }
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const isLight = document.body.classList.contains('light-mode');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }
    },

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const search = document.getElementById('globalSearch');
                if (search) search.focus();
            }
            // Escape to close modal/panel
            if (e.key === 'Escape') {
                document.getElementById('createTaskModal').classList.remove('open');
                document.getElementById('notificationPanel').classList.remove('open');
                const dd = document.getElementById('userDropdown');
                if (dd) dd.classList.remove('open');
            }
        });
    },

    bindUserMenu() {
        const avatar = document.getElementById('userMenu');
        const dropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');

        if (avatar && dropdown) {
            avatar.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
                // Close notifications panel if open
                document.getElementById('notificationPanel').classList.remove('open');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== avatar) {
                    dropdown.classList.remove('open');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    App.logout();
                }
            });
        }
    }
};

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
