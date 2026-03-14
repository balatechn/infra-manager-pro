const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const entity = url.searchParams.get('entity');

    if (!entity) return res.status(400).json({ error: 'entity query parameter required' });

    switch (entity) {
        case 'billing-ledger': return handleBillingLedger(req, res, sql);
        case 'accrual-budget': return handleAccrualBudget(req, res, sql);
        case 'bills-received': return handleBillsReceived(req, res, sql);
        case 'payments': return handlePayments(req, res, sql);
        case 'vendors': return handleVendors(req, res, sql);
        case 'departments': return handleDepartments(req, res, sql);
        default: return res.status(400).json({ error: 'Unknown entity: ' + entity });
    }
};

async function handleBillingLedger(req, res, sql) {
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
}

async function handleAccrualBudget(req, res, sql) {
    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM accrual_budget ORDER BY month DESC, project_id`;
        return res.json(rows);
    }
    if (req.method === 'POST') {
        const { id, project_id, month, department, cost_category, budget_amount, actual_accrual, notes } = req.body;
        if (!id || !month) return res.status(400).json({ error: 'id and month are required' });
        const variance = (budget_amount || 0) - (actual_accrual || 0);
        const rows = await sql`INSERT INTO accrual_budget (id, project_id, month, department, cost_category, budget_amount, actual_accrual, variance, notes)
            VALUES (${id}, ${project_id || null}, ${month}, ${department || ''}, ${cost_category || 'Misc'}, ${budget_amount || 0}, ${actual_accrual || 0}, ${variance}, ${notes || ''})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }
    if (req.method === 'PUT') {
        const { id, project_id, month, department, cost_category, budget_amount, actual_accrual, notes } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const variance = (budget_amount !== undefined && actual_accrual !== undefined) ? budget_amount - actual_accrual : undefined;
        const rows = await sql`UPDATE accrual_budget SET
            project_id = COALESCE(${project_id}, project_id),
            month = COALESCE(${month}, month),
            department = COALESCE(${department}, department),
            cost_category = COALESCE(${cost_category}, cost_category),
            budget_amount = COALESCE(${budget_amount !== undefined ? budget_amount : null}, budget_amount),
            actual_accrual = COALESCE(${actual_accrual !== undefined ? actual_accrual : null}, actual_accrual),
            variance = COALESCE(${variance !== undefined ? variance : null}, variance),
            notes = COALESCE(${notes}, notes)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        return res.json(rows[0]);
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM accrual_budget WHERE id = ${id}`;
        return res.json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}

async function handleBillsReceived(req, res, sql) {
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
}

async function handlePayments(req, res, sql) {
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
}

async function handleVendors(req, res, sql) {
    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM vendors ORDER BY name`;
        return res.json(rows);
    }
    if (req.method === 'POST') {
        const { id, name, contact, email, gst_number } = req.body;
        if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
        const rows = await sql`INSERT INTO vendors (id, name, contact, email, gst_number)
            VALUES (${id}, ${name}, ${contact || ''}, ${email || ''}, ${gst_number || ''})
            RETURNING *`;
        return res.status(201).json(rows[0]);
    }
    if (req.method === 'PUT') {
        const { id, name, contact, email, gst_number } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const rows = await sql`UPDATE vendors SET
            name = COALESCE(${name}, name),
            contact = COALESCE(${contact}, contact),
            email = COALESCE(${email}, email),
            gst_number = COALESCE(${gst_number}, gst_number)
            WHERE id = ${id} RETURNING *`;
        if (rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
        return res.json(rows[0]);
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        await sql`DELETE FROM vendors WHERE id = ${id}`;
        return res.json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}

async function handleDepartments(req, res, sql) {
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
}
