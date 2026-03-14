const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const activities = await sql`SELECT * FROM activities ORDER BY created_at DESC LIMIT 20`;
        return res.json(activities);
    }

    if (req.method === 'POST') {
        const { type, text, time } = req.body;
        const rows = await sql`INSERT INTO activities (type, text, time) VALUES (${type || 'blue'}, ${text}, ${time || 'Just now'}) RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
};
