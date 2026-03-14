const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM bills_received ORDER BY created_at DESC`;
        return res.json(rows);
    }

    if (req.method === 'POST') {
        const { id, vendor_name, project_id, invoice_number, invoice_date, amount, department, approval_status, approved_by, payment_status, due_date } = req.body;
        if (!id || !vendor_name || !invoice_number) return res.status(400).json({ error: 'id, vendor_name, and invoice_number are required' });
        const rows = await sql`INSERT INTO bills_received (id, vendor_name, project_id, invoice_number, invoice_date, amount, department, approval_status, approved_by, payment_status, due_date)
            VALUES (${id}, ${vendor_name}, ${project_id || null}, ${invoice_number}, ${invoice_date || null}, ${amount || 0}, ${department || ''}, ${approval_status || 'Pending'}, ${approved_by || ''}, ${payment_status || 'Unpaid'}, ${due_date || null})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, vendor_name, project_id, invoice_number, invoice_date, amount, department, approval_status, approved_by, payment_status, due_date } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE bills_received SET
            vendor_name = COALESCE(${vendor_name}, vendor_name),
            project_id = COALESCE(${project_id}, project_id),
            invoice_number = COALESCE(${invoice_number}, invoice_number),
            invoice_date = COALESCE(${invoice_date || null}, invoice_date),
            amount = COALESCE(${amount !== undefined ? amount : null}, amount),
            department = COALESCE(${department}, department),
            approval_status = COALESCE(${approval_status}, approval_status),
            approved_by = COALESCE(${approved_by}, approved_by),
            payment_status = COALESCE(${payment_status}, payment_status),
            due_date = COALESCE(${due_date || null}, due_date)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM bills_received WHERE id = ${id}`;
        return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
