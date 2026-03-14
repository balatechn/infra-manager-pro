import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const assets = await prisma.assets.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(assets);
  } catch (error) {
    console.error("Assets GET error:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const asset = await prisma.assets.create({
      data: {
        id: body.id,
        name: body.name,
        category: body.category || null,
        location: body.location || null,
        status: body.status || "In Warehouse",
        project: body.project || null,
        serial_number: body.serial_number || null,
        purchase_date: body.purchase_date ? new Date(body.purchase_date) : null,
      },
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Assets POST error:", error);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.location !== undefined) data.location = body.location;
    if (body.project !== undefined) data.project = body.project;

    const asset = await prisma.assets.update({ where: { id: body.id }, data });
    return NextResponse.json(asset);
  } catch (error) {
    console.error("Assets PUT error:", error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}
