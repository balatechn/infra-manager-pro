# Infra Manager Pro

A comprehensive IT Infrastructure Project Management SaaS application built with vanilla HTML/CSS/JS frontend, Vercel serverless API, and Neon PostgreSQL.

**Live:** [infrapro.vedhitek.com](https://infrapro.vedhitek.com)

---

## Features

### Core Modules
- **Dashboard** — Executive overview with project KPIs, time/scope/cost charts, workload distribution
- **Projects** — Full project lifecycle management with budgets, timelines, and progress tracking
- **Tasks** — Task CRUD with assignees, priorities, status tracking, and due dates
- **Gantt Chart** — Interactive timeline with zoom levels (Weeks/Months/Quarters) and click-to-edit
- **Kanban Board** — Drag-and-drop task board with swim lanes
- **Teams** — Team member management with roles and workload visibility
- **Reports** — Project analytics with charts and data export
- **Assets** — IT asset inventory tracking

### Finance & Billing Module
- **Finance Dashboard** — KPI cards, monthly expense trends, budget utilization, vendor payment status charts
- **Billing Ledger** — Invoice tracking with GST calculation, vendor/project mapping, payment status
- **Accrual Budget** — Monthly budget vs actual accrual tracking with variance analysis
- **Bills Received** — Approval workflow (Received → Verified → Approved → Payment Release)
- **Payment Tracker** — Payment records with mode, reference, and status tracking
- **Reports** — Monthly accrual, vendor outstanding, project expense, and payment register with CSV export

### Platform Features
- **Dark/Light Mode** — Toggle between themes with persistent preference
- **Role-Based Access Control** — Roles and permissions management
- **Global Search** — Ctrl+K quick search across projects, tasks, and teams
- **Notifications Panel** — Activity feed with real-time updates
- **User Profile Menu** — Avatar dropdown with settings and logout
- **Settings** — Application configuration, account, and preferences
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Charts | Chart.js 4.4.0 (CDN) |
| Fonts | Google Fonts — Inter |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Neon PostgreSQL (serverless) |
| Hosting | Vercel |
| Version Control | GitHub |

---

## Project Structure

```
infra-manager-pro/
├── index.html              # Single-page app entry point
├── css/
│   ├── main.css            # Global styles, variables, nav, layout
│   ├── pages.css           # Page-specific styles
│   ├── components.css      # Shared component styles
│   ├── gantt.css           # Gantt chart styles
│   ├── kanban.css          # Kanban board styles
│   ├── finance.css         # Finance module styles
│   └── responsive.css      # Mobile/tablet breakpoints
├── js/
│   ├── app.js              # SPA router, global bindings, init
│   ├── data.js             # Data layer — API fetch + static fallback
│   ├── components.js       # Shared UI components
│   └── pages/
│       ├── dashboard.js    # Dashboard page
│       ├── projects.js     # Projects list page
│       ├── project-details.js # Single project detail view
│       ├── tasks.js        # Tasks page
│       ├── gantt.js        # Gantt chart page
│       ├── kanban.js       # Kanban board page
│       ├── teams.js        # Teams page
│       ├── reports.js      # Reports page
│       ├── assets.js       # Assets page
│       ├── finance.js      # Finance module (6 sub-pages)
│       └── settings.js     # Settings page
├── api/                    # Vercel serverless functions
│   ├── activities.js       # Activity feed API
│   ├── assets.js           # Assets CRUD
│   ├── dashboard.js        # Dashboard aggregation
│   ├── finance.js          # Finance CRUD (6 entities)
│   ├── kanban.js           # Kanban tasks CRUD
│   ├── permissions.js      # Permissions API
│   ├── projects.js         # Projects CRUD
│   ├── roles.js            # Roles API
│   ├── tasks.js            # Tasks CRUD
│   ├── team.js             # Team members CRUD
│   └── users.js            # Users API
├── lib/
│   └── db.js               # Neon DB connection helper
├── db/
│   └── seed.js             # Database seed script
├── scripts/
│   └── migrate-finance.js  # Finance tables migration
├── vercel.json             # Vercel configuration
├── package.json
└── .env.example            # Environment variable template
```

---

## Database Schema

### Core Tables
`projects` · `milestones` · `tasks` · `kanban_tasks` · `team_members` · `assets` · `activities` · `roles` · `permissions` · `role_permissions` · `users`

### Finance Tables
`vendors` · `departments` · `billing_ledger` · `accrual_budget` · `bills_received` · `payments`

---

## Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Vercel CLI (`npm i -g vercel`)

### Setup

```bash
# Clone the repository
git clone https://github.com/balatechn/infra-manager-pro.git
cd infra-manager-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Seed the database
npm run seed
node scripts/migrate-finance.js

# Run locally
npm run dev
```

### Deploy

```bash
vercel --prod
```

---

## Design System

- **Dark theme** (default): `#0F172A` backgrounds, navy blue surfaces
- **Accent color**: Amber `#F59E0B` for buttons, badges, active states
- **Typography**: Inter font family, weight 300–800
- **Layout**: Fixed top nav + horizontal page navigation bar
- **CSS Variables**: Centralized in `:root` for easy theming

---

## License

Private — All rights reserved.
