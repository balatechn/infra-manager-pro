import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [projects, allTasks, teamMembers, activities] = await Promise.all([
      prisma.projects.findMany({ include: { milestones: { orderBy: { sort_order: "asc" } } }, orderBy: { start_date: "desc" } }),
      prisma.tasks.findMany(),
      prisma.team_members.findMany(),
      prisma.activities.findMany({ orderBy: { created_at: "desc" }, take: 8 }),
    ]);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "Completed").length;
    const inProgressTasks = allTasks.filter((t) => t.status === "In Progress").length;
    const overdueTasks = allTasks.filter((t) => t.end_date && new Date(t.end_date) < new Date() && t.status !== "Completed").length;

    const totalBudget = projects.reduce((s, p) => s + Number(p.budget || 0), 0);
    const usedBudget = projects.reduce((s, p) => s + Number(p.budget_used || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0;

    return NextResponse.json({
      stats: {
        activeProjects: projects.filter((p) => p.status === "Active").length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        teamMembers: teamMembers.length,
        budgetUtilization,
      },
      projects,
      activities,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
