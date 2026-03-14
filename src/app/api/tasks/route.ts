import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allTasks = await prisma.tasks.findMany({ orderBy: { sort_order: "asc" } });

    // Build hierarchy: parent → children → grandchildren
    const taskMap = new Map<string, Record<string, unknown>>();
    allTasks.forEach((t) => {
      taskMap.set(t.id, { ...t, children: [] });
    });

    const roots: Record<string, unknown>[] = [];
    allTasks.forEach((t) => {
      const mapped = taskMap.get(t.id)!;
      if (t.parent_id && taskMap.has(t.parent_id)) {
        const parent = taskMap.get(t.parent_id)!;
        (parent.children as Record<string, unknown>[]).push(mapped);
      } else {
        roots.push(mapped);
      }
    });

    return NextResponse.json(roots);
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = await prisma.tasks.create({
      data: {
        id: body.id,
        project_id: body.project_id || null,
        parent_id: body.parent_id || null,
        name: body.name,
        assigned_to: body.assigned_to || null,
        start_date: body.start_date ? new Date(body.start_date) : null,
        end_date: body.end_date ? new Date(body.end_date) : null,
        duration: body.duration || null,
        dependency: body.dependency || null,
        progress: body.progress || 0,
        status: body.status || "Planned",
        priority: body.priority || "Medium",
        sort_order: body.sort_order || 0,
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.assigned_to !== undefined) data.assigned_to = body.assigned_to;
    if (body.start_date !== undefined) data.start_date = body.start_date ? new Date(body.start_date) : null;
    if (body.end_date !== undefined) data.end_date = body.end_date ? new Date(body.end_date) : null;
    if (body.duration !== undefined) data.duration = body.duration;
    if (body.dependency !== undefined) data.dependency = body.dependency;
    if (body.progress !== undefined) data.progress = body.progress;
    if (body.status !== undefined) data.status = body.status;
    if (body.priority !== undefined) data.priority = body.priority;

    const task = await prisma.tasks.update({ where: { id: body.id }, data });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Tasks PUT error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    await prisma.tasks.deleteMany({ where: { OR: [{ id }, { parent_id: id }] } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tasks DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
