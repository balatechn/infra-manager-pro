const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        // Fetch all tasks
        const allTasks = await sql`SELECT * FROM tasks ORDER BY sort_order`;

        // Build hierarchy: group children under parents
        const taskMap = {};
        const roots = [];

        for (const t of allTasks) {
            taskMap[t.id] = { ...t, children: [] };
        }
        for (const t of allTasks) {
            if (t.parent_id && taskMap[t.parent_id]) {
                taskMap[t.parent_id].children.push(taskMap[t.id]);
            } else if (!t.parent_id) {
                roots.push(taskMap[t.id]);
            }
        }

        return res.json(roots);
    }

    if (req.method === 'POST') {
        const { id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority } = req.body;
        const rows = await sql`INSERT INTO tasks (id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority)
            VALUES (${id}, ${project_id}, ${parent_id || null}, ${name}, ${assigned_to}, ${start_date}, ${end_date}, ${duration}, ${dependency || ''}, ${progress || 0}, ${status || 'Planned'}, ${priority || 'Medium'})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, progress, status } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE tasks SET
            progress = COALESCE(${progress}, progress),
            status = COALESCE(${status}, status)
            WHERE id = ${id} RETURNING *`;
        return res.json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
};
