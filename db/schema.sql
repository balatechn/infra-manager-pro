-- Infra Manager Pro — Neon PostgreSQL Schema

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    location TEXT NOT NULL,
    region TEXT DEFAULT 'South',
    manager TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Planned',
    budget NUMERIC(12,2) DEFAULT 0,
    budget_used NUMERIC(12,2) DEFAULT 0,
    description TEXT,
    team TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    parent_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    assigned_to TEXT,
    start_date DATE,
    end_date DATE,
    duration TEXT,
    dependency TEXT,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Planned',
    priority TEXT DEFAULT 'Medium',
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kanban_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    project TEXT,
    priority TEXT DEFAULT 'Medium',
    assignee TEXT,
    due_date DATE,
    comments INTEGER DEFAULT 0,
    attachments INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    column_status TEXT DEFAULT 'backlog'
);

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    initials TEXT,
    tasks_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    load TEXT DEFAULT 'Low',
    projects TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    status TEXT DEFAULT 'In Warehouse',
    project TEXT,
    serial_number TEXT,
    purchase_date DATE
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    type TEXT DEFAULT 'blue',
    text TEXT NOT NULL,
    time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== Role-Based Access Control =====

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#2563EB',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    module TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    initials TEXT,
    avatar TEXT DEFAULT 'bg-1',
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Active',
    department TEXT,
    phone TEXT,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
