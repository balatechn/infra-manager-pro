const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const allTasks = await sql`SELECT * FROM tasks ORDER BY sort_order`;

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
        const { id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority, sort_order } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
        const rows = await sql`INSERT INTO tasks (id, project_id, parent_id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority, sort_order)
            VALUES (${id}, ${project_id}, ${parent_id || null}, ${name}, ${assigned_to}, ${start_date}, ${end_date}, ${duration || ''}, ${dependency || ''}, ${progress || 0}, ${status || 'Planned'}, ${priority || 'Medium'}, ${sort_order || 999})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, name, assigned_to, start_date, end_date, duration, dependency, progress, status, priority } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE tasks SET
            name = COALESCE(${name}, name),
            assigned_to = COALESCE(${assigned_to}, assigned_to),
            start_date = COALESCE(${start_date}, start_date),
            end_date = COALESCE(${end_date}, end_date),
            duration = COALESCE(${duration}, duration),
            dependency = COALESCE(${dependency}, dependency),
            progress = COALESCE(${progress !== undefined ? progress : null}, progress),
            status = COALESCE(${status}, status),
            priority = COALESCE(${priority}, priority)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: 'id is required' });
        // Delete children first, then parent
        await sql`DELETE FROM tasks WHERE parent_id = ${id}`;
        const rows = await sql`DELETE FROM tasks WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        return res.json({ deleted: rows[0] });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
};
