import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.kanban_tasks.findMany({ orderBy: { due_date: "asc" } });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Kanban GET error:", error);
    return NextResponse.json({ error: "Failed to fetch kanban tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = await prisma.kanban_tasks.create({
      data: {
        id: body.id,
        title: body.title,
        project: body.project || null,
        priority: body.priority || "Medium",
        assignee: body.assignee || null,
        due_date: body.due_date ? new Date(body.due_date) : null,
        tags: body.tags || [],
        column_status: body.column_status || "backlog",
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Kanban POST error:", error);
    return NextResponse.json({ error: "Failed to create kanban task" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (body.column_status !== undefined) data.column_status = body.column_status;
    if (body.title !== undefined) data.title = body.title;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.assignee !== undefined) data.assignee = body.assignee;

    const task = await prisma.kanban_tasks.update({ where: { id: body.id }, data });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Kanban PUT error:", error);
    return NextResponse.json({ error: "Failed to update kanban task" }, { status: 500 });
  }
}
