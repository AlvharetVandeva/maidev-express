export type ShipmentStatus =
  | "menunggu_pickup"
  | "diambil_kurir"
  | "dalam_perjalanan"
  | "selesai"
  | "gagal";

export const shipmentStatuses: ShipmentStatus[] = [
  "menunggu_pickup",
  "diambil_kurir",
  "dalam_perjalanan",
  "selesai",
  "gagal",
];

export function isShipmentStatus(value: string): value is ShipmentStatus {
  return shipmentStatuses.includes(value as ShipmentStatus);
}

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  menunggu_pickup: "Menunggu Pickup",
  diambil_kurir: "Diambil Kurir",
  dalam_perjalanan: "Dalam Perjalanan",
  selesai: "Selesai",
  gagal: "Gagal",
};

export const STATUS_BADGE_CLASS: Record<ShipmentStatus, string> = {
  menunggu_pickup: "bg-slate-100 text-slate-700",
  diambil_kurir: "bg-sky-100 text-sky-700",
  dalam_perjalanan: "bg-amber-100 text-amber-700",
  selesai: "bg-emerald-100 text-emerald-700",
  gagal: "bg-red-100 text-red-700",
};

export type Shipment = {
  id: number;
  trackingNumber: string;
  senderName: string;
  senderPhone: string | null;
  receiverName: string;
  receiverPhone: string | null;
  pickupAddress: string;
  destinationAddress: string;
  originCity: string | null;
  destinationCity: string | null;
  status: ShipmentStatus;
  courierId: number | null;
  customerId: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ShipmentLog = {
  id: number;
  shipmentId: number;
  status: ShipmentStatus;
  note: string | null;
  location: string | null;
  updatedBy: number | null;
  createdAt: string;
};

export type ShipmentFilters = {
  status?: ShipmentStatus | "all";
  search?: string;
};

export type CreateShipmentData = {
  senderName: string;
  senderPhone?: string | null;
  receiverName: string;
  receiverPhone?: string | null;
  pickupAddress: string;
  destinationAddress: string;
  originCity?: string | null;
  destinationCity?: string | null;
  courierId?: number | null;
  customerId?: number | null;
  createdBy?: number | null;
};

export type TrackingResult = {
  shipment: Shipment;
  logs: ShipmentLog[];
};
