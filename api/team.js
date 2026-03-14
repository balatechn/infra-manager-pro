const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const members = await sql`SELECT * FROM team_members ORDER BY name`;
        return res.json(members);
    }

    if (req.method === 'POST') {
        const { name, role, avatar, initials, tasks_count, completed_count, load, projects, skills } = req.body;
        const rows = await sql`INSERT INTO team_members (name, role, avatar, initials, tasks_count, completed_count, load, projects, skills)
            VALUES (${name}, ${role}, ${avatar || 'bg-1'}, ${initials}, ${tasks_count || 0}, ${completed_count || 0}, ${load || 'Low'}, ${projects || []}, ${skills || []})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
};
