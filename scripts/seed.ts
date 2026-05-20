import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import postgres from "postgres";

function loadEnvFile(fileName: string) {
  const filePath = join(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const users = [
  {
    name: "Admin Maidev",
    email: "admin@maidev.test",
    phone: "+62 812-0000-0001",
    role: "admin",
  },
  {
    name: "Kurir Satu",
    email: "kurir@maidev.test",
    phone: "+62 812-0000-0002",
    role: "courier",
  },
  {
    name: "Kurir Dua",
    email: "kurir2@maidev.test",
    phone: "+62 812-0000-0003",
    role: "courier",
  },
  {
    name: "Customer Satu",
    email: "customer@maidev.test",
    phone: "+62 812-0000-0004",
    role: "customer",
  },
  {
    name: "Customer Dua",
    email: "customer2@maidev.test",
    phone: "+62 812-0000-0005",
    role: "customer",
  },
] as const;

const shipments = [
  ["CKL-2026-0128", "Toko Sinar Jaya", "Semarang", "dalam_perjalanan"],
  ["CKL-2026-0127", "UMKM Makmur", "Solo", "diambil_kurir"],
  ["CKL-2026-0126", "Toko Berkah", "Yogyakarta", "selesai"],
  ["CKL-2026-0125", "CV Maju Bersama", "Klaten", "gagal"],
  ["CKL-2026-0124", "Toko Utama", "Magelang", "menunggu_pickup"],
  ["CKL-2026-0123", "Warung Lestari", "Bandung", "selesai"],
] as const;

async function main() {
  const schema = readFileSync(join(process.cwd(), "src/lib/schema.sql"), "utf8");
  await sql.unsafe(schema);

  const passwordHash = await bcrypt.hash("password123", 10);

  for (const user of users) {
    await sql`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES (${user.name}, ${user.email}, ${passwordHash}, ${user.phone}, ${user.role})
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
    `;
  }

  const [admin] = await sql<{ id: number }[]>`
    SELECT id FROM users WHERE email = 'admin@maidev.test' LIMIT 1
  `;
  const courierRows = await sql<{ id: number }[]>`
    SELECT id FROM users WHERE role = 'courier' ORDER BY id ASC
  `;
  const customerRows = await sql<{ id: number }[]>`
    SELECT id FROM users WHERE role = 'customer' ORDER BY id ASC
  `;

  for (const [index, shipment] of shipments.entries()) {
    const [trackingNumber, senderName, city, status] = shipment;
    const courier = courierRows[index % courierRows.length]?.id ?? null;
    const customer = customerRows[index % customerRows.length]?.id ?? null;

    const [row] = await sql<{ id: number }[]>`
      INSERT INTO shipments (
        tracking_number,
        sender_name,
        sender_phone,
        receiver_name,
        receiver_phone,
        pickup_address,
        destination_address,
        origin_city,
        destination_city,
        status,
        courier_id,
        customer_id,
        created_by
      )
      VALUES (
        ${trackingNumber},
        ${senderName},
        '+62 812-1111-0000',
        ${`Penerima ${index + 1}`},
        '+62 812-2222-0000',
        ${`Gudang ${senderName}, Jakarta`},
        ${`Jl. Utama No. ${index + 1}, ${city}`},
        'Jakarta',
        ${city},
        ${status},
        ${courier},
        ${customer},
        ${admin.id}
      )
      ON CONFLICT (tracking_number)
      DO UPDATE SET
        status = EXCLUDED.status,
        courier_id = EXCLUDED.courier_id,
        customer_id = EXCLUDED.customer_id,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    await sql`
      INSERT INTO shipment_logs (shipment_id, status, note, location, updated_by)
      VALUES (${row.id}, 'menunggu_pickup', 'Pengiriman dibuat', 'Jakarta', ${admin.id})
      ON CONFLICT DO NOTHING
    `;

    if (status !== "menunggu_pickup") {
      await sql`
        INSERT INTO shipment_logs (shipment_id, status, note, location, updated_by)
        VALUES (${row.id}, ${status}, 'Status seed diperbarui', ${city}, ${admin.id})
      `;
    }
  }
}

main()
  .then(async () => {
    await sql.end();
    console.log("Seed Maidev Express selesai.");
  })
  .catch(async (error) => {
    await sql.end();
    console.error(error);
    process.exit(1);
  });
