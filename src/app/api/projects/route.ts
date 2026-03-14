import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      const project = await prisma.projects.findUnique({
        where: { id },
        include: { milestones: { orderBy: { sort_order: "asc" } } },
      });
      if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      return NextResponse.json(project);
    }
    const projects = await prisma.projects.findMany({
      include: { milestones: { orderBy: { sort_order: "asc" } } },
      orderBy: { start_date: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await prisma.projects.create({
      data: {
        id: body.id,
        name: body.name,
        client: body.client,
        location: body.location,
        region: body.region || "South",
        manager: body.manager,
        start_date: new Date(body.start_date),
        end_date: new Date(body.end_date),
        progress: body.progress || 0,
        status: body.status || "Planned",
        budget: body.budget || 0,
        budget_used: body.budget_used || 0,
        description: body.description || "",
        team: body.team || [],
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const data: Record<string, unknown> = { updated_at: new Date() };
    if (body.name !== undefined) data.name = body.name;
    if (body.client !== undefined) data.client = body.client;
    if (body.location !== undefined) data.location = body.location;
    if (body.region !== undefined) data.region = body.region;
    if (body.manager !== undefined) data.manager = body.manager;
    if (body.start_date !== undefined) data.start_date = new Date(body.start_date);
    if (body.end_date !== undefined) data.end_date = new Date(body.end_date);
    if (body.status !== undefined) data.status = body.status;
    if (body.progress !== undefined) data.progress = body.progress;
    if (body.budget !== undefined) data.budget = body.budget;
    if (body.budget_used !== undefined) data.budget_used = body.budget_used;
    if (body.description !== undefined) data.description = body.description;
    if (body.team !== undefined) data.team = body.team;

    const project = await prisma.projects.update({ where: { id: body.id }, data });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    await prisma.projects.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
