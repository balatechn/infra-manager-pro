const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const { id } = req.query;
        if (id) {
            const roles = await sql`SELECT * FROM roles WHERE id = ${id}`;
            if (roles.length === 0) return res.status(404).json({ error: 'Role not found' });
            const role = roles[0];
            // Get permissions for this role
            const perms = await sql`SELECT p.* FROM permissions p
                JOIN role_permissions rp ON rp.permission_id = p.id
                WHERE rp.role_id = ${id} ORDER BY p.module, p.key`;
            role.permissions = perms;
            // Get user count
            const count = await sql`SELECT COUNT(*) as count FROM users WHERE role_id = ${id}`;
            role.user_count = Number(count[0].count);
            return res.json(role);
        }
        // List all roles with permission count and user count
        const roles = await sql`SELECT r.*, 
            (SELECT COUNT(*) FROM role_permissions rp WHERE rp.role_id = r.id) as permission_count,
            (SELECT COUNT(*) FROM users u WHERE u.role_id = r.id) as user_count
            FROM roles r ORDER BY r.id`;
        return res.json(roles);
    }

    if (req.method === 'POST') {
        const { name, description, color, permissions } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });
        const existing = await sql`SELECT id FROM roles WHERE name = ${name}`;
        if (existing.length > 0) return res.status(409).json({ error: 'Role name already exists' });
        const rows = await sql`INSERT INTO roles (name, description, color) VALUES (${name}, ${description || ''}, ${color || '#2563EB'}) RETURNING *`;
        const role = rows[0];
        // Assign permissions
        if (permissions && permissions.length) {
            for (const permId of permissions) {
                await sql`INSERT INTO role_permissions (role_id, permission_id) VALUES (${role.id}, ${permId}) ON CONFLICT DO NOTHING`;
            }
        }
        return res.status(201).json(role);
    }

    if (req.method === 'PUT') {
        const { id, name, description, color, permissions } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        // Check if system role — allow permission changes but not deletion
        const rows = await sql`UPDATE roles SET
            name = COALESCE(${name}, name),
            description = COALESCE(${description}, description),
            color = COALESCE(${color}, color)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Role not found' });
        // Update permissions if provided
        if (permissions !== undefined) {
            await sql`DELETE FROM role_permissions WHERE role_id = ${id}`;
            for (const permId of permissions) {
                await sql`INSERT INTO role_permissions (role_id, permission_id) VALUES (${id}, ${permId}) ON CONFLICT DO NOTHING`;
            }
        }
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'id query param is required' });
        const role = await sql`SELECT is_system FROM roles WHERE id = ${id}`;
        if (role.length && role[0].is_system) return res.status(403).json({ error: 'Cannot delete system roles' });
        await sql`DELETE FROM roles WHERE id = ${id}`;
        return res.json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
};
