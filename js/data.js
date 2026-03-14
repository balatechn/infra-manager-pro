/* =============================================
   Infra Manager Pro — Sample Data
   ============================================= */

const AppData = {
    // ===== Projects =====
    projects: [
        {
            id: 'PRJ001',
            name: 'Bangalore Data Center',
            client: 'IT Infra Corp',
            location: 'Bangalore, KA',
            region: 'South',
            manager: 'Arun Kumar',
            startDate: '2026-01-10',
            endDate: '2026-06-30',
            progress: 35,
            status: 'Active',
            budget: 4500000,
            budgetUsed: 1575000,
            description: 'Setting up a Tier-3 data center with redundant power, cooling, and network infrastructure for enterprise clients in Bangalore.',
            team: ['Arun Kumar', 'Rahul Sharma', 'Vikas Nair', 'Priya Patel'],
            milestones: [
                { name: 'Site Preparation', date: '2026-01-30', status: 'done' },
                { name: 'Power Infrastructure', date: '2026-02-28', status: 'done' },
                { name: 'Network Cabling', date: '2026-03-20', status: 'current' },
                { name: 'Server Installation', date: '2026-04-30', status: 'pending' },
                { name: 'Testing & Handover', date: '2026-06-30', status: 'pending' }
            ]
        },
        {
            id: 'PRJ002',
            name: 'Mangalore Showroom Network',
            client: 'Retail Solutions Ltd',
            location: 'Mangalore, KA',
            region: 'South',
            manager: 'Rahul Sharma',
            startDate: '2025-11-15',
            endDate: '2026-04-15',
            progress: 60,
            status: 'Active',
            budget: 1200000,
            budgetUsed: 780000,
            description: 'Complete network setup for 3 retail showrooms including POS systems, WiFi, and surveillance integration.',
            team: ['Rahul Sharma', 'Deepa Menon', 'Suresh Kumar'],
            milestones: [
                { name: 'Network Design', date: '2025-12-01', status: 'done' },
                { name: 'Cabling & Switches', date: '2026-01-15', status: 'done' },
                { name: 'WiFi Deployment', date: '2026-02-28', status: 'done' },
                { name: 'POS Integration', date: '2026-03-30', status: 'current' },
                { name: 'UAT & Go-Live', date: '2026-04-15', status: 'pending' }
            ]
        },
        {
            id: 'PRJ003',
            name: 'Chennai CCTV Setup',
            client: 'SecureTech India',
            location: 'Chennai, TN',
            region: 'South',
            manager: 'Vikas Nair',
            startDate: '2025-10-01',
            endDate: '2026-03-31',
            progress: 80,
            status: 'Near Completion',
            budget: 2800000,
            budgetUsed: 2520000,
            description: 'Enterprise CCTV and surveillance system installation across 5 locations with centralized monitoring.',
            team: ['Vikas Nair', 'Karthik R', 'Ananya Singh'],
            milestones: [
                { name: 'Survey & Planning', date: '2025-10-30', status: 'done' },
                { name: 'Camera Installation', date: '2025-12-15', status: 'done' },
                { name: 'NVR Setup', date: '2026-01-30', status: 'done' },
                { name: 'Network Integration', date: '2026-02-28', status: 'done' },
                { name: 'Testing & Handover', date: '2026-03-31', status: 'current' }
            ]
        },
        {
            id: 'PRJ004',
            name: 'Mysuru Office IT Setup',
            client: 'GreenTech Solutions',
            location: 'Mysuru, KA',
            region: 'South',
            manager: 'Priya Patel',
            startDate: '2026-02-01',
            endDate: '2026-05-30',
            progress: 15,
            status: 'Active',
            budget: 800000,
            budgetUsed: 120000,
            description: 'Complete IT infrastructure setup for new corporate office including workstations, network, and server room.',
            team: ['Priya Patel', 'Arun Kumar', 'Deepa Menon'],
            milestones: [
                { name: 'Requirements Gathering', date: '2026-02-15', status: 'done' },
                { name: 'Procurement', date: '2026-03-15', status: 'current' },
                { name: 'Installation', date: '2026-04-30', status: 'pending' },
                { name: 'Configuration & Testing', date: '2026-05-30', status: 'pending' }
            ]
        },
        {
            id: 'PRJ005',
            name: 'Hubli Campus WiFi',
            client: 'EduTech Institute',
            location: 'Hubli, KA',
            region: 'North KA',
            manager: 'Suresh Kumar',
            startDate: '2026-03-01',
            endDate: '2026-07-31',
            progress: 8,
            status: 'Planned',
            budget: 1500000,
            budgetUsed: 0,
            description: 'Campus-wide WiFi 6 deployment covering 12 buildings with centralized management and authentication.',
            team: ['Suresh Kumar', 'Rahul Sharma'],
            milestones: [
                { name: 'Site Survey', date: '2026-03-20', status: 'current' },
                { name: 'AP Procurement', date: '2026-04-15', status: 'pending' },
                { name: 'Cabling & Installation', date: '2026-06-15', status: 'pending' },
                { name: 'Testing & Handover', date: '2026-07-31', status: 'pending' }
            ]
        },
        {
            id: 'PRJ006',
            name: 'Kochi Server Migration',
            client: 'FinServe Bank',
            location: 'Kochi, KL',
            region: 'South',
            manager: 'Arun Kumar',
            startDate: '2025-09-01',
            endDate: '2026-02-28',
            progress: 100,
            status: 'Completed',
            budget: 3200000,
            budgetUsed: 2960000,
            description: 'Migration of legacy on-premise servers to hybrid cloud infrastructure with zero downtime.',
            team: ['Arun Kumar', 'Vikas Nair', 'Karthik R'],
            milestones: [
                { name: 'Assessment', date: '2025-09-30', status: 'done' },
                { name: 'Cloud Setup', date: '2025-11-15', status: 'done' },
                { name: 'Data Migration', date: '2026-01-15', status: 'done' },
                { name: 'Cutover & Validation', date: '2026-02-28', status: 'done' }
            ]
        }
    ],

    // ===== Tasks (Hierarchical) =====
    tasks: [
        {
            id: 'T001', name: 'Network Setup', projectId: 'PRJ001', startDate: '2026-03-01', endDate: '2026-04-15',
            duration: '45d', assignedTo: 'Arun Kumar', dependency: '', progress: 25, status: 'In Progress', priority: 'High',
            children: [
                {
                    id: 'T001-1', name: 'Router Installation', startDate: '2026-03-01', endDate: '2026-03-15',
                    duration: '14d', assignedTo: 'Rahul Sharma', dependency: '', progress: 80, status: 'In Progress', priority: 'High',
                    children: [
                        { id: 'T001-1a', name: 'Core Router Config', startDate: '2026-03-01', endDate: '2026-03-08', duration: '7d', assignedTo: 'Rahul Sharma', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
                        { id: 'T001-1b', name: 'Edge Router Setup', startDate: '2026-03-08', endDate: '2026-03-15', duration: '7d', assignedTo: 'Rahul Sharma', dependency: 'T001-1a', progress: 60, status: 'In Progress', priority: 'Medium' }
                    ]
                },
                {
                    id: 'T001-2', name: 'Firewall Configuration', startDate: '2026-03-15', endDate: '2026-03-30',
                    duration: '15d', assignedTo: 'Vikas Nair', dependency: 'T001-1', progress: 0, status: 'Planned', priority: 'High',
                    children: [
                        { id: 'T001-2a', name: 'Rule Definition', startDate: '2026-03-15', endDate: '2026-03-22', duration: '7d', assignedTo: 'Vikas Nair', dependency: 'T001-1', progress: 0, status: 'Planned', priority: 'High' },
                        { id: 'T001-2b', name: 'VPN Configuration', startDate: '2026-03-22', endDate: '2026-03-30', duration: '8d', assignedTo: 'Vikas Nair', dependency: 'T001-2a', progress: 0, status: 'Planned', priority: 'Medium' }
                    ]
                },
                { id: 'T001-3', name: 'WiFi Controller Setup', startDate: '2026-03-30', endDate: '2026-04-15', duration: '16d', assignedTo: 'Priya Patel', dependency: 'T001-2', progress: 0, status: 'Planned', priority: 'Medium' }
            ]
        },
        {
            id: 'T002', name: 'Server Room Build', projectId: 'PRJ001', startDate: '2026-01-15', endDate: '2026-03-15',
            duration: '60d', assignedTo: 'Arun Kumar', dependency: '', progress: 70, status: 'In Progress', priority: 'High',
            children: [
                { id: 'T002-1', name: 'Raised Floor Installation', startDate: '2026-01-15', endDate: '2026-02-01', duration: '17d', assignedTo: 'Karthik R', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
                { id: 'T002-2', name: 'Cooling System Setup', startDate: '2026-02-01', endDate: '2026-02-28', duration: '27d', assignedTo: 'Suresh Kumar', dependency: 'T002-1', progress: 100, status: 'Completed', priority: 'High' },
                { id: 'T002-3', name: 'Rack Installation', startDate: '2026-02-28', endDate: '2026-03-10', duration: '10d', assignedTo: 'Arun Kumar', dependency: 'T002-2', progress: 50, status: 'In Progress', priority: 'Medium' },
                { id: 'T002-4', name: 'Power Distribution', startDate: '2026-03-01', endDate: '2026-03-15', duration: '14d', assignedTo: 'Deepa Menon', dependency: 'T002-1', progress: 30, status: 'In Progress', priority: 'High' }
            ]
        },
        {
            id: 'T003', name: 'CCTV Installation', projectId: 'PRJ003', startDate: '2026-02-01', endDate: '2026-03-31',
            duration: '58d', assignedTo: 'Vikas Nair', dependency: '', progress: 75, status: 'In Progress', priority: 'High',
            children: [
                { id: 'T003-1', name: 'Camera Mounting', startDate: '2026-02-01', endDate: '2026-02-20', duration: '19d', assignedTo: 'Karthik R', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
                { id: 'T003-2', name: 'Cable Routing', startDate: '2026-02-10', endDate: '2026-02-28', duration: '18d', assignedTo: 'Ananya Singh', dependency: '', progress: 100, status: 'Completed', priority: 'Medium' },
                { id: 'T003-3', name: 'NVR Configuration', startDate: '2026-03-01', endDate: '2026-03-15', duration: '14d', assignedTo: 'Vikas Nair', dependency: 'T003-1', progress: 60, status: 'In Progress', priority: 'High' },
                { id: 'T003-4', name: 'Remote Access Setup', startDate: '2026-03-15', endDate: '2026-03-31', duration: '16d', assignedTo: 'Vikas Nair', dependency: 'T003-3', progress: 0, status: 'Planned', priority: 'Medium' }
            ]
        },
        {
            id: 'T004', name: 'POS Integration', projectId: 'PRJ002', startDate: '2026-03-01', endDate: '2026-04-10',
            duration: '40d', assignedTo: 'Rahul Sharma', dependency: '', progress: 30, status: 'In Progress', priority: 'High',
            children: [
                { id: 'T004-1', name: 'POS Hardware Setup', startDate: '2026-03-01', endDate: '2026-03-12', duration: '11d', assignedTo: 'Deepa Menon', dependency: '', progress: 80, status: 'In Progress', priority: 'High' },
                { id: 'T004-2', name: 'Software Installation', startDate: '2026-03-12', endDate: '2026-03-25', duration: '13d', assignedTo: 'Rahul Sharma', dependency: 'T004-1', progress: 0, status: 'Planned', priority: 'Medium' },
                { id: 'T004-3', name: 'Network Integration', startDate: '2026-03-25', endDate: '2026-04-10', duration: '16d', assignedTo: 'Suresh Kumar', dependency: 'T004-2', progress: 0, status: 'Planned', priority: 'High' }
            ]
        },
        {
            id: 'T005', name: 'Office Workstation Setup', projectId: 'PRJ004', startDate: '2026-03-15', endDate: '2026-05-15',
            duration: '61d', assignedTo: 'Priya Patel', dependency: '', progress: 10, status: 'In Progress', priority: 'Medium',
            children: [
                { id: 'T005-1', name: 'Hardware Procurement', startDate: '2026-03-15', endDate: '2026-03-30', duration: '15d', assignedTo: 'Priya Patel', dependency: '', progress: 40, status: 'In Progress', priority: 'High' },
                { id: 'T005-2', name: 'Network Points', startDate: '2026-03-20', endDate: '2026-04-10', duration: '21d', assignedTo: 'Deepa Menon', dependency: '', progress: 0, status: 'Planned', priority: 'Medium' },
                { id: 'T005-3', name: 'Workstation Assembly', startDate: '2026-04-10', endDate: '2026-05-01', duration: '21d', assignedTo: 'Priya Patel', dependency: 'T005-1', progress: 0, status: 'Planned', priority: 'Medium' },
                { id: 'T005-4', name: 'Software & Config', startDate: '2026-05-01', endDate: '2026-05-15', duration: '14d', assignedTo: 'Arun Kumar', dependency: 'T005-3', progress: 0, status: 'Planned', priority: 'Low' }
            ]
        }
    ],

    // ===== Kanban Tasks =====
    kanbanTasks: [
        { id: 'K001', title: 'Procure Cat6A cables for DC', project: 'Bangalore Data Center', priority: 'High', assignee: 'Arun Kumar', dueDate: '2026-03-18', comments: 3, attachments: 1, tags: ['cabling', 'hardware'], column: 'in-progress' },
        { id: 'K002', title: 'Configure core switches', project: 'Bangalore Data Center', priority: 'High', assignee: 'Rahul Sharma', dueDate: '2026-03-20', comments: 5, attachments: 2, tags: ['network'], column: 'in-progress' },
        { id: 'K003', title: 'Install UPS backup units', project: 'Bangalore Data Center', priority: 'Medium', assignee: 'Karthik R', dueDate: '2026-03-25', comments: 1, attachments: 0, tags: ['hardware'], column: 'planned' },
        { id: 'K004', title: 'Setup firewall rules', project: 'Bangalore Data Center', priority: 'High', assignee: 'Vikas Nair', dueDate: '2026-04-01', comments: 2, attachments: 1, tags: ['security', 'network'], column: 'backlog' },
        { id: 'K005', title: 'POS terminal configuration', project: 'Mangalore Showroom Network', priority: 'Medium', assignee: 'Deepa Menon', dueDate: '2026-03-22', comments: 4, attachments: 0, tags: ['hardware', 'software'], column: 'in-progress' },
        { id: 'K006', title: 'NVR firmware update', project: 'Chennai CCTV Setup', priority: 'Low', assignee: 'Vikas Nair', dueDate: '2026-03-16', comments: 0, attachments: 1, tags: ['security', 'software'], column: 'testing' },
        { id: 'K007', title: 'Showroom 2 WiFi AP install', project: 'Mangalore Showroom Network', priority: 'Medium', assignee: 'Suresh Kumar', dueDate: '2026-03-14', comments: 2, attachments: 0, tags: ['network'], column: 'completed' },
        { id: 'K008', title: 'Camera angle adjustment - Bldg C', project: 'Chennai CCTV Setup', priority: 'Low', assignee: 'Karthik R', dueDate: '2026-03-19', comments: 1, attachments: 3, tags: ['security'], column: 'completed' },
        { id: 'K009', title: 'VPN gateway configuration', project: 'Bangalore Data Center', priority: 'High', assignee: 'Vikas Nair', dueDate: '2026-04-05', comments: 0, attachments: 0, tags: ['security', 'network'], column: 'backlog' },
        { id: 'K010', title: 'Waiting for vendor - Power panels', project: 'Bangalore Data Center', priority: 'High', assignee: 'Arun Kumar', dueDate: '2026-03-10', comments: 6, attachments: 2, tags: ['hardware'], column: 'blocked' },
        { id: 'K011', title: 'Office LAN cabling - Floor 2', project: 'Mysuru Office IT Setup', priority: 'Medium', assignee: 'Deepa Menon', dueDate: '2026-04-05', comments: 0, attachments: 0, tags: ['cabling'], column: 'planned' },
        { id: 'K012', title: 'Showroom 3 network testing', project: 'Mangalore Showroom Network', priority: 'High', assignee: 'Rahul Sharma', dueDate: '2026-03-28', comments: 1, attachments: 0, tags: ['network'], column: 'testing' },
        { id: 'K013', title: 'Server rack cable management', project: 'Bangalore Data Center', priority: 'Low', assignee: 'Karthik R', dueDate: '2026-03-30', comments: 0, attachments: 0, tags: ['cabling', 'hardware'], column: 'planned' },
        { id: 'K014', title: 'WiFi heat map analysis', project: 'Hubli Campus WiFi', priority: 'Medium', assignee: 'Suresh Kumar', dueDate: '2026-03-25', comments: 2, attachments: 1, tags: ['network'], column: 'in-progress' },
        { id: 'K015', title: 'Domain controller setup', project: 'Mysuru Office IT Setup', priority: 'High', assignee: 'Priya Patel', dueDate: '2026-04-15', comments: 0, attachments: 0, tags: ['software', 'network'], column: 'backlog' }
    ],

    // ===== Team Members =====
    team: [
        { name: 'Arun Kumar', role: 'Senior Network Engineer', avatar: 'bg-1', initials: 'AK', tasks: 8, completed: 3, load: 'High', projects: ['PRJ001', 'PRJ004', 'PRJ006'], skills: ['Network', 'Server', 'Cloud'] },
        { name: 'Rahul Sharma', role: 'Network Engineer', avatar: 'bg-2', initials: 'RS', tasks: 6, completed: 2, load: 'Medium', projects: ['PRJ001', 'PRJ002', 'PRJ005'], skills: ['Network', 'WiFi', 'Switching'] },
        { name: 'Vikas Nair', role: 'Security Engineer', avatar: 'bg-3', initials: 'VN', tasks: 5, completed: 2, load: 'Medium', projects: ['PRJ001', 'PRJ003'], skills: ['Security', 'CCTV', 'Firewall'] },
        { name: 'Priya Patel', role: 'IT Infrastructure Lead', avatar: 'bg-4', initials: 'PP', tasks: 4, completed: 1, load: 'Medium', projects: ['PRJ001', 'PRJ004'], skills: ['Infrastructure', 'Planning', 'Server'] },
        { name: 'Karthik R', role: 'Field Engineer', avatar: 'bg-5', initials: 'KR', tasks: 5, completed: 3, load: 'Medium', projects: ['PRJ001', 'PRJ003'], skills: ['Hardware', 'Cabling', 'CCTV'] },
        { name: 'Deepa Menon', role: 'Systems Engineer', avatar: 'bg-1', initials: 'DM', tasks: 4, completed: 1, load: 'Low', projects: ['PRJ002', 'PRJ004'], skills: ['Systems', 'POS', 'Cabling'] },
        { name: 'Suresh Kumar', role: 'WiFi Specialist', avatar: 'bg-2', initials: 'SK', tasks: 3, completed: 1, load: 'Low', projects: ['PRJ001', 'PRJ002', 'PRJ005'], skills: ['WiFi', 'Wireless', 'RF'] },
        { name: 'Ananya Singh', role: 'Junior Engineer', avatar: 'bg-3', initials: 'AS', tasks: 2, completed: 1, load: 'Low', projects: ['PRJ003'], skills: ['Cabling', 'Hardware'] }
    ],

    // ===== Assets =====
    assets: [
        { id: 'A001', name: 'Cisco Catalyst 9300', category: 'Switches', location: 'Bangalore DC', status: 'Deployed', project: 'PRJ001', serial: 'CSC-9300-001', purchaseDate: '2026-01-15' },
        { id: 'A002', name: 'Fortinet FortiGate 200F', category: 'Firewalls', location: 'Bangalore DC', status: 'Deployed', project: 'PRJ001', serial: 'FGT-200F-001', purchaseDate: '2026-01-20' },
        { id: 'A003', name: 'Cisco ISR 4451', category: 'Routers', location: 'Bangalore DC', status: 'In Transit', project: 'PRJ001', serial: 'ISR-4451-003', purchaseDate: '2026-03-01' },
        { id: 'A004', name: 'Hikvision DS-2CD2386G2', category: 'Cameras', location: 'Chennai Site A', status: 'Deployed', project: 'PRJ003', serial: 'HIK-2386-015', purchaseDate: '2025-11-10' },
        { id: 'A005', name: 'APC Smart-UPS 3000VA', category: 'UPS', location: 'Bangalore DC', status: 'In Warehouse', project: 'PRJ001', serial: 'APC-3000-002', purchaseDate: '2026-02-15' },
        { id: 'A006', name: 'Aruba AP-635', category: 'Access Points', location: 'Mangalore Showroom', status: 'Deployed', project: 'PRJ002', serial: 'ARB-635-008', purchaseDate: '2025-12-20' },
        { id: 'A007', name: 'Dell PowerEdge R750', category: 'Servers', location: 'Bangalore DC', status: 'In Warehouse', project: 'PRJ001', serial: 'DEL-R750-001', purchaseDate: '2026-02-28' },
        { id: 'A008', name: 'Panduit CAT6A 305m', category: 'Cables', location: 'Bangalore DC', status: 'In Use', project: 'PRJ001', serial: 'PND-6A-020', purchaseDate: '2026-03-01' },
        { id: 'A009', name: 'Hikvision DS-7732NI NVR', category: 'NVR', location: 'Chennai Control Room', status: 'Deployed', project: 'PRJ003', serial: 'HIK-NVR-003', purchaseDate: '2025-11-20' },
        { id: 'A010', name: 'HP ProDesk 400 G9', category: 'Workstations', location: 'Mysuru Office', status: 'Ordered', project: 'PRJ004', serial: 'HP-400G9-010', purchaseDate: '2026-03-10' }
    ],

    // ===== Activity Feed =====
    activities: [
        { type: 'blue', text: '<strong>Rahul Sharma</strong> completed Router Installation for Bangalore DC', time: '5 min ago' },
        { type: 'green', text: '<strong>Milestone:</strong> Mangalore Showroom — WiFi Deployment completed', time: '30 min ago' },
        { type: 'orange', text: '<strong>Budget Alert:</strong> Chennai CCTV project reached 90% budget', time: '1 hr ago' },
        { type: 'red', text: '<strong>Delay:</strong> Power panel delivery delayed — Bangalore DC', time: '2 hrs ago' },
        { type: 'blue', text: '<strong>Priya Patel</strong> assigned to Mysuru Office IT Setup', time: '3 hrs ago' },
        { type: 'green', text: '<strong>Task Done:</strong> Camera Mounting completed at Chennai Site A', time: '4 hrs ago' },
        { type: 'blue', text: '<strong>Vikas Nair</strong> started NVR Configuration', time: '5 hrs ago' },
        { type: 'orange', text: '<strong>Risk:</strong> Vendor delivery timeline uncertain for Hubli WiFi project', time: '6 hrs ago' }
    ],

    // ===== Helper Functions =====
    formatCurrency(amount) {
        return '₹' + (amount / 100000).toFixed(1) + 'L';
    },

    formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    formatShortDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    },

    getStatusBadgeClass(status) {
        const map = {
            'Active': 'badge-active',
            'Delayed': 'badge-delayed',
            'Planned': 'badge-planned',
            'Completed': 'badge-completed',
            'In Progress': 'badge-in-progress',
            'Near Completion': 'badge-near-completion',
            'Blocked': 'badge-blocked',
            'On Hold': 'badge-on-hold',
            'Testing': 'badge-near-completion'
        };
        return map[status] || 'badge-planned';
    },

    getPriorityBadgeClass(priority) {
        const map = {
            'High': 'badge-priority-high',
            'Medium': 'badge-priority-medium',
            'Low': 'badge-priority-low'
        };
        return map[priority] || 'badge-priority-medium';
    },

    getProgressColor(progress) {
        if (progress >= 75) return 'green';
        if (progress >= 40) return 'blue';
        if (progress >= 20) return 'orange';
        return 'red';
    },

    // ===== API Data Loading =====
    _mapProject(p) {
        return {
            id: p.id,
            name: p.name,
            client: p.client,
            location: p.location,
            region: p.region,
            manager: p.manager,
            startDate: p.start_date ? p.start_date.slice(0, 10) : p.startDate,
            endDate: p.end_date ? p.end_date.slice(0, 10) : p.endDate,
            progress: Number(p.progress),
            status: p.status,
            budget: Number(p.budget),
            budgetUsed: Number(p.budget_used != null ? p.budget_used : p.budgetUsed),
            description: p.description,
            team: p.team || [],
            milestones: (p.milestones || []).map(m => ({
                name: m.name,
                date: m.date ? (typeof m.date === 'string' ? m.date.slice(0, 10) : m.date) : '',
                status: m.status
            }))
        };
    },

    _mapTask(t) {
        const mapped = {
            id: t.id,
            name: t.name,
            projectId: t.project_id || t.projectId,
            startDate: t.start_date ? t.start_date.slice(0, 10) : t.startDate,
            endDate: t.end_date ? t.end_date.slice(0, 10) : t.endDate,
            duration: t.duration,
            assignedTo: t.assigned_to || t.assignedTo,
            dependency: t.dependency || '',
            progress: Number(t.progress),
            status: t.status,
            priority: t.priority
        };
        if (t.children && t.children.length > 0) {
            mapped.children = t.children.map(c => AppData._mapTask(c));
        }
        return mapped;
    },

    _mapKanban(k) {
        return {
            id: k.id,
            title: k.title,
            project: k.project,
            priority: k.priority,
            assignee: k.assignee,
            dueDate: k.due_date ? k.due_date.slice(0, 10) : k.dueDate,
            comments: Number(k.comments),
            attachments: Number(k.attachments),
            tags: k.tags || [],
            column: k.column_status || k.column
        };
    },

    _mapTeam(m) {
        return {
            name: m.name,
            role: m.role,
            avatar: m.avatar,
            initials: m.initials,
            tasks: Number(m.tasks_count != null ? m.tasks_count : m.tasks),
            completed: Number(m.completed_count != null ? m.completed_count : m.completed),
            load: m.load,
            projects: m.projects || [],
            skills: m.skills || []
        };
    },

    _mapAsset(a) {
        return {
            id: a.id,
            name: a.name,
            category: a.category,
            location: a.location,
            status: a.status,
            project: a.project,
            serial: a.serial_number || a.serial,
            purchaseDate: a.purchase_date ? a.purchase_date.slice(0, 10) : a.purchaseDate
        };
    },

    async loadFromAPI() {
        try {
            const [projectsRes, tasksRes, kanbanRes, teamRes, assetsRes, activitiesRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/tasks'),
                fetch('/api/kanban'),
                fetch('/api/team'),
                fetch('/api/assets'),
                fetch('/api/activities')
            ]);

            if (projectsRes.ok) {
                const data = await projectsRes.json();
                this.projects = data.map(p => this._mapProject(p));
            }
            if (tasksRes.ok) {
                const data = await tasksRes.json();
                this.tasks = data.map(t => this._mapTask(t));
            }
            if (kanbanRes.ok) {
                const data = await kanbanRes.json();
                this.kanbanTasks = data.map(k => this._mapKanban(k));
            }
            if (teamRes.ok) {
                const data = await teamRes.json();
                this.team = data.map(m => this._mapTeam(m));
            }
            if (assetsRes.ok) {
                const data = await assetsRes.json();
                this.assets = data.map(a => this._mapAsset(a));
            }
            if (activitiesRes.ok) {
                const data = await activitiesRes.json();
                this.activities = data;
            }

            console.log('✅ Data loaded from Neon database');
            return true;
        } catch (err) {
            console.warn('⚠️ API unavailable, using local data:', err.message);
            return false;
        }
    }
};
