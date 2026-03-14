import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Consolidated finance API: ?entity=billing-ledger|accrual-budget|bills-received|payments|vendors|departments
export async function GET(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  try {
    switch (entity) {
      case "billing-ledger":
        return NextResponse.json(await prisma.billing_ledger.findMany({ orderBy: { created_at: "desc" } }));
      case "accrual-budget":
        return NextResponse.json(await prisma.accrual_budget.findMany({ orderBy: { created_at: "desc" } }));
      case "bills-received":
        return NextResponse.json(await prisma.bills_received.findMany({ orderBy: { created_at: "desc" } }));
      case "payments":
        return NextResponse.json(await prisma.payments.findMany({ orderBy: { created_at: "desc" } }));
      case "vendors":
        return NextResponse.json(await prisma.vendors.findMany({ orderBy: { name: "asc" } }));
      case "departments":
        return NextResponse.json(await prisma.departments.findMany({ orderBy: { name: "asc" } }));
      default:
        return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }
  } catch (error) {
    console.error("Finance GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  try {
    const body = await req.json();
    let result;
    switch (entity) {
      case "billing-ledger":
        result = await prisma.billing_ledger.create({ data: body });
        break;
      case "accrual-budget":
        result = await prisma.accrual_budget.create({ data: body });
        break;
      case "bills-received":
        result = await prisma.bills_received.create({ data: body });
        break;
      case "payments":
        result = await prisma.payments.create({ data: body });
        break;
      case "vendors":
        result = await prisma.vendors.create({ data: body });
        break;
      case "departments":
        result = await prisma.departments.create({ data: body });
        break;
      default:
        return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Finance POST error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    let result;
    switch (entity) {
      case "billing-ledger":
        result = await prisma.billing_ledger.update({ where: { id: Number(id) }, data });
        break;
      case "accrual-budget":
        result = await prisma.accrual_budget.update({ where: { id: Number(id) }, data });
        break;
      case "bills-received":
        result = await prisma.bills_received.update({ where: { id: Number(id) }, data });
        break;
      case "payments":
        result = await prisma.payments.update({ where: { id: Number(id) }, data });
        break;
      case "vendors":
        result = await prisma.vendors.update({ where: { id: Number(id) }, data });
        break;
      case "departments":
        result = await prisma.departments.update({ where: { id: Number(id) }, data });
        break;
      default:
        return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Finance PUT error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    switch (entity) {
      case "billing-ledger":
        await prisma.billing_ledger.delete({ where: { id: Number(id) } });
        break;
      case "accrual-budget":
        await prisma.accrual_budget.delete({ where: { id: Number(id) } });
        break;
      case "bills-received":
        await prisma.bills_received.delete({ where: { id: Number(id) } });
        break;
      case "payments":
        await prisma.payments.delete({ where: { id: Number(id) } });
        break;
      case "vendors":
        await prisma.vendors.delete({ where: { id: Number(id) } });
        break;
      case "departments":
        await prisma.departments.delete({ where: { id: Number(id) } });
        break;
      default:
        return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Finance DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
