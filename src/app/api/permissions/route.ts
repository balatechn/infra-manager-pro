import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const permissions = await prisma.permissions.findMany({ orderBy: { module: "asc" } });
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((p) => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    return NextResponse.json({ permissions, grouped });
  } catch (error) {
    console.error("Permissions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}
