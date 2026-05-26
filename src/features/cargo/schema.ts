import { z } from "zod";

const requiredId = (label: string) =>
  z.preprocess(
    (value) => Number(value),
    z.number({ error: `${label} wajib dipilih` }).int().positive(`${label} wajib dipilih`),
  );

const optionalId = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}, z.number().int().positive().nullable());

const requiredText = (message: string, minLength = 1) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().min(minLength, message),
  );

const optionalText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().optional(),
);

const requiredNumber = (label: string) =>
  z.preprocess(
    (value) => Number(value),
    z.number({ error: `${label} wajib diisi` }).positive(`${label} harus lebih dari 0`),
  );

const optionalMoney = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return 0;
  return Number(value);
}, z.number().min(0));

export const cargoStatusSchema = z.enum([
  "menunggu_pickup",
  "diambil_kurir",
  "dalam_perjalanan",
  "selesai",
  "gagal",
]);

export const paymentStatusSchema = z.enum([
  "belum_dibayar",
  "pending",
  "dibayar",
  "gagal",
]);

export const cargoItemStatusSchema = z.enum([
  "diproses",
  "dalam_pengiriman",
  "sampai_tujuan",
  "pending",
  "selesai",
]);

export const cargoShipmentFormSchema = z.object({
  pelangganId: optionalId,
  kurirId: optionalId,
  kendaraanId: requiredId("Kendaraan"),
  jenisPengirimanId: requiredId("Jenis pengiriman"),
  kotaAsalId: requiredId("Kota asal"),
  kotaTujuanId: requiredId("Kota tujuan"),
  namaPengirim: requiredText("Nama pengirim wajib diisi", 2),
  teleponPengirim: optionalText,
  namaPenerima: requiredText("Nama penerima wajib diisi", 2),
  teleponPenerima: requiredText("No telepon penerima wajib diisi", 3),
  alamatPickup: requiredText("Alamat pickup wajib diisi", 3),
  alamatTujuan: requiredText("Alamat tujuan wajib diisi", 3),
  tanggalKirim: requiredText("Tanggal kirim wajib diisi"),
  status: cargoStatusSchema,
  barangId: requiredId("Jenis barang"),
  jumlahBarang: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return 1;
    return Number(value);
  }, z.number().int().positive("Jumlah barang harus lebih dari 0")),
  beratBarang: requiredNumber("Berat barang"),
  hargaPengiriman: requiredNumber("Harga pengiriman"),
  biayaAsuransi: optionalMoney,
  statusPembayaran: paymentStatusSchema,
  statusBarang: cargoItemStatusSchema,
  catatanBarang: optionalText,
});

export type CargoShipmentFormInput = z.infer<typeof cargoShipmentFormSchema>;
