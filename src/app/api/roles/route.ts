import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      const role = await prisma.roles.findUnique({
        where: { id: Number(id) },
        include: { role_permissions: { include: { permission: true } }, users: true },
      });
      if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
      return NextResponse.json({
        ...role,
        permissions: role.role_permissions.map((rp) => rp.permission_id),
        user_count: role.users.length,
      });
    }
    const roles = await prisma.roles.findMany({
      include: { _count: { select: { role_permissions: true, users: true } } },
    });
    return NextResponse.json(
      roles.map((r) => ({
        ...r,
        permission_count: r._count.role_permissions,
        user_count: r._count.users,
      }))
    );
  } catch (error) {
    console.error("Roles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role = await prisma.roles.create({
      data: {
        name: body.name,
        description: body.description || null,
        color: body.color || "#2563EB",
        role_permissions: body.permissions?.length
          ? { create: body.permissions.map((pid: number) => ({ permission_id: pid })) }
          : undefined,
      },
    });
    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.error("Roles POST error:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    // Update role basic info
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.color !== undefined) data.color = body.color;

    const role = await prisma.roles.update({ where: { id: Number(body.id) }, data });

    // Replace permissions if provided
    if (body.permissions) {
      await prisma.role_permissions.deleteMany({ where: { role_id: Number(body.id) } });
      if (body.permissions.length > 0) {
        await prisma.role_permissions.createMany({
          data: body.permissions.map((pid: number) => ({
            role_id: Number(body.id),
            permission_id: pid,
          })),
        });
      }
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Roles PUT error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    const role = await prisma.roles.findUnique({ where: { id: Number(id) } });
    if (role?.is_system) return NextResponse.json({ error: "Cannot delete system role" }, { status: 403 });
    await prisma.roles.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Roles DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
