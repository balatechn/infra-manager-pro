const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM billing_ledger ORDER BY created_at DESC`;
        return res.json(rows);
    }

    if (req.method === 'POST') {
        const { id, project_id, vendor_name, invoice_number, invoice_date, description, invoice_amount, gst_amount, total_amount, bill_received_date, payment_due_date, payment_status, payment_date, payment_mode, attachment_url } = req.body;
        if (!id || !vendor_name || !invoice_number) return res.status(400).json({ error: 'id, vendor_name, and invoice_number are required' });
        const rows = await sql`INSERT INTO billing_ledger (id, project_id, vendor_name, invoice_number, invoice_date, description, invoice_amount, gst_amount, total_amount, bill_received_date, payment_due_date, payment_status, payment_date, payment_mode, attachment_url)
            VALUES (${id}, ${project_id || null}, ${vendor_name}, ${invoice_number}, ${invoice_date || null}, ${description || ''}, ${invoice_amount || 0}, ${gst_amount || 0}, ${total_amount || 0}, ${bill_received_date || null}, ${payment_due_date || null}, ${payment_status || 'Pending'}, ${payment_date || null}, ${payment_mode || ''}, ${attachment_url || ''})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
        const { id, project_id, vendor_name, invoice_number, invoice_date, description, invoice_amount, gst_amount, total_amount, bill_received_date, payment_due_date, payment_status, payment_date, payment_mode, attachment_url } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE billing_ledger SET
            project_id = COALESCE(${project_id}, project_id),
            vendor_name = COALESCE(${vendor_name}, vendor_name),
            invoice_number = COALESCE(${invoice_number}, invoice_number),
            invoice_date = COALESCE(${invoice_date || null}, invoice_date),
            description = COALESCE(${description}, description),
            invoice_amount = COALESCE(${invoice_amount !== undefined ? invoice_amount : null}, invoice_amount),
            gst_amount = COALESCE(${gst_amount !== undefined ? gst_amount : null}, gst_amount),
            total_amount = COALESCE(${total_amount !== undefined ? total_amount : null}, total_amount),
            bill_received_date = COALESCE(${bill_received_date || null}, bill_received_date),
            payment_due_date = COALESCE(${payment_due_date || null}, payment_due_date),
            payment_status = COALESCE(${payment_status}, payment_status),
            payment_date = COALESCE(${payment_date || null}, payment_date),
            payment_mode = COALESCE(${payment_mode}, payment_mode),
            attachment_url = COALESCE(${attachment_url}, attachment_url)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        return res.json(rows[0]);
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM billing_ledger WHERE id = ${id}`;
        return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
