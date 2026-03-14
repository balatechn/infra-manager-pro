import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function mapLedger(r: Record<string, unknown>) {
  return {
    id: r.id, projectId: r.project_id ?? "", vendorName: r.vendor_name ?? "", invoiceNumber: r.invoice_number ?? "",
    invoiceDate: r.invoice_date ? String(r.invoice_date) : "", description: r.description ?? "",
    invoiceAmount: Number(r.invoice_amount ?? 0), gstAmount: Number(r.gst_amount ?? 0), totalAmount: Number(r.total_amount ?? 0),
    billReceivedDate: r.bill_received_date ? String(r.bill_received_date) : "",
    paymentDueDate: r.payment_due_date ? String(r.payment_due_date) : "",
    paymentStatus: r.payment_status ?? "Pending", paymentDate: r.payment_date ? String(r.payment_date) : "",
    paymentMode: r.payment_mode ?? "",
  };
}

function mapAccrual(r: Record<string, unknown>) {
  return {
    id: r.id, projectId: r.project_id ?? "", month: r.month ?? "", department: r.department ?? "",
    costCategory: r.cost_category ?? "", budgetAmount: Number(r.budget_amount ?? 0),
    actualAccrual: Number(r.actual_accrual ?? 0), variance: Number(r.variance ?? 0), notes: r.notes ?? "",
  };
}

function mapBill(r: Record<string, unknown>) {
  return {
    id: r.id, vendorName: r.vendor_name ?? "", projectId: r.project_id ?? "", invoiceNumber: r.invoice_number ?? "",
    invoiceDate: r.invoice_date ? String(r.invoice_date) : "", amount: Number(r.amount ?? 0),
    department: r.department ?? "", approvalStatus: r.approval_status ?? "", approvedBy: r.approved_by ?? "",
    paymentStatus: r.payment_status ?? "", dueDate: r.due_date ? String(r.due_date) : "",
  };
}

function mapPayment(r: Record<string, unknown>) {
  return {
    id: r.id, vendorName: r.vendor_name ?? "", invoiceNumber: r.invoice_number ?? "",
    paymentAmount: Number(r.payment_amount ?? 0), paymentDate: r.payment_date ? String(r.payment_date) : "",
    paymentMode: r.payment_mode ?? "", referenceNumber: r.reference_number ?? "",
    projectId: r.project_id ?? "", remarks: r.remarks ?? "", status: r.status ?? "",
  };
}

function mapVendor(r: Record<string, unknown>) {
  return { id: r.id, name: r.name ?? "", contact: r.contact ?? "", email: r.email ?? "", gstNumber: r.gst_number ?? "" };
}

function mapDepartment(r: Record<string, unknown>) {
  return { id: r.id, name: r.name ?? "" };
}

function snakeCaseBody(body: Record<string, unknown>, entity: string) {
  switch (entity) {
    case "billing-ledger":
      return {
        project_id: body.projectId ?? body.project_id, vendor_name: body.vendorName ?? body.vendor_name,
        invoice_number: body.invoiceNumber ?? body.invoice_number, invoice_date: body.invoiceDate ? new Date(body.invoiceDate as string) : (body.invoice_date ? new Date(body.invoice_date as string) : null),
        description: body.description, invoice_amount: Number(body.invoiceAmount ?? body.invoice_amount ?? 0),
        gst_amount: Number(body.gstAmount ?? body.gst_amount ?? 0), total_amount: Number(body.totalAmount ?? body.total_amount ?? 0),
        bill_received_date: body.billReceivedDate ? new Date(body.billReceivedDate as string) : (body.bill_received_date ? new Date(body.bill_received_date as string) : null),
        payment_due_date: body.paymentDueDate ? new Date(body.paymentDueDate as string) : (body.payment_due_date ? new Date(body.payment_due_date as string) : null),
        payment_status: body.paymentStatus ?? body.payment_status, payment_date: body.paymentDate ? new Date(body.paymentDate as string) : (body.payment_date ? new Date(body.payment_date as string) : null),
        payment_mode: body.paymentMode ?? body.payment_mode,
      };
    case "accrual-budget":
      return {
        project_id: body.projectId ?? body.project_id, month: body.month, department: body.department,
        cost_category: body.costCategory ?? body.cost_category, budget_amount: Number(body.budgetAmount ?? body.budget_amount ?? 0),
        actual_accrual: Number(body.actualAccrual ?? body.actual_accrual ?? 0), variance: Number(body.variance ?? 0), notes: body.notes,
      };
    case "bills-received":
      return {
        vendor_name: body.vendorName ?? body.vendor_name, project_id: body.projectId ?? body.project_id,
        invoice_number: body.invoiceNumber ?? body.invoice_number, invoice_date: body.invoiceDate ? new Date(body.invoiceDate as string) : (body.invoice_date ? new Date(body.invoice_date as string) : null),
        amount: Number(body.amount ?? 0), department: body.department, approval_status: body.approvalStatus ?? body.approval_status,
        approved_by: body.approvedBy ?? body.approved_by, payment_status: body.paymentStatus ?? body.payment_status,
        due_date: body.dueDate ? new Date(body.dueDate as string) : (body.due_date ? new Date(body.due_date as string) : null),
      };
    case "payments":
      return {
        vendor_name: body.vendorName ?? body.vendor_name, invoice_number: body.invoiceNumber ?? body.invoice_number,
        payment_amount: Number(body.paymentAmount ?? body.payment_amount ?? 0),
        payment_date: body.paymentDate ? new Date(body.paymentDate as string) : (body.payment_date ? new Date(body.payment_date as string) : null),
        payment_mode: body.paymentMode ?? body.payment_mode, reference_number: body.referenceNumber ?? body.reference_number,
        project_id: body.projectId ?? body.project_id, remarks: body.remarks, status: body.status,
      };
    case "vendors":
      return { name: body.name, contact: body.contact, email: body.email, gst_number: body.gstNumber ?? body.gst_number };
    case "departments":
      return { name: body.name };
    default:
      return body;
  }
}

// Consolidated finance API: ?entity=billing-ledger|accrual-budget|bills-received|payments|vendors|departments
export async function GET(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  try {
    switch (entity) {
      case "billing-ledger": {
        const rows = await prisma.billing_ledger.findMany({ orderBy: { created_at: "desc" } });
        return NextResponse.json(rows.map(r => mapLedger(r as unknown as Record<string, unknown>)));
      }
      case "accrual-budget": {
        const rows = await prisma.accrual_budget.findMany({ orderBy: { created_at: "desc" } });
        return NextResponse.json(rows.map(r => mapAccrual(r as unknown as Record<string, unknown>)));
      }
      case "bills-received": {
        const rows = await prisma.bills_received.findMany({ orderBy: { created_at: "desc" } });
        return NextResponse.json(rows.map(r => mapBill(r as unknown as Record<string, unknown>)));
      }
      case "payments": {
        const rows = await prisma.payments.findMany({ orderBy: { created_at: "desc" } });
        return NextResponse.json(rows.map(r => mapPayment(r as unknown as Record<string, unknown>)));
      }
      case "vendors": {
        const rows = await prisma.vendors.findMany({ orderBy: { name: "asc" } });
        return NextResponse.json(rows.map(r => mapVendor(r as unknown as Record<string, unknown>)));
      }
      case "departments": {
        const rows = await prisma.departments.findMany({ orderBy: { name: "asc" } });
        return NextResponse.json(rows.map(r => mapDepartment(r as unknown as Record<string, unknown>)));
      }
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
    const data = snakeCaseBody(body, entity || "");
    let result;
    switch (entity) {
      case "billing-ledger":
        result = await prisma.billing_ledger.create({ data: data as Parameters<typeof prisma.billing_ledger.create>[0]["data"] });
        break;
      case "accrual-budget":
        result = await prisma.accrual_budget.create({ data: data as Parameters<typeof prisma.accrual_budget.create>[0]["data"] });
        break;
      case "bills-received":
        result = await prisma.bills_received.create({ data: data as Parameters<typeof prisma.bills_received.create>[0]["data"] });
        break;
      case "payments":
        result = await prisma.payments.create({ data: data as Parameters<typeof prisma.payments.create>[0]["data"] });
        break;
      case "vendors":
        result = await prisma.vendors.create({ data: data as Parameters<typeof prisma.vendors.create>[0]["data"] });
        break;
      case "departments":
        result = await prisma.departments.create({ data: data as Parameters<typeof prisma.departments.create>[0]["data"] });
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
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const data = snakeCaseBody(rest, entity || "");

    let result;
    switch (entity) {
      case "billing-ledger":
        result = await prisma.billing_ledger.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.billing_ledger.update>[0]["data"] });
        break;
      case "accrual-budget":
        result = await prisma.accrual_budget.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.accrual_budget.update>[0]["data"] });
        break;
      case "bills-received":
        result = await prisma.bills_received.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.bills_received.update>[0]["data"] });
        break;
      case "payments":
        result = await prisma.payments.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.payments.update>[0]["data"] });
        break;
      case "vendors":
        result = await prisma.vendors.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.vendors.update>[0]["data"] });
        break;
      case "departments":
        result = await prisma.departments.update({ where: { id: Number(id) }, data: data as Parameters<typeof prisma.departments.update>[0]["data"] });
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
