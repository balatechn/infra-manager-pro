const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const { id } = req.query;
        if (id) {
            const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
            if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
            const project = rows[0];
            const milestones = await sql`SELECT name, date, status FROM milestones WHERE project_id = ${id} ORDER BY sort_order`;
            project.milestones = milestones;
            return res.json(project);
        }
        const projects = await sql`SELECT * FROM projects ORDER BY start_date DESC`;
        // Attach milestones to each project
        const milestones = await sql`SELECT * FROM milestones ORDER BY project_id, sort_order`;
        const milestoneMap = {};
        for (const m of milestones) {
            if (!milestoneMap[m.project_id]) milestoneMap[m.project_id] = [];
            milestoneMap[m.project_id].push({ name: m.name, date: m.date, status: m.status });
        }
        for (const p of projects) {
            p.milestones = milestoneMap[p.id] || [];
        }
        return res.json(projects);
    }

    if (req.method === 'POST') {
        const { id, name, client, location, region, manager, start_date, end_date, progress, status, budget, budget_used, description, team } = req.body;
        const rows = await sql`INSERT INTO projects (id, name, client, location, region, manager, start_date, end_date, progress, status, budget, budget_used, description, team)
            VALUES (${id}, ${name}, ${client}, ${location}, ${region || 'South'}, ${manager}, ${start_date}, ${end_date}, ${progress || 0}, ${status || 'Planned'}, ${budget || 0}, ${budget_used || 0}, ${description || ''}, ${team || []})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const setClauses = Object.entries(updates).map(([key, val]) => ({ key, val }));
        // Simple update for selected fields
        const rows = await sql`UPDATE projects SET 
            name = COALESCE(${updates.name}, name),
            status = COALESCE(${updates.status}, status),
            progress = COALESCE(${updates.progress}, progress),
            budget_used = COALESCE(${updates.budget_used}, budget_used),
            updated_at = NOW()
            WHERE id = ${id} RETURNING *`;
        return res.json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
};
