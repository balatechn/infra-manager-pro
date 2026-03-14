import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
        include: { role: true },
      });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({
        ...user,
        role_name: user.role?.name,
        role_color: user.role?.color,
      });
    }
    const users = await prisma.users.findMany({
      include: { role: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      users.map((u) => ({
        ...u,
        role_name: u.role?.name,
        role_color: u.role?.color,
      }))
    );
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        initials: body.initials || null,
        avatar: body.avatar || "bg-1",
        role_id: body.role_id ? Number(body.role_id) : null,
        status: body.status || "Active",
        department: body.department || null,
        phone: body.phone || null,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Users POST error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email;
    if (body.role_id !== undefined) data.role_id = body.role_id ? Number(body.role_id) : null;
    if (body.status !== undefined) data.status = body.status;
    if (body.department !== undefined) data.department = body.department;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.avatar !== undefined) data.avatar = body.avatar;

    const user = await prisma.users.update({ where: { id: Number(body.id) }, data });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Users PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    await prisma.users.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
