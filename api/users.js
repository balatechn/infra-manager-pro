const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const { id } = req.query;
        if (id) {
            const rows = await sql`SELECT u.*, r.name as role_name, r.color as role_color 
                FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ${id}`;
            if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
            return res.json(rows[0]);
        }
        const users = await sql`SELECT u.*, r.name as role_name, r.color as role_color 
            FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.name`;
        return res.json(users);
    }

    if (req.method === 'POST') {
        const { name, email, initials, avatar, role_id, status, department, phone } = req.body;
        if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) return res.status(409).json({ error: 'Email already exists' });
        const rows = await sql`INSERT INTO users (name, email, initials, avatar, role_id, status, department, phone)
            VALUES (${name}, ${email}, ${initials || name.split(' ').map(n => n[0]).join('').toUpperCase()}, ${avatar || 'bg-1'}, ${role_id}, ${status || 'Active'}, ${department || ''}, ${phone || ''})
            RETURNING *`;
        const user = rows[0];
        const roleInfo = await sql`SELECT name as role_name, color as role_color FROM roles WHERE id = ${role_id}`;
        if (roleInfo.length) { user.role_name = roleInfo[0].role_name; user.role_color = roleInfo[0].role_color; }
        return res.status(201).json(user);
    }

    if (req.method === 'PUT') {
        const { id, name, email, role_id, status, department, phone, avatar } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE users SET
            name = COALESCE(${name}, name),
            email = COALESCE(${email}, email),
            role_id = COALESCE(${role_id}, role_id),
            status = COALESCE(${status}, status),
            department = COALESCE(${department}, department),
            phone = COALESCE(${phone}, phone),
            avatar = COALESCE(${avatar}, avatar),
            initials = COALESCE(${name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : null}, initials)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = rows[0];
        const roleInfo = await sql`SELECT name as role_name, color as role_color FROM roles WHERE id = ${user.role_id}`;
        if (roleInfo.length) { user.role_name = roleInfo[0].role_name; user.role_color = roleInfo[0].role_color; }
        return res.json(user);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'id query param is required' });
        await sql`DELETE FROM users WHERE id = ${id}`;
        return res.json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
};
