const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

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
};
