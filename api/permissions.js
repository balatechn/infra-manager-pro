const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const permissions = await sql`SELECT * FROM permissions ORDER BY module, key`;

    // Group by module
    const grouped = {};
    for (const p of permissions) {
        if (!grouped[p.module]) grouped[p.module] = [];
        grouped[p.module].push(p);
    }

    return res.json({ permissions, grouped });
};
