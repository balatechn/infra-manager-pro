const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const assets = await sql`SELECT * FROM assets ORDER BY name`;
        return res.json(assets);
    }

    if (req.method === 'POST') {
        const { id, name, category, location, status, project, serial_number, purchase_date } = req.body;
        const rows = await sql`INSERT INTO assets (id, name, category, location, status, project, serial_number, purchase_date)
            VALUES (${id}, ${name}, ${category}, ${location}, ${status || 'In Warehouse'}, ${project}, ${serial_number}, ${purchase_date})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, status, location, project } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE assets SET
            status = COALESCE(${status}, status),
            location = COALESCE(${location}, location),
            project = COALESCE(${project}, project)
            WHERE id = ${id} RETURNING *`;
        return res.json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
};
