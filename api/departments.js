const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM departments ORDER BY name`;
        return res.json(rows);
    }

    if (req.method === 'POST') {
        const { id, name } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
        const rows = await sql`INSERT INTO departments (id, name)
            VALUES (${id}, ${name})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, name } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE departments SET
            name = COALESCE(${name}, name)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM departments WHERE id = ${id}`;
        return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
