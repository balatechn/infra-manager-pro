const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const tasks = await sql`SELECT * FROM kanban_tasks ORDER BY due_date`;
        return res.json(tasks);
    }

    if (req.method === 'POST') {
        const { id, title, project, priority, assignee, due_date, tags, column_status } = req.body;
        const rows = await sql`INSERT INTO kanban_tasks (id, title, project, priority, assignee, due_date, comments, attachments, tags, column_status)
            VALUES (${id}, ${title}, ${project}, ${priority || 'Medium'}, ${assignee}, ${due_date}, ${0}, ${0}, ${tags || []}, ${column_status || 'backlog'})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, column_status, title, priority, assignee } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE kanban_tasks SET
            column_status = COALESCE(${column_status}, column_status),
            title = COALESCE(${title}, title),
            priority = COALESCE(${priority}, priority),
            assignee = COALESCE(${assignee}, assignee)
            WHERE id = ${id} RETURNING *`;
        return res.json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
};
