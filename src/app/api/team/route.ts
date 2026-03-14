import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const team = await prisma.team_members.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(team);
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const member = await prisma.team_members.create({
      data: {
        name: body.name,
        role: body.role || null,
        avatar: body.avatar || "bg-1",
        initials: body.initials || null,
        tasks_count: body.tasks_count || 0,
        completed_count: body.completed_count || 0,
        load: body.load || "Low",
        projects: body.projects || [],
        skills: body.skills || [],
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 });
  }
}
