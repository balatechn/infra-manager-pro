const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM payments ORDER BY created_at DESC`;
        return res.json(rows);
    }

    if (req.method === 'POST') {
        const { id, vendor_name, invoice_number, payment_amount, payment_date, payment_mode, reference_number, project_id, remarks, status } = req.body;
        if (!id || !vendor_name) return res.status(400).json({ error: 'id and vendor_name are required' });
        const rows = await sql`INSERT INTO payments (id, vendor_name, invoice_number, payment_amount, payment_date, payment_mode, reference_number, project_id, remarks, status)
            VALUES (${id}, ${vendor_name}, ${invoice_number || ''}, ${payment_amount || 0}, ${payment_date || null}, ${payment_mode || ''}, ${reference_number || ''}, ${project_id || null}, ${remarks || ''}, ${status || 'Pending'})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, vendor_name, invoice_number, payment_amount, payment_date, payment_mode, reference_number, project_id, remarks, status } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE payments SET
            vendor_name = COALESCE(${vendor_name}, vendor_name),
            invoice_number = COALESCE(${invoice_number}, invoice_number),
            payment_amount = COALESCE(${payment_amount !== undefined ? payment_amount : null}, payment_amount),
            payment_date = COALESCE(${payment_date || null}, payment_date),
            payment_mode = COALESCE(${payment_mode}, payment_mode),
            reference_number = COALESCE(${reference_number}, reference_number),
            project_id = COALESCE(${project_id}, project_id),
            remarks = COALESCE(${remarks}, remarks),
            status = COALESCE(${status}, status)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM payments WHERE id = ${id}`;
        return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
