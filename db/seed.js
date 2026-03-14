/**
 * Infra Manager Pro — Database Seed Script
 * 
 * Usage: 
 *   1. Set DATABASE_URL in .env file
 *   2. Run: node db/seed.js
 */

require('dotenv/config');
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function seed() {
    if (!process.env.DATABASE_URL) {
        console.error('ERROR: DATABASE_URL not set. Create a .env file with your Neon connection string.');
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);
    console.log('Connected to Neon database.');

    // Run schema
    console.log('Creating tables...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
        await sql(stmt);
    }
    console.log('Tables created.');

    // Clear existing data
    console.log('Clearing existing data...');
    await sql`DELETE FROM activities`;
    await sql`DELETE FROM assets`;
    await sql`DELETE FROM kanban_tasks`;
    await sql`DELETE FROM milestones`;
    await sql`DELETE FROM tasks WHERE parent_id IS NOT NULL`;
    await sql`DELETE FROM tasks`;
    await sql`DELETE FROM team_members`;
    await sql`DELETE FROM projects`;

    // ===== Seed Projects =====
    console.log('Seeding projects...');
    const projects = [
        { id: 'PRJ001', name: 'Bangalore Data Center', client: 'IT Infra Corp', location: 'Bangalore, KA', region: 'South', manager: 'Arun Kumar', startDate: '2026-01-10', endDate: '2026-06-30', progress: 35, status: 'Active', budget: 4500000, budgetUsed: 1575000, description: 'Setting up a Tier-3 data center with redundant power, cooling, and network infrastructure for enterprise clients in Bangalore.', team: ['Arun Kumar', 'Rahul Sharma', 'Vikas Nair', 'Priya Patel'] },
        { id: 'PRJ002', name: 'Mangalore Showroom Network', client: 'Retail Solutions Ltd', location: 'Mangalore, KA', region: 'South', manager: 'Rahul Sharma', startDate: '2025-11-15', endDate: '2026-04-15', progress: 60, status: 'Active', budget: 1200000, budgetUsed: 780000, description: 'Complete network setup for 3 retail showrooms including POS systems, WiFi, and surveillance integration.', team: ['Rahul Sharma', 'Deepa Menon', 'Suresh Kumar'] },
        { id: 'PRJ003', name: 'Chennai CCTV Setup', client: 'SecureTech India', location: 'Chennai, TN', region: 'South', manager: 'Vikas Nair', startDate: '2025-10-01', endDate: '2026-03-31', progress: 80, status: 'Near Completion', budget: 2800000, budgetUsed: 2520000, description: 'Enterprise CCTV and surveillance system installation across 5 locations with centralized monitoring.', team: ['Vikas Nair', 'Karthik R', 'Ananya Singh'] },
        { id: 'PRJ004', name: 'Mysuru Office IT Setup', client: 'GreenTech Solutions', location: 'Mysuru, KA', region: 'South', manager: 'Priya Patel', startDate: '2026-02-01', endDate: '2026-05-30', progress: 15, status: 'Active', budget: 800000, budgetUsed: 120000, description: 'Complete IT infrastructure setup for new corporate office including workstations, network, and server room.', team: ['Priya Patel', 'Arun Kumar', 'Deepa Menon'] },
        { id: 'PRJ005', name: 'Hubli Campus WiFi', client: 'EduTech Institute', location: 'Hubli, KA', region: 'North KA', manager: 'Suresh Kumar', startDate: '2026-03-01', endDate: '2026-07-31', progress: 8, status: 'Planned', budget: 1500000, budgetUsed: 0, description: 'Campus-wide WiFi 6 deployment covering 12 buildings with centralized management and authentication.', team: ['Suresh Kumar', 'Rahul Sharma'] },
        { id: 'PRJ006', name: 'Kochi Server Migration', client: 'FinServe Bank', location: 'Kochi, KL', region: 'South', manager: 'Arun Kumar', startDate: '2025-09-01', endDate: '2026-02-28', progress: 100, status: 'Completed', budget: 3200000, budgetUsed: 2960000, description: 'Migration of legacy on-premise servers to hybrid cloud infrastructure with zero downtime.', team: ['Arun Kumar', 'Vikas Nair', 'Karthik R'] }
    ];

    for (const p of projects) {
        await sql`INSERT INTO projects (id, name, client, location, region, manager, start_date, end_date, progress, status, budget, budget_used, description, team)
            VALUES (${p.id}, ${p.name}, ${p.client}, ${p.location}, ${p.region}, ${p.manager}, ${p.startDate}, ${p.endDate}, ${p.progress}, ${p.status}, ${p.budget}, ${p.budgetUsed}, ${p.description}, ${p.team})`;
    }

    // ===== Seed Milestones =====
    console.log('Seeding milestones...');
    const milestones = [
        { projectId: 'PRJ001', milestones: [
            { name: 'Site Preparation', date: '2026-01-30', status: 'done' }, { name: 'Power Infrastructure', date: '2026-02-28', status: 'done' },
            { name: 'Network Cabling', date: '2026-03-20', status: 'current' }, { name: 'Server Installation', date: '2026-04-30', status: 'pending' },
            { name: 'Testing & Handover', date: '2026-06-30', status: 'pending' }
        ]},
        { projectId: 'PRJ002', milestones: [
            { name: 'Network Design', date: '2025-12-01', status: 'done' }, { name: 'Cabling & Switches', date: '2026-01-15', status: 'done' },
            { name: 'WiFi Deployment', date: '2026-02-28', status: 'done' }, { name: 'POS Integration', date: '2026-03-30', status: 'current' },
            { name: 'UAT & Go-Live', date: '2026-04-15', status: 'pending' }
        ]},
        { projectId: 'PRJ003', milestones: [
            { name: 'Survey & Planning', date: '2025-10-30', status: 'done' }, { name: 'Camera Installation', date: '2025-12-15', status: 'done' },
            { name: 'NVR Setup', date: '2026-01-30', status: 'done' }, { name: 'Network Integration', date: '2026-02-28', status: 'done' },
            { name: 'Testing & Handover', date: '2026-03-31', status: 'current' }
        ]},
        { projectId: 'PRJ004', milestones: [
            { name: 'Requirements Gathering', date: '2026-02-15', status: 'done' }, { name: 'Procurement', date: '2026-03-15', status: 'current' },
            { name: 'Installation', date: '2026-04-30', status: 'pending' }, { name: 'Configuration & Testing', date: '2026-05-30', status: 'pending' }
        ]},
        { projectId: 'PRJ005', milestones: [
            { name: 'Site Survey', date: '2026-03-20', status: 'current' }, { name: 'AP Procurement', date: '2026-04-15', status: 'pending' },
            { name: 'Cabling & Installation', date: '2026-06-15', status: 'pending' }, { name: 'Testing & Handover', date: '2026-07-31', status: 'pending' }
        ]},
        { projectId: 'PRJ006', milestones: [
            { name: 'Assessment', date: '2025-09-30', status: 'done' }, { name: 'Cloud Setup', date: '2025-11-15', status: 'done' },
            { name: 'Data Migration', date: '2026-01-15', status: 'done' }, { name: 'Cutover & Validation', date: '2026-02-28', status: 'done' }
        ]}
    ];

    for (const pm of milestones) {
        for (let i = 0; i < pm.milestones.length; i++) {
            const m = pm.milestones[i];
            await sql`INSERT INTO milestones (project_id, name, date, status, sort_order) VALUES (${pm.projectId}, ${m.name}, ${m.date}, ${m.status}, ${i})`;
        }
    }

    // ===== Seed Tasks (Parent + Children) =====
    console.log('Seeding tasks...');
    const parentTasks = [
        { id: 'T001', projectId: 'PRJ001', name: 'Network Setup', assignedTo: 'Arun Kumar', startDate: '2026-03-01', endDate: '2026-04-15', duration: '45d', dependency: '', progress: 25, status: 'In Progress', priority: 'High' },
        { id: 'T002', projectId: 'PRJ001', name: 'Server Room Build', assignedTo: 'Arun Kumar', startDate: '2026-01-15', endDate: '2026-03-15', duration: '60d', dependency: '', progress: 70, status: 'In Progress', priority: 'High' },
        { id: 'T003', projectId: 'PRJ003', name: 'CCTV Installation', assignedTo: 'Vikas Nair', startDate: '2026-02-01', endDate: '2026-03-31', duration: '58d', dependency: '', progress: 75, status: 'In Progress', priority: 'High' },
        { id: 'T004', projectId: 'PRJ002', name: 'POS Integration', assignedTo: 'Rahul Sharma', startDate: '2026-03-01', endDate: '2026-04-10', duration: '40d', dependency: '', progress: 30, status: 'In Progress', priority: 'High' },
        { id: 'T005', projectId: 'PRJ004', name: 'Office Workstation Setup', assignedTo: 'Priya Patel', startDate: '2026-03-15', endDate: '2026-05-15', duration: '61d', dependency: '', progress: 10, status: 'In Progress', priority: 'Medium' }
    ];

    for (let i = 0; i < parentTasks.length; i++) {
        const t = parentTasks[i];
        await sql`INSERT INTO tasks (id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority, sort_order)
            VALUES (${t.id}, ${t.projectId}, ${null}, ${t.name}, ${t.assignedTo}, ${t.startDate}, ${t.endDate}, ${t.duration}, ${t.dependency}, ${t.progress}, ${t.status}, ${t.priority}, ${i})`;
    }

    const childTasks = [
        // T001 children
        { id: 'T001-1', projectId: 'PRJ001', parentId: 'T001', name: 'Router Installation', assignedTo: 'Rahul Sharma', startDate: '2026-03-01', endDate: '2026-03-15', duration: '14d', dependency: '', progress: 80, status: 'In Progress', priority: 'High' },
        { id: 'T001-2', projectId: 'PRJ001', parentId: 'T001', name: 'Firewall Configuration', assignedTo: 'Vikas Nair', startDate: '2026-03-15', endDate: '2026-03-30', duration: '15d', dependency: 'T001-1', progress: 0, status: 'Planned', priority: 'High' },
        { id: 'T001-3', projectId: 'PRJ001', parentId: 'T001', name: 'WiFi Controller Setup', assignedTo: 'Priya Patel', startDate: '2026-03-30', endDate: '2026-04-15', duration: '16d', dependency: 'T001-2', progress: 0, status: 'Planned', priority: 'Medium' },
        // T002 children
        { id: 'T002-1', projectId: 'PRJ001', parentId: 'T002', name: 'Raised Floor Installation', assignedTo: 'Karthik R', startDate: '2026-01-15', endDate: '2026-02-01', duration: '17d', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
        { id: 'T002-2', projectId: 'PRJ001', parentId: 'T002', name: 'Cooling System Setup', assignedTo: 'Suresh Kumar', startDate: '2026-02-01', endDate: '2026-02-28', duration: '27d', dependency: 'T002-1', progress: 100, status: 'Completed', priority: 'High' },
        { id: 'T002-3', projectId: 'PRJ001', parentId: 'T002', name: 'Rack Installation', assignedTo: 'Arun Kumar', startDate: '2026-02-28', endDate: '2026-03-10', duration: '10d', dependency: 'T002-2', progress: 50, status: 'In Progress', priority: 'Medium' },
        { id: 'T002-4', projectId: 'PRJ001', parentId: 'T002', name: 'Power Distribution', assignedTo: 'Deepa Menon', startDate: '2026-03-01', endDate: '2026-03-15', duration: '14d', dependency: 'T002-1', progress: 30, status: 'In Progress', priority: 'High' },
        // T003 children
        { id: 'T003-1', projectId: 'PRJ003', parentId: 'T003', name: 'Camera Mounting', assignedTo: 'Karthik R', startDate: '2026-02-01', endDate: '2026-02-20', duration: '19d', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
        { id: 'T003-2', projectId: 'PRJ003', parentId: 'T003', name: 'Cable Routing', assignedTo: 'Ananya Singh', startDate: '2026-02-10', endDate: '2026-02-28', duration: '18d', dependency: '', progress: 100, status: 'Completed', priority: 'Medium' },
        { id: 'T003-3', projectId: 'PRJ003', parentId: 'T003', name: 'NVR Configuration', assignedTo: 'Vikas Nair', startDate: '2026-03-01', endDate: '2026-03-15', duration: '14d', dependency: 'T003-1', progress: 60, status: 'In Progress', priority: 'High' },
        { id: 'T003-4', projectId: 'PRJ003', parentId: 'T003', name: 'Remote Access Setup', assignedTo: 'Vikas Nair', startDate: '2026-03-15', endDate: '2026-03-31', duration: '16d', dependency: 'T003-3', progress: 0, status: 'Planned', priority: 'Medium' },
        // T004 children
        { id: 'T004-1', projectId: 'PRJ002', parentId: 'T004', name: 'POS Hardware Setup', assignedTo: 'Deepa Menon', startDate: '2026-03-01', endDate: '2026-03-12', duration: '11d', dependency: '', progress: 80, status: 'In Progress', priority: 'High' },
        { id: 'T004-2', projectId: 'PRJ002', parentId: 'T004', name: 'Software Installation', assignedTo: 'Rahul Sharma', startDate: '2026-03-12', endDate: '2026-03-25', duration: '13d', dependency: 'T004-1', progress: 0, status: 'Planned', priority: 'Medium' },
        { id: 'T004-3', projectId: 'PRJ002', parentId: 'T004', name: 'Network Integration', assignedTo: 'Suresh Kumar', startDate: '2026-03-25', endDate: '2026-04-10', duration: '16d', dependency: 'T004-2', progress: 0, status: 'Planned', priority: 'High' },
        // T005 children
        { id: 'T005-1', projectId: 'PRJ004', parentId: 'T005', name: 'Hardware Procurement', assignedTo: 'Priya Patel', startDate: '2026-03-15', endDate: '2026-03-30', duration: '15d', dependency: '', progress: 40, status: 'In Progress', priority: 'High' },
        { id: 'T005-2', projectId: 'PRJ004', parentId: 'T005', name: 'Network Points', assignedTo: 'Deepa Menon', startDate: '2026-03-20', endDate: '2026-04-10', duration: '21d', dependency: '', progress: 0, status: 'Planned', priority: 'Medium' },
        { id: 'T005-3', projectId: 'PRJ004', parentId: 'T005', name: 'Workstation Assembly', assignedTo: 'Priya Patel', startDate: '2026-04-10', endDate: '2026-05-01', duration: '21d', dependency: 'T005-1', progress: 0, status: 'Planned', priority: 'Medium' },
        { id: 'T005-4', projectId: 'PRJ004', parentId: 'T005', name: 'Software & Config', assignedTo: 'Arun Kumar', startDate: '2026-05-01', endDate: '2026-05-15', duration: '14d', dependency: 'T005-3', progress: 0, status: 'Planned', priority: 'Low' }
    ];

    // Insert level-2 children
    for (let i = 0; i < childTasks.length; i++) {
        const t = childTasks[i];
        await sql`INSERT INTO tasks (id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority, sort_order)
            VALUES (${t.id}, ${t.projectId}, ${t.parentId}, ${t.name}, ${t.assignedTo}, ${t.startDate}, ${t.endDate}, ${t.duration}, ${t.dependency}, ${t.progress}, ${t.status}, ${t.priority}, ${i})`;
    }

    // Level-3 grandchildren
    const grandChildren = [
        { id: 'T001-1a', projectId: 'PRJ001', parentId: 'T001-1', name: 'Core Router Config', assignedTo: 'Rahul Sharma', startDate: '2026-03-01', endDate: '2026-03-08', duration: '7d', dependency: '', progress: 100, status: 'Completed', priority: 'High' },
        { id: 'T001-1b', projectId: 'PRJ001', parentId: 'T001-1', name: 'Edge Router Setup', assignedTo: 'Rahul Sharma', startDate: '2026-03-08', endDate: '2026-03-15', duration: '7d', dependency: 'T001-1a', progress: 60, status: 'In Progress', priority: 'Medium' },
        { id: 'T001-2a', projectId: 'PRJ001', parentId: 'T001-2', name: 'Rule Definition', assignedTo: 'Vikas Nair', startDate: '2026-03-15', endDate: '2026-03-22', duration: '7d', dependency: 'T001-1', progress: 0, status: 'Planned', priority: 'High' },
        { id: 'T001-2b', projectId: 'PRJ001', parentId: 'T001-2', name: 'VPN Configuration', assignedTo: 'Vikas Nair', startDate: '2026-03-22', endDate: '2026-03-30', duration: '8d', dependency: 'T001-2a', progress: 0, status: 'Planned', priority: 'Medium' }
    ];

    for (let i = 0; i < grandChildren.length; i++) {
        const t = grandChildren[i];
        await sql`INSERT INTO tasks (id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority, sort_order)
            VALUES (${t.id}, ${t.projectId}, ${t.parentId}, ${t.name}, ${t.assignedTo}, ${t.startDate}, ${t.endDate}, ${t.duration}, ${t.dependency}, ${t.progress}, ${t.status}, ${t.priority}, ${i})`;
    }

    // ===== Seed Kanban Tasks =====
    console.log('Seeding kanban tasks...');
    const kanbanTasks = [
        { id: 'K001', title: 'Procure Cat6A cables for DC', project: 'Bangalore Data Center', priority: 'High', assignee: 'Arun Kumar', dueDate: '2026-03-18', comments: 3, attachments: 1, tags: ['cabling','hardware'], column: 'in-progress' },
        { id: 'K002', title: 'Configure core switches', project: 'Bangalore Data Center', priority: 'High', assignee: 'Rahul Sharma', dueDate: '2026-03-20', comments: 5, attachments: 2, tags: ['network'], column: 'in-progress' },
        { id: 'K003', title: 'Install UPS backup units', project: 'Bangalore Data Center', priority: 'Medium', assignee: 'Karthik R', dueDate: '2026-03-25', comments: 1, attachments: 0, tags: ['hardware'], column: 'planned' },
        { id: 'K004', title: 'Setup firewall rules', project: 'Bangalore Data Center', priority: 'High', assignee: 'Vikas Nair', dueDate: '2026-04-01', comments: 2, attachments: 1, tags: ['security','network'], column: 'backlog' },
        { id: 'K005', title: 'POS terminal configuration', project: 'Mangalore Showroom Network', priority: 'Medium', assignee: 'Deepa Menon', dueDate: '2026-03-22', comments: 4, attachments: 0, tags: ['hardware','software'], column: 'in-progress' },
        { id: 'K006', title: 'NVR firmware update', project: 'Chennai CCTV Setup', priority: 'Low', assignee: 'Vikas Nair', dueDate: '2026-03-16', comments: 0, attachments: 1, tags: ['security','software'], column: 'testing' },
        { id: 'K007', title: 'Showroom 2 WiFi AP install', project: 'Mangalore Showroom Network', priority: 'Medium', assignee: 'Suresh Kumar', dueDate: '2026-03-14', comments: 2, attachments: 0, tags: ['network'], column: 'completed' },
        { id: 'K008', title: 'Camera angle adjustment - Bldg C', project: 'Chennai CCTV Setup', priority: 'Low', assignee: 'Karthik R', dueDate: '2026-03-19', comments: 1, attachments: 3, tags: ['security'], column: 'completed' },
        { id: 'K009', title: 'VPN gateway configuration', project: 'Bangalore Data Center', priority: 'High', assignee: 'Vikas Nair', dueDate: '2026-04-05', comments: 0, attachments: 0, tags: ['security','network'], column: 'backlog' },
        { id: 'K010', title: 'Waiting for vendor - Power panels', project: 'Bangalore Data Center', priority: 'High', assignee: 'Arun Kumar', dueDate: '2026-03-10', comments: 6, attachments: 2, tags: ['hardware'], column: 'blocked' },
        { id: 'K011', title: 'Office LAN cabling - Floor 2', project: 'Mysuru Office IT Setup', priority: 'Medium', assignee: 'Deepa Menon', dueDate: '2026-04-05', comments: 0, attachments: 0, tags: ['cabling'], column: 'planned' },
        { id: 'K012', title: 'Showroom 3 network testing', project: 'Mangalore Showroom Network', priority: 'High', assignee: 'Rahul Sharma', dueDate: '2026-03-28', comments: 1, attachments: 0, tags: ['network'], column: 'testing' },
        { id: 'K013', title: 'Server rack cable management', project: 'Bangalore Data Center', priority: 'Low', assignee: 'Karthik R', dueDate: '2026-03-30', comments: 0, attachments: 0, tags: ['cabling','hardware'], column: 'planned' },
        { id: 'K014', title: 'WiFi heat map analysis', project: 'Hubli Campus WiFi', priority: 'Medium', assignee: 'Suresh Kumar', dueDate: '2026-03-25', comments: 2, attachments: 1, tags: ['network'], column: 'in-progress' },
        { id: 'K015', title: 'Domain controller setup', project: 'Mysuru Office IT Setup', priority: 'High', assignee: 'Priya Patel', dueDate: '2026-04-15', comments: 0, attachments: 0, tags: ['software','network'], column: 'backlog' }
    ];

    for (const k of kanbanTasks) {
        await sql`INSERT INTO kanban_tasks (id, title, project, priority, assignee, due_date, comments, attachments, tags, column_status)
            VALUES (${k.id}, ${k.title}, ${k.project}, ${k.priority}, ${k.assignee}, ${k.dueDate}, ${k.comments}, ${k.attachments}, ${k.tags}, ${k.column})`;
    }

    // ===== Seed Team Members =====
    console.log('Seeding team members...');
    const team = [
        { name: 'Arun Kumar', role: 'Senior Network Engineer', avatar: 'bg-1', initials: 'AK', tasks: 8, completed: 3, load: 'High', projects: ['PRJ001','PRJ004','PRJ006'], skills: ['Network','Server','Cloud'] },
        { name: 'Rahul Sharma', role: 'Network Engineer', avatar: 'bg-2', initials: 'RS', tasks: 6, completed: 2, load: 'Medium', projects: ['PRJ001','PRJ002','PRJ005'], skills: ['Network','WiFi','Switching'] },
        { name: 'Vikas Nair', role: 'Security Engineer', avatar: 'bg-3', initials: 'VN', tasks: 5, completed: 2, load: 'Medium', projects: ['PRJ001','PRJ003'], skills: ['Security','CCTV','Firewall'] },
        { name: 'Priya Patel', role: 'IT Infrastructure Lead', avatar: 'bg-4', initials: 'PP', tasks: 4, completed: 1, load: 'Medium', projects: ['PRJ001','PRJ004'], skills: ['Infrastructure','Planning','Server'] },
        { name: 'Karthik R', role: 'Field Engineer', avatar: 'bg-5', initials: 'KR', tasks: 5, completed: 3, load: 'Medium', projects: ['PRJ001','PRJ003'], skills: ['Hardware','Cabling','CCTV'] },
        { name: 'Deepa Menon', role: 'Systems Engineer', avatar: 'bg-1', initials: 'DM', tasks: 4, completed: 1, load: 'Low', projects: ['PRJ002','PRJ004'], skills: ['Systems','POS','Cabling'] },
        { name: 'Suresh Kumar', role: 'WiFi Specialist', avatar: 'bg-2', initials: 'SK', tasks: 3, completed: 1, load: 'Low', projects: ['PRJ001','PRJ002','PRJ005'], skills: ['WiFi','Wireless','RF'] },
        { name: 'Ananya Singh', role: 'Junior Engineer', avatar: 'bg-3', initials: 'AS', tasks: 2, completed: 1, load: 'Low', projects: ['PRJ003'], skills: ['Cabling','Hardware'] }
    ];

    for (const m of team) {
        await sql`INSERT INTO team_members (name, role, avatar, initials, tasks_count, completed_count, load, projects, skills)
            VALUES (${m.name}, ${m.role}, ${m.avatar}, ${m.initials}, ${m.tasks}, ${m.completed}, ${m.load}, ${m.projects}, ${m.skills})`;
    }

    // ===== Seed Assets =====
    console.log('Seeding assets...');
    const assets = [
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
    ];

    for (const a of assets) {
        await sql`INSERT INTO assets (id, name, category, location, status, project, serial_number, purchase_date)
            VALUES (${a.id}, ${a.name}, ${a.category}, ${a.location}, ${a.status}, ${a.project}, ${a.serial}, ${a.purchaseDate})`;
    }

    // ===== Seed Activities =====
    console.log('Seeding activities...');
    const activities = [
        { type: 'blue', text: '<strong>Rahul Sharma</strong> completed Router Installation for Bangalore DC', time: '5 min ago' },
        { type: 'green', text: '<strong>Milestone:</strong> Mangalore Showroom — WiFi Deployment completed', time: '30 min ago' },
        { type: 'orange', text: '<strong>Budget Alert:</strong> Chennai CCTV project reached 90% budget', time: '1 hr ago' },
        { type: 'red', text: '<strong>Delay:</strong> Power panel delivery delayed — Bangalore DC', time: '2 hrs ago' },
        { type: 'blue', text: '<strong>Priya Patel</strong> assigned to Mysuru Office IT Setup', time: '3 hrs ago' },
        { type: 'green', text: '<strong>Task Done:</strong> Camera Mounting completed at Chennai Site A', time: '4 hrs ago' },
        { type: 'blue', text: '<strong>Vikas Nair</strong> started NVR Configuration', time: '5 hrs ago' },
        { type: 'orange', text: '<strong>Risk:</strong> Vendor delivery timeline uncertain for Hubli WiFi project', time: '6 hrs ago' }
    ];

    for (const a of activities) {
        await sql`INSERT INTO activities (type, text, time) VALUES (${a.type}, ${a.text}, ${a.time})`;
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('   - 6 Projects with milestones');
    console.log('   - 23 Tasks (hierarchical)');
    console.log('   - 15 Kanban tasks');
    console.log('   - 8 Team members');
    console.log('   - 10 Assets');
    console.log('   - 8 Activity feed items');
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
