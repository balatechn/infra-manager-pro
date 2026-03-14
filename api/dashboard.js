const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
    const sql = getDb();

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Aggregate dashboard stats in parallel
    const [projects, taskStats, teamCount, activities] = await Promise.all([
        sql`SELECT id, name, progress, status, budget, budget_used FROM projects`,
        sql`SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'Completed') as completed,
            COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
            COUNT(*) FILTER (WHERE end_date < CURRENT_DATE AND status != 'Completed') as overdue
            FROM tasks`,
        sql`SELECT COUNT(*) as count FROM team_members`,
        sql`SELECT * FROM activities ORDER BY created_at DESC LIMIT 8`
    ]);

    const activeProjects = projects.filter(p => p.status !== 'Completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);
    const usedBudget = projects.reduce((sum, p) => sum + Number(p.budget_used), 0);

    return res.json({
        stats: {
            activeProjects,
            totalTasks: Number(taskStats[0].total),
            completedTasks: Number(taskStats[0].completed),
            inProgressTasks: Number(taskStats[0].in_progress),
            overdueTasks: Number(taskStats[0].overdue),
            teamMembers: Number(teamCount[0].count),
            budgetUtilization: totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0
        },
        projects,
        activities
    });
};
