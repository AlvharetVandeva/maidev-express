export type CargoStatus =
  | "menunggu_pickup"
  | "diambil_kurir"
  | "dalam_perjalanan"
  | "selesai"
  | "gagal";

export const cargoStatuses: CargoStatus[] = [
  "menunggu_pickup",
  "diambil_kurir",
  "dalam_perjalanan",
  "selesai",
  "gagal",
];

export const CARGO_STATUS_LABEL: Record<CargoStatus, string> = {
  menunggu_pickup: "Menunggu Pickup",
  diambil_kurir: "Diambil Kurir",
  dalam_perjalanan: "Dalam Perjalanan",
  selesai: "Selesai",
  gagal: "Gagal",
};

export const CARGO_STATUS_CLASS: Record<CargoStatus, string> = {
  menunggu_pickup: "bg-slate-100 text-slate-700",
  diambil_kurir: "bg-sky-100 text-sky-700",
  dalam_perjalanan: "bg-amber-100 text-amber-700",
  selesai: "bg-emerald-100 text-emerald-700",
  gagal: "bg-red-100 text-red-700",
};

export function isCargoStatus(value: string): value is CargoStatus {
  return cargoStatuses.includes(value as CargoStatus);
}

export type PaymentStatus = "belum_dibayar" | "pending" | "dibayar" | "gagal";

export const paymentStatuses: PaymentStatus[] = [
  "belum_dibayar",
  "pending",
  "dibayar",
  "gagal",
];

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  belum_dibayar: "Belum Dibayar",
  pending: "Pending",
  dibayar: "Dibayar",
  gagal: "Gagal",
};

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  belum_dibayar: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-700",
  dibayar: "bg-emerald-100 text-emerald-700",
  gagal: "bg-red-100 text-red-700",
};

export type CargoItemStatus =
  | "diproses"
  | "dalam_pengiriman"
  | "sampai_tujuan"
  | "pending"
  | "selesai";

export const cargoItemStatuses: CargoItemStatus[] = [
  "diproses",
  "dalam_pengiriman",
  "sampai_tujuan",
  "pending",
  "selesai",
];

export const CARGO_ITEM_STATUS_LABEL: Record<CargoItemStatus, string> = {
  diproses: "Diproses",
  dalam_pengiriman: "Dalam Pengiriman",
  sampai_tujuan: "Sampai Tujuan",
  pending: "Pending",
  selesai: "Selesai",
};

export const CARGO_ITEM_STATUS_CLASS: Record<CargoItemStatus, string> = {
  diproses: "bg-slate-100 text-slate-700",
  dalam_pengiriman: "bg-sky-100 text-sky-700",
  sampai_tujuan: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  selesai: "bg-emerald-100 text-emerald-700",
};

export type CargoShipment = {
  id: number;
  nomorResi: string;
  pelangganId: number | null;
  pelangganLabel: string;
  kurirId: number | null;
  kurirLabel: string | null;
  kendaraanId: number | null;
  kodeKendaraan: string | null;
  nomorPolisi: string | null;
  jenisKendaraan: string | null;
  kapasitasKg: number | null;
  kendaraanAktif: boolean | null;
  jenisPengirimanId: number;
  jenisPengirimanLabel: string;
  kotaAsalId: number;
  kotaAsalLabel: string;
  kotaTujuanId: number;
  kotaTujuanLabel: string;
  namaPengirim: string;
  teleponPengirim: string | null;
  namaPenerima: string;
  teleponPenerima: string | null;
  alamatPickup: string;
  alamatTujuan: string;
  status: CargoStatus;
  tanggalKirim: string | null;
  estimasiTiba: string | null;
  barangId: number | null;
  namaBarang: string | null;
  semuaBarang: string | null;
  jumlahBarang: number;
  beratBarang: number;
  hargaPengiriman: number;
  biayaAsuransi: number;
  totalBiaya: number;
  statusPembayaran: PaymentStatus;
  statusBarang: CargoItemStatus;
  catatanBarang: string | null;
  dibuatPada: string;
  diperbaruiPada: string;
};

export type CargoShipmentFilters = {
  search?: string;
  status?: CargoStatus | "all";
  page?: number;
  pageSize?: number;
};

export type CargoShipmentListResult = {
  shipments: CargoShipment[];
  total: number;
};

export type CargoOption = {
  value: string;
  label: string;
};

export type CargoTariff = {
  kotaAsalId: number;
  kotaTujuanId: number;
  jenisPengirimanId: number;
  hargaDasar: number;
  hargaPerKg: number;
  beratMinimumKg: number;
};

export type CargoFormOptions = {
  pelanggan: CargoOption[];
  kurir: CargoOption[];
  kendaraan: CargoOption[];
  jenisPengiriman: CargoOption[];
  kota: CargoOption[];
  barang: CargoOption[];
  tarifPengiriman: CargoTariff[];
};
