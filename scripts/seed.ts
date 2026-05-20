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

  const kotaRows = await Promise.all(
    [
      ["KT-JKT", "Jakarta", "DKI Jakarta", "10110"],
      ["KT-SMG", "Semarang", "Jawa Tengah", "50111"],
      ["KT-SLO", "Solo", "Jawa Tengah", "57111"],
      ["KT-YGY", "Yogyakarta", "DI Yogyakarta", "55111"],
      ["KT-BDG", "Bandung", "Jawa Barat", "40111"],
    ].map(([kode, nama, provinsi, kodePos]) => sql<{ id: number }[]>`
      INSERT INTO kota (kode_kota, nama_kota, provinsi, kode_pos)
      VALUES (${kode}, ${nama}, ${provinsi}, ${kodePos})
      ON CONFLICT (kode_kota)
      DO UPDATE SET
        nama_kota = EXCLUDED.nama_kota,
        provinsi = EXCLUDED.provinsi,
        kode_pos = EXCLUDED.kode_pos,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  const jenisRows = await Promise.all(
    [
      ["JNS-REG", "Reguler", "Pengiriman standar antar kota", 3],
      ["JNS-EXP", "Express", "Pengiriman prioritas lebih cepat", 1],
      ["JNS-CGO", "Cargo Besar", "Layanan barang besar dan berat", 5],
    ].map(([kode, nama, deskripsi, estimasi]) => sql<{ id: number }[]>`
      INSERT INTO jenis_pengiriman (kode_jenis, nama_jenis, deskripsi, estimasi_hari)
      VALUES (${kode}, ${nama}, ${deskripsi}, ${estimasi})
      ON CONFLICT (kode_jenis)
      DO UPDATE SET
        nama_jenis = EXCLUDED.nama_jenis,
        deskripsi = EXCLUDED.deskripsi,
        estimasi_hari = EXCLUDED.estimasi_hari,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  const kendaraanRows = await Promise.all(
    [
      ["KDR-001", "B 1234 MEX", "Truk Box", "Mitsubishi", "Colt Diesel", 2500, 18],
      ["KDR-002", "B 5678 MEX", "Pickup", "Daihatsu", "Gran Max", 900, 6],
    ].map(([kode, polisi, jenis, merek, model, kg, volume]) => sql<{ id: number }[]>`
      INSERT INTO kendaraan (
        kode_kendaraan,
        no_polisi,
        jenis_kendaraan,
        merek,
        model,
        kapasitas_kg,
        kapasitas_volume
      )
      VALUES (${kode}, ${polisi}, ${jenis}, ${merek}, ${model}, ${kg}, ${volume})
      ON CONFLICT (kode_kendaraan)
      DO UPDATE SET
        no_polisi = EXCLUDED.no_polisi,
        jenis_kendaraan = EXCLUDED.jenis_kendaraan,
        merek = EXCLUDED.merek,
        model = EXCLUDED.model,
        kapasitas_kg = EXCLUDED.kapasitas_kg,
        kapasitas_volume = EXCLUDED.kapasitas_volume,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  const barangRows = await Promise.all(
    [
      ["BRG-001", "Paket Fashion", "Retail", "Pakaian dan aksesoris", 2, false],
      ["BRG-002", "Produk Keramik", "Pecah Belah", "Barang mudah pecah", 5, true],
      ["BRG-003", "Bahan Makanan Kering", "F&B", "Produk UMKM tahan lama", 8, false],
    ].map(([kode, nama, kategori, deskripsi, berat, pecah]) => sql<{ id: number }[]>`
      INSERT INTO barang (
        kode_barang,
        nama_barang,
        kategori,
        deskripsi,
        berat_default_kg,
        mudah_pecah
      )
      VALUES (${kode}, ${nama}, ${kategori}, ${deskripsi}, ${berat}, ${pecah})
      ON CONFLICT (kode_barang)
      DO UPDATE SET
        nama_barang = EXCLUDED.nama_barang,
        kategori = EXCLUDED.kategori,
        deskripsi = EXCLUDED.deskripsi,
        berat_default_kg = EXCLUDED.berat_default_kg,
        mudah_pecah = EXCLUDED.mudah_pecah,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  const pelangganRows = await Promise.all(
    [
      ["PLG-001", customerRows[0]?.id ?? null, "Toko Sinar Jaya", "Budi Santoso"],
      ["PLG-002", customerRows[1]?.id ?? null, "UMKM Makmur", "Siti Aminah"],
    ].map(([kode, penggunaId, perusahaan, kontak], index) => sql<{ id: number }[]>`
      INSERT INTO pelanggan (
        pengguna_id,
        kota_id,
        kode_pelanggan,
        nama_perusahaan,
        nama_kontak,
        telepon,
        email,
        alamat
      )
      VALUES (
        ${penggunaId},
        ${kotaRows[index + 1]?.id ?? kotaRows[0]?.id},
        ${kode},
        ${perusahaan},
        ${kontak},
        '+62 812-3333-0000',
        ${index === 0 ? "customer@cargoku.test" : "customer2@cargoku.test"},
        ${`Alamat ${perusahaan}`}
      )
      ON CONFLICT (kode_pelanggan)
      DO UPDATE SET
        pengguna_id = EXCLUDED.pengguna_id,
        kota_id = EXCLUDED.kota_id,
        nama_perusahaan = EXCLUDED.nama_perusahaan,
        nama_kontak = EXCLUDED.nama_kontak,
        telepon = EXCLUDED.telepon,
        email = EXCLUDED.email,
        alamat = EXCLUDED.alamat,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  const kurirMasterRows = await Promise.all(
    [
      ["KUR-001", courierRows[0]?.id ?? null, "Kurir Satu", "SIM-A-001"],
      ["KUR-002", courierRows[1]?.id ?? null, "Kurir Dua", "SIM-A-002"],
    ].map(([kode, penggunaId, nama, sim]) => sql<{ id: number }[]>`
      INSERT INTO kurir (pengguna_id, kode_kurir, nama_kurir, telepon, no_sim, alamat)
      VALUES (${penggunaId}, ${kode}, ${nama}, '+62 812-4444-0000', ${sim}, 'Jakarta')
      ON CONFLICT (kode_kurir)
      DO UPDATE SET
        pengguna_id = EXCLUDED.pengguna_id,
        nama_kurir = EXCLUDED.nama_kurir,
        telepon = EXCLUDED.telepon,
        no_sim = EXCLUDED.no_sim,
        alamat = EXCLUDED.alamat,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
      RETURNING id
    `.then((rows) => rows[0])),
  );

  await Promise.all(
    kotaRows.slice(1, 4).map((tujuan) => sql`
      INSERT INTO tarif_pengiriman (
        kota_asal_id,
        kota_tujuan_id,
        jenis_pengiriman_id,
        harga_dasar,
        harga_per_kg,
        berat_minimum_kg
      )
      VALUES (${kotaRows[0].id}, ${tujuan.id}, ${jenisRows[0].id}, 25000, 3500, 1)
      ON CONFLICT (kota_asal_id, kota_tujuan_id, jenis_pengiriman_id)
      DO UPDATE SET
        harga_dasar = EXCLUDED.harga_dasar,
        harga_per_kg = EXCLUDED.harga_per_kg,
        berat_minimum_kg = EXCLUDED.berat_minimum_kg,
        aktif = TRUE,
        diperbarui_pada = CURRENT_TIMESTAMP
    `),
  );

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

  const [pengirimanRow] = await sql<{ id: number }[]>`
    INSERT INTO pengiriman (
      nomor_resi,
      pelanggan_id,
      kurir_id,
      kendaraan_id,
      jenis_pengiriman_id,
      kota_asal_id,
      kota_tujuan_id,
      nama_pengirim,
      telepon_pengirim,
      nama_penerima,
      telepon_penerima,
      alamat_pickup,
      alamat_tujuan,
      status,
      dibuat_oleh
    )
    VALUES (
      'MEX-2026-0001',
      ${pelangganRows[0].id},
      ${kurirMasterRows[0].id},
      ${kendaraanRows[0].id},
      ${jenisRows[0].id},
      ${kotaRows[0].id},
      ${kotaRows[1].id},
      'Toko Sinar Jaya',
      '+62 812-1111-0000',
      'Penerima Master',
      '+62 812-2222-0000',
      'Gudang Jakarta',
      'Jl. Pemuda No. 10, Semarang',
      'dalam_perjalanan',
      ${admin.id}
    )
    ON CONFLICT (nomor_resi)
    DO UPDATE SET
      pelanggan_id = EXCLUDED.pelanggan_id,
      kurir_id = EXCLUDED.kurir_id,
      kendaraan_id = EXCLUDED.kendaraan_id,
      jenis_pengiriman_id = EXCLUDED.jenis_pengiriman_id,
      kota_asal_id = EXCLUDED.kota_asal_id,
      kota_tujuan_id = EXCLUDED.kota_tujuan_id,
      status = EXCLUDED.status,
      diperbarui_pada = CURRENT_TIMESTAMP
    RETURNING id
  `;

  await sql`
    INSERT INTO detail_pengiriman (
      pengiriman_id,
      total_berat_kg,
      total_volume,
      jarak_km,
      biaya_pengiriman,
      biaya_asuransi,
      total_biaya,
      tanggal_pickup,
      estimasi_tiba,
      status_pembayaran
    )
    VALUES (${pengirimanRow.id}, 12, 1.5, 450, 67000, 5000, 72000, CURRENT_DATE, CURRENT_DATE + 3, 'belum_dibayar')
    ON CONFLICT (pengiriman_id)
    DO UPDATE SET
      total_berat_kg = EXCLUDED.total_berat_kg,
      total_volume = EXCLUDED.total_volume,
      jarak_km = EXCLUDED.jarak_km,
      biaya_pengiriman = EXCLUDED.biaya_pengiriman,
      biaya_asuransi = EXCLUDED.biaya_asuransi,
      total_biaya = EXCLUDED.total_biaya,
      tanggal_pickup = EXCLUDED.tanggal_pickup,
      estimasi_tiba = EXCLUDED.estimasi_tiba,
      status_pembayaran = EXCLUDED.status_pembayaran,
      diperbarui_pada = CURRENT_TIMESTAMP
  `;

  await Promise.all(
    barangRows.slice(0, 2).map((barang, index) => sql`
      INSERT INTO pengiriman_barang (
        pengiriman_id,
        barang_id,
        jumlah,
        berat_kg,
        panjang_cm,
        lebar_cm,
        tinggi_cm,
        catatan
      )
      VALUES (${pengirimanRow.id}, ${barang.id}, ${index + 1}, ${index === 0 ? 4 : 8}, 40, 30, 25, 'Sample barang transaksi')
      ON CONFLICT (pengiriman_id, barang_id)
      DO UPDATE SET
        jumlah = EXCLUDED.jumlah,
        berat_kg = EXCLUDED.berat_kg,
        panjang_cm = EXCLUDED.panjang_cm,
        lebar_cm = EXCLUDED.lebar_cm,
        tinggi_cm = EXCLUDED.tinggi_cm,
        catatan = EXCLUDED.catatan
    `),
  );

  await sql`
    INSERT INTO log_pengiriman (pengiriman_id, status, catatan, lokasi, diperbarui_oleh)
    VALUES (${pengirimanRow.id}, 'dalam_perjalanan', 'Sample transaksi master dibuat', 'Semarang', ${admin.id})
  `;
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
