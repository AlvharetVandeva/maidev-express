import { sql } from "@/lib/db";
import type { CargoShipmentFormInput } from "@/features/cargo/schema";
import type {
  CargoFormOptions,
  CargoItemStatus,
  CargoShipment,
  CargoShipmentFilters,
  CargoShipmentListResult,
  CargoTariff,
  CargoStatus,
  PaymentStatus,
} from "@/features/cargo/types";

type DecimalValue = string | number | null;

type CargoShipmentRow = {
  id: number;
  nomor_resi: string;
  pelanggan_id: number | null;
  pelanggan_label: string | null;
  kurir_id: number | null;
  kurir_label: string | null;
  kendaraan_id: number | null;
  kode_kendaraan: string | null;
  no_polisi: string | null;
  jenis_kendaraan: string | null;
  kapasitas_kg: DecimalValue;
  kendaraan_aktif: boolean | null;
  jenis_pengiriman_id: number;
  jenis_pengiriman_label: string | null;
  kota_asal_id: number;
  kota_asal_label: string | null;
  kota_tujuan_id: number;
  kota_tujuan_label: string | null;
  nama_pengirim: string;
  telepon_pengirim: string | null;
  nama_penerima: string;
  telepon_penerima: string | null;
  alamat_pickup: string;
  alamat_tujuan: string;
  status: CargoStatus;
  tanggal_kirim: string | null;
  estimasi_tiba: string | null;
  barang_id: number | null;
  nama_barang: string | null;
  semua_barang: string | null;
  jumlah_barang: number | null;
  berat_barang: DecimalValue;
  harga_pengiriman: DecimalValue;
  biaya_asuransi: DecimalValue;
  total_biaya: DecimalValue;
  status_pembayaran: PaymentStatus;
  status_barang: CargoItemStatus | null;
  catatan_barang: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
};

type OptionRow = {
  value: string;
  label: string;
};

type TariffRow = {
  kota_asal_id: number;
  kota_tujuan_id: number;
  jenis_pengiriman_id: number;
  harga_dasar: DecimalValue;
  harga_per_kg: DecimalValue;
  berat_minimum_kg: DecimalValue;
};

function toNumber(value: DecimalValue, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapTariff(row: TariffRow): CargoTariff {
  return {
    kotaAsalId: row.kota_asal_id,
    kotaTujuanId: row.kota_tujuan_id,
    jenisPengirimanId: row.jenis_pengiriman_id,
    hargaDasar: toNumber(row.harga_dasar),
    hargaPerKg: toNumber(row.harga_per_kg),
    beratMinimumKg: toNumber(row.berat_minimum_kg, 1),
  };
}

function mapCargoShipment(row: CargoShipmentRow): CargoShipment {
  return {
    id: row.id,
    nomorResi: row.nomor_resi,
    pelangganId: row.pelanggan_id,
    pelangganLabel: row.pelanggan_label ?? "Tanpa pelanggan",
    kurirId: row.kurir_id,
    kurirLabel: row.kurir_label,
    kendaraanId: row.kendaraan_id,
    kodeKendaraan: row.kode_kendaraan,
    nomorPolisi: row.no_polisi,
    jenisKendaraan: row.jenis_kendaraan,
    kapasitasKg: row.kapasitas_kg === null ? null : toNumber(row.kapasitas_kg),
    kendaraanAktif: row.kendaraan_aktif,
    jenisPengirimanId: row.jenis_pengiriman_id,
    jenisPengirimanLabel:
      row.jenis_pengiriman_label ?? `Jenis #${row.jenis_pengiriman_id}`,
    kotaAsalId: row.kota_asal_id,
    kotaAsalLabel: row.kota_asal_label ?? `Kota #${row.kota_asal_id}`,
    kotaTujuanId: row.kota_tujuan_id,
    kotaTujuanLabel: row.kota_tujuan_label ?? `Kota #${row.kota_tujuan_id}`,
    namaPengirim: row.nama_pengirim,
    teleponPengirim: row.telepon_pengirim,
    namaPenerima: row.nama_penerima,
    teleponPenerima: row.telepon_penerima,
    alamatPickup: row.alamat_pickup,
    alamatTujuan: row.alamat_tujuan,
    status: row.status,
    tanggalKirim: row.tanggal_kirim,
    estimasiTiba: row.estimasi_tiba,
    barangId: row.barang_id,
    namaBarang: row.nama_barang,
    semuaBarang: row.semua_barang,
    jumlahBarang: row.jumlah_barang ?? 1,
    beratBarang: toNumber(row.berat_barang),
    hargaPengiriman: toNumber(row.harga_pengiriman),
    biayaAsuransi: toNumber(row.biaya_asuransi),
    totalBiaya: toNumber(row.total_biaya),
    statusPembayaran: row.status_pembayaran,
    statusBarang: row.status_barang ?? "diproses",
    catatanBarang: row.catatan_barang,
    dibuatPada: row.dibuat_pada,
    diperbaruiPada: row.diperbarui_pada,
  };
}

function generateNomorResi() {
  const date = new Date();
  const year = date.getFullYear();
  const suffix = `${date.getTime()}`.slice(-6);
  const random = Math.floor(Math.random() * 90 + 10);

  return `MEX-${year}-${suffix}${random}`;
}

function baseCargoSelect() {
  return sql`
    SELECT
      p.id,
      p.nomor_resi,
      p.pelanggan_id,
      COALESCE(pl.nama_perusahaan, pl.nama_kontak, pl.kode_pelanggan) AS pelanggan_label,
      p.kurir_id,
      ku.nama_kurir AS kurir_label,
      p.kendaraan_id,
      kd.kode_kendaraan,
      kd.no_polisi,
      kd.jenis_kendaraan,
      kd.kapasitas_kg,
      kd.aktif AS kendaraan_aktif,
      p.jenis_pengiriman_id,
      jp.nama_jenis AS jenis_pengiriman_label,
      p.kota_asal_id,
      asal.nama_kota || ', ' || asal.provinsi AS kota_asal_label,
      p.kota_tujuan_id,
      tujuan.nama_kota || ', ' || tujuan.provinsi AS kota_tujuan_label,
      p.nama_pengirim,
      p.telepon_pengirim,
      p.nama_penerima,
      p.telepon_penerima,
      p.alamat_pickup,
      p.alamat_tujuan,
      p.status,
      d.tanggal_pickup::text AS tanggal_kirim,
      d.estimasi_tiba::text AS estimasi_tiba,
      first_item.barang_id,
      b.nama_barang,
      barang_summary.semua_barang,
      first_item.jumlah AS jumlah_barang,
      COALESCE(first_item.berat_kg, d.total_berat_kg) AS berat_barang,
      d.biaya_pengiriman AS harga_pengiriman,
      d.biaya_asuransi,
      d.total_biaya,
      d.status_pembayaran,
      COALESCE(first_item.status_barang, 'diproses') AS status_barang,
      first_item.catatan AS catatan_barang,
      p.dibuat_pada::text AS dibuat_pada,
      p.diperbarui_pada::text AS diperbarui_pada
    FROM pengiriman p
    LEFT JOIN pelanggan pl ON pl.id = p.pelanggan_id
    LEFT JOIN kurir ku ON ku.id = p.kurir_id
    LEFT JOIN kendaraan kd ON kd.id = p.kendaraan_id
    JOIN jenis_pengiriman jp ON jp.id = p.jenis_pengiriman_id
    JOIN kota asal ON asal.id = p.kota_asal_id
    JOIN kota tujuan ON tujuan.id = p.kota_tujuan_id
    LEFT JOIN detail_pengiriman d ON d.pengiriman_id = p.id
    LEFT JOIN LATERAL (
      SELECT pb.*
      FROM pengiriman_barang pb
      WHERE pb.pengiriman_id = p.id
      ORDER BY pb.id ASC
      LIMIT 1
    ) first_item ON TRUE
    LEFT JOIN barang b ON b.id = first_item.barang_id
    LEFT JOIN LATERAL (
      SELECT string_agg(barang.nama_barang, ', ' ORDER BY barang.nama_barang) AS semua_barang
      FROM pengiriman_barang pb
      JOIN barang ON barang.id = pb.barang_id
      WHERE pb.pengiriman_id = p.id
    ) barang_summary ON TRUE
  `;
}

function buildCargoWhere(filters: CargoShipmentFilters) {
  const conditions = [];
  const search = filters.search?.trim();

  if (filters.status && filters.status !== "all") {
    conditions.push(sql`p.status = ${filters.status}`);
  }

  if (search) {
    const keyword = `%${search}%`;
    conditions.push(sql`(
      p.nomor_resi ILIKE ${keyword}
      OR p.nama_pengirim ILIKE ${keyword}
      OR p.nama_penerima ILIKE ${keyword}
      OR EXISTS (
        SELECT 1
        FROM pengiriman_barang pb_search
        JOIN barang b_search ON b_search.id = pb_search.barang_id
        WHERE pb_search.pengiriman_id = p.id
          AND b_search.nama_barang ILIKE ${keyword}
      )
    )`);
  }

  return conditions.length > 0
    ? conditions.reduce((left, right) => sql`${left} AND ${right}`)
    : sql`TRUE`;
}

export async function listCargoShipments(
  filters: CargoShipmentFilters = {},
): Promise<CargoShipmentListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(5, filters.pageSize ?? 10));
  const offset = (page - 1) * pageSize;
  const where = buildCargoWhere(filters);

  const [rows, counts] = await Promise.all([
    sql<CargoShipmentRow[]>`
      ${baseCargoSelect()}
      WHERE ${where}
      ORDER BY p.dibuat_pada DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `,
    sql<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM pengiriman p
      WHERE ${where}
    `,
  ]);

  return {
    shipments: rows.map(mapCargoShipment),
    total: counts[0]?.total ?? 0,
  };
}

export async function getCargoShipmentById(id: number) {
  const rows = await sql<CargoShipmentRow[]>`
    ${baseCargoSelect()}
    WHERE p.id = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapCargoShipment(rows[0]) : null;
}

export async function getCargoFormOptions(): Promise<CargoFormOptions> {
  const [
    pelanggan,
    kurir,
    kendaraan,
    jenisPengiriman,
    kota,
    barang,
    tarifPengiriman,
  ] = await Promise.all([
    sql<OptionRow[]>`
      SELECT
        id::text AS value,
        kode_pelanggan || ' - ' || COALESCE(nama_perusahaan, nama_kontak) AS label
      FROM pelanggan
      WHERE aktif = TRUE
      ORDER BY kode_pelanggan ASC
    `,
    sql<OptionRow[]>`
      SELECT
        id::text AS value,
        kode_kurir || ' - ' || nama_kurir AS label
      FROM kurir
      WHERE aktif = TRUE
      ORDER BY kode_kurir ASC
    `,
    sql<OptionRow[]>`
      SELECT
        id::text AS value,
        kode_kendaraan || ' - ' || no_polisi || ' (' || jenis_kendaraan || ')' AS label
      FROM kendaraan
      WHERE aktif = TRUE
      ORDER BY kode_kendaraan ASC
    `,
    sql<OptionRow[]>`
      SELECT id::text AS value, nama_jenis AS label
      FROM jenis_pengiriman
      WHERE aktif = TRUE
      ORDER BY nama_jenis ASC
    `,
    sql<OptionRow[]>`
      SELECT id::text AS value, nama_kota || ', ' || provinsi AS label
      FROM kota
      WHERE aktif = TRUE
      ORDER BY nama_kota ASC
    `,
    sql<OptionRow[]>`
      SELECT id::text AS value, kode_barang || ' - ' || nama_barang AS label
      FROM barang
      WHERE aktif = TRUE
      ORDER BY kode_barang ASC
    `,
    sql<TariffRow[]>`
      SELECT
        kota_asal_id,
        kota_tujuan_id,
        jenis_pengiriman_id,
        harga_dasar,
        harga_per_kg,
        berat_minimum_kg
      FROM tarif_pengiriman
      WHERE aktif = TRUE
    `,
  ]);

  return {
    pelanggan,
    kurir,
    kendaraan,
    jenisPengiriman,
    kota,
    barang,
    tarifPengiriman: tarifPengiriman.map(mapTariff),
  };
}

export async function createCargoShipment(
  data: CargoShipmentFormInput,
  createdBy: number,
) {
  const nomorResi = generateNomorResi();
  const biayaAsuransi = data.biayaAsuransi ?? 0;

  return sql.begin(async (tx) => {
    const [tarif] = await tx<TariffRow[]>`
      SELECT harga_dasar, harga_per_kg, berat_minimum_kg
      FROM tarif_pengiriman
      WHERE kota_asal_id = ${data.kotaAsalId}
        AND kota_tujuan_id = ${data.kotaTujuanId}
        AND jenis_pengiriman_id = ${data.jenisPengirimanId}
        AND aktif = TRUE
      LIMIT 1
    `;

    if (!tarif) {
      throw new Error(
        "Tarif untuk kota asal, kota tujuan, dan jenis pengiriman ini belum tersedia.",
      );
    }

    const beratTagihan = Math.max(data.beratBarang, toNumber(tarif.berat_minimum_kg, 1));
    const hargaPengiriman = Math.round(
      toNumber(tarif.harga_dasar) + beratTagihan * toNumber(tarif.harga_per_kg),
    );
    const totalBiaya = hargaPengiriman + biayaAsuransi;

    const [pengiriman] = await tx<{ id: number }[]>`
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
        ${nomorResi},
        ${data.pelangganId ?? null},
        ${data.kurirId ?? null},
        ${data.kendaraanId},
        ${data.jenisPengirimanId},
        ${data.kotaAsalId},
        ${data.kotaTujuanId},
        ${data.namaPengirim},
        ${data.teleponPengirim || null},
        ${data.namaPenerima},
        ${data.teleponPenerima || null},
        ${data.alamatPickup},
        ${data.alamatTujuan},
        ${data.status},
        ${createdBy}
      )
      RETURNING id
    `;

    await tx`
      INSERT INTO detail_pengiriman (
        pengiriman_id,
        total_berat_kg,
        biaya_pengiriman,
        biaya_asuransi,
        total_biaya,
        tanggal_pickup,
        estimasi_tiba,
        status_pembayaran
      )
      VALUES (
        ${pengiriman.id},
        ${data.beratBarang},
        ${hargaPengiriman},
        ${biayaAsuransi},
        ${totalBiaya},
        ${data.tanggalKirim},
        ${data.tanggalKirim}::date + COALESCE(
          (
            SELECT estimasi_hari
            FROM jenis_pengiriman
            WHERE id = ${data.jenisPengirimanId}
          ),
          0
        ),
        ${data.statusPembayaran}
      )
    `;

    await tx`
      INSERT INTO pengiriman_barang (
        pengiriman_id,
        barang_id,
        jumlah,
        berat_kg,
        status_barang,
        catatan
      )
      VALUES (
        ${pengiriman.id},
        ${data.barangId},
        ${data.jumlahBarang},
        ${data.beratBarang},
        ${data.statusBarang},
        ${data.catatanBarang || null}
      )
    `;

    await tx`
      INSERT INTO log_pengiriman (pengiriman_id, status, catatan, lokasi, diperbarui_oleh)
      VALUES (
        ${pengiriman.id},
        ${data.status},
        'Pengiriman cargo dibuat',
        NULL,
        ${createdBy}
      )
    `;

    return pengiriman.id;
  });
}

export async function updateCargoShipment(
  id: number,
  data: CargoShipmentFormInput,
  updatedBy: number,
) {
  const biayaAsuransi = data.biayaAsuransi ?? 0;

  await sql.begin(async (tx) => {
    const [tarif] = await tx<TariffRow[]>`
      SELECT harga_dasar, harga_per_kg, berat_minimum_kg
      FROM tarif_pengiriman
      WHERE kota_asal_id = ${data.kotaAsalId}
        AND kota_tujuan_id = ${data.kotaTujuanId}
        AND jenis_pengiriman_id = ${data.jenisPengirimanId}
        AND aktif = TRUE
      LIMIT 1
    `;

    if (!tarif) {
      throw new Error(
        "Tarif untuk kota asal, kota tujuan, dan jenis pengiriman ini belum tersedia.",
      );
    }

    const beratTagihan = Math.max(data.beratBarang, toNumber(tarif.berat_minimum_kg, 1));
    const hargaPengiriman = Math.round(
      toNumber(tarif.harga_dasar) + beratTagihan * toNumber(tarif.harga_per_kg),
    );
    const totalBiaya = hargaPengiriman + biayaAsuransi;

    await tx`
      UPDATE pengiriman
      SET
        pelanggan_id = ${data.pelangganId ?? null},
        kurir_id = ${data.kurirId ?? null},
        kendaraan_id = ${data.kendaraanId},
        jenis_pengiriman_id = ${data.jenisPengirimanId},
        kota_asal_id = ${data.kotaAsalId},
        kota_tujuan_id = ${data.kotaTujuanId},
        nama_pengirim = ${data.namaPengirim},
        telepon_pengirim = ${data.teleponPengirim || null},
        nama_penerima = ${data.namaPenerima},
        telepon_penerima = ${data.teleponPenerima || null},
        alamat_pickup = ${data.alamatPickup},
        alamat_tujuan = ${data.alamatTujuan},
        status = ${data.status},
        diperbarui_pada = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    await tx`
      INSERT INTO detail_pengiriman (
        pengiriman_id,
        total_berat_kg,
        biaya_pengiriman,
        biaya_asuransi,
        total_biaya,
        tanggal_pickup,
        estimasi_tiba,
        status_pembayaran
      )
      VALUES (
        ${id},
        ${data.beratBarang},
        ${hargaPengiriman},
        ${biayaAsuransi},
        ${totalBiaya},
        ${data.tanggalKirim},
        ${data.tanggalKirim}::date + COALESCE(
          (
            SELECT estimasi_hari
            FROM jenis_pengiriman
            WHERE id = ${data.jenisPengirimanId}
          ),
          0
        ),
        ${data.statusPembayaran}
      )
      ON CONFLICT (pengiriman_id)
      DO UPDATE SET
        total_berat_kg = EXCLUDED.total_berat_kg,
        biaya_pengiriman = EXCLUDED.biaya_pengiriman,
        biaya_asuransi = EXCLUDED.biaya_asuransi,
        total_biaya = EXCLUDED.total_biaya,
        tanggal_pickup = EXCLUDED.tanggal_pickup,
        estimasi_tiba = EXCLUDED.estimasi_tiba,
        status_pembayaran = EXCLUDED.status_pembayaran,
        diperbarui_pada = CURRENT_TIMESTAMP
    `;

    await tx`
      DELETE FROM pengiriman_barang
      WHERE pengiriman_id = ${id}
    `;

    await tx`
      INSERT INTO pengiriman_barang (
        pengiriman_id,
        barang_id,
        jumlah,
        berat_kg,
        status_barang,
        catatan
      )
      VALUES (
        ${id},
        ${data.barangId},
        ${data.jumlahBarang},
        ${data.beratBarang},
        ${data.statusBarang},
        ${data.catatanBarang || null}
      )
    `;

    await tx`
      INSERT INTO log_pengiriman (pengiriman_id, status, catatan, lokasi, diperbarui_oleh)
      VALUES (
        ${id},
        ${data.status},
        'Data pengiriman cargo diperbarui',
        NULL,
        ${updatedBy}
      )
    `;
  });
}

export async function deleteCargoShipment(id: number) {
  await sql`
    DELETE FROM pengiriman
    WHERE id = ${id}
  `;
}
