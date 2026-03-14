const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jU1CZloi7IJW@ep-tiny-leaf-a8upnziq-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

(async () => {
  try {
    // 1. Vendors lookup table
    await sql`CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT DEFAULT '',
      email TEXT DEFAULT '',
      gst_number TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('vendors table created');

    // 2. Departments lookup table
    await sql`CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('departments table created');

    // 3. Billing Ledger
    await sql`CREATE TABLE IF NOT EXISTS billing_ledger (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      vendor_name TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      invoice_date DATE,
      description TEXT DEFAULT '',
      invoice_amount NUMERIC(14,2) DEFAULT 0,
      gst_amount NUMERIC(14,2) DEFAULT 0,
      total_amount NUMERIC(14,2) DEFAULT 0,
      bill_received_date DATE,
      payment_due_date DATE,
      payment_status TEXT DEFAULT 'Pending',
      payment_date DATE,
      payment_mode TEXT DEFAULT '',
      attachment_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('billing_ledger table created');

    // 4. Accrual Budget
    await sql`CREATE TABLE IF NOT EXISTS accrual_budget (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      month TEXT NOT NULL,
      department TEXT DEFAULT '',
      cost_category TEXT DEFAULT 'Misc',
      budget_amount NUMERIC(14,2) DEFAULT 0,
      actual_accrual NUMERIC(14,2) DEFAULT 0,
      variance NUMERIC(14,2) DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('accrual_budget table created');

    // 5. Bills Received
    await sql`CREATE TABLE IF NOT EXISTS bills_received (
      id TEXT PRIMARY KEY,
      vendor_name TEXT NOT NULL,
      project_id TEXT,
      invoice_number TEXT NOT NULL,
      invoice_date DATE,
      amount NUMERIC(14,2) DEFAULT 0,
      department TEXT DEFAULT '',
      approval_status TEXT DEFAULT 'Pending',
      approved_by TEXT DEFAULT '',
      payment_status TEXT DEFAULT 'Unpaid',
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('bills_received table created');

    // 6. Payments
    await sql`CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      vendor_name TEXT NOT NULL,
      invoice_number TEXT DEFAULT '',
      payment_amount NUMERIC(14,2) DEFAULT 0,
      payment_date DATE,
      payment_mode TEXT DEFAULT '',
      reference_number TEXT DEFAULT '',
      project_id TEXT,
      remarks TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    console.log('payments table created');

    // Seed vendors
    await sql`INSERT INTO vendors (id, name, contact, email, gst_number)
      VALUES
        ('V001', 'NetGear Solutions', '9876543210', 'sales@netgear.in', '29AABCN1234A1Z5'),
        ('V002', 'Cisco India Pvt Ltd', '9123456789', 'orders@cisco.in', '27AABCC5678B2Y4'),
        ('V003', 'HP Enterprise', '9988776655', 'billing@hpe.in', '06AABHP9012C3X3'),
        ('V004', 'Schneider Electric', '9876123456', 'invoice@schneider.in', '33AABSE3456D4W2'),
        ('V005', 'APC Power Systems', '9654321098', 'accounts@apc.in', '29AABAP7890E5V1')
      ON CONFLICT (id) DO NOTHING`;
    console.log('vendors seeded');

    // Seed departments
    await sql`INSERT INTO departments (id, name)
      VALUES
        ('D001', 'Infrastructure'),
        ('D002', 'Networking'),
        ('D003', 'Software'),
        ('D004', 'Operations'),
        ('D005', 'Finance')
      ON CONFLICT (id) DO NOTHING`;
    console.log('departments seeded');

    // Seed billing ledger
    await sql`INSERT INTO billing_ledger (id, project_id, vendor_name, invoice_number, invoice_date, description, invoice_amount, gst_amount, total_amount, bill_received_date, payment_due_date, payment_status, payment_date, payment_mode)
      VALUES
        ('BL001', 'PRJ001', 'NetGear Solutions', 'INV-2026-001', '2026-01-15', 'Network switches 48-port x10', 450000, 81000, 531000, '2026-01-18', '2026-02-15', 'Paid', '2026-02-10', 'NEFT'),
        ('BL002', 'PRJ001', 'Cisco India Pvt Ltd', 'INV-2026-012', '2026-02-05', 'Core routers and firewalls', 1200000, 216000, 1416000, '2026-02-08', '2026-03-05', 'Approved', NULL, ''),
        ('BL003', 'PRJ002', 'HP Enterprise', 'INV-2026-034', '2026-02-20', 'POS terminals x15', 375000, 67500, 442500, '2026-02-22', '2026-03-20', 'Pending', NULL, ''),
        ('BL004', 'PRJ003', 'Schneider Electric', 'INV-2026-045', '2026-01-28', 'UPS systems and power panels', 680000, 122400, 802400, '2026-01-30', '2026-02-28', 'Paid', '2026-02-25', 'RTGS'),
        ('BL005', 'PRJ001', 'APC Power Systems', 'INV-2026-056', '2026-03-01', 'Rack-mount PDUs x20', 240000, 43200, 283200, '2026-03-03', '2026-03-31', 'Pending', NULL, ''),
        ('BL006', 'PRJ004', 'NetGear Solutions', 'INV-2026-067', '2026-03-10', 'Access points and controllers', 185000, 33300, 218300, '2026-03-12', '2026-04-10', 'Pending', NULL, '')
      ON CONFLICT (id) DO NOTHING`;
    console.log('billing_ledger seeded');

    // Seed accrual budget
    await sql`INSERT INTO accrual_budget (id, project_id, month, department, cost_category, budget_amount, actual_accrual, variance, notes)
      VALUES
        ('AC001', 'PRJ001', '2026-01', 'Infrastructure', 'Infra', 800000, 750000, 50000, 'Under budget - delayed materials'),
        ('AC002', 'PRJ001', '2026-02', 'Infrastructure', 'Vendor', 1500000, 1620000, -120000, 'Over budget - rush delivery charges'),
        ('AC003', 'PRJ001', '2026-03', 'Networking', 'Infra', 600000, 420000, 180000, 'In progress - partial delivery'),
        ('AC004', 'PRJ002', '2026-01', 'Networking', 'Vendor', 400000, 380000, 20000, 'On track'),
        ('AC005', 'PRJ002', '2026-02', 'Operations', 'Software', 300000, 310000, -10000, 'License cost increase'),
        ('AC006', 'PRJ003', '2026-01', 'Infrastructure', 'Infra', 500000, 480000, 20000, 'On track'),
        ('AC007', 'PRJ003', '2026-02', 'Operations', 'Misc', 200000, 220000, -20000, 'Additional labor cost'),
        ('AC008', 'PRJ004', '2026-02', 'Software', 'Software', 350000, 340000, 10000, 'On track')
      ON CONFLICT (id) DO NOTHING`;
    console.log('accrual_budget seeded');

    // Seed bills received
    await sql`INSERT INTO bills_received (id, vendor_name, project_id, invoice_number, invoice_date, amount, department, approval_status, approved_by, payment_status, due_date)
      VALUES
        ('BR001', 'NetGear Solutions', 'PRJ001', 'INV-2026-001', '2026-01-15', 531000, 'Infrastructure', 'Approved', 'Arun Kumar', 'Paid', '2026-02-15'),
        ('BR002', 'Cisco India Pvt Ltd', 'PRJ001', 'INV-2026-012', '2026-02-05', 1416000, 'Networking', 'Approved', 'Arun Kumar', 'Processing', '2026-03-05'),
        ('BR003', 'HP Enterprise', 'PRJ002', 'INV-2026-034', '2026-02-20', 442500, 'Operations', 'Verified', '', 'Unpaid', '2026-03-20'),
        ('BR004', 'Schneider Electric', 'PRJ003', 'INV-2026-045', '2026-01-28', 802400, 'Infrastructure', 'Approved', 'Vikas Nair', 'Paid', '2026-02-28'),
        ('BR005', 'APC Power Systems', 'PRJ001', 'INV-2026-056', '2026-03-01', 283200, 'Infrastructure', 'Pending', '', 'Unpaid', '2026-03-31'),
        ('BR006', 'NetGear Solutions', 'PRJ004', 'INV-2026-067', '2026-03-10', 218300, 'Networking', 'Pending', '', 'Unpaid', '2026-04-10')
      ON CONFLICT (id) DO NOTHING`;
    console.log('bills_received seeded');

    // Seed payments
    await sql`INSERT INTO payments (id, vendor_name, invoice_number, payment_amount, payment_date, payment_mode, reference_number, project_id, remarks, status)
      VALUES
        ('PAY001', 'NetGear Solutions', 'INV-2026-001', 531000, '2026-02-10', 'NEFT', 'NEFT-20260210-001', 'PRJ001', 'Full payment', 'Paid'),
        ('PAY002', 'Schneider Electric', 'INV-2026-045', 802400, '2026-02-25', 'RTGS', 'RTGS-20260225-001', 'PRJ003', 'Full payment', 'Paid'),
        ('PAY003', 'Cisco India Pvt Ltd', 'INV-2026-012', 1416000, NULL, 'NEFT', '', 'PRJ001', 'Awaiting processing', 'Processing'),
        ('PAY004', 'HP Enterprise', 'INV-2026-034', 442500, NULL, '', '', 'PRJ002', 'Pending approval', 'Pending')
      ON CONFLICT (id) DO NOTHING`;
    console.log('payments seeded');

    console.log('\nAll finance tables created and seeded successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
