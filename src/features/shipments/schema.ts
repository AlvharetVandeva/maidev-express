import { z } from "zod";

export const shipmentStatusSchema = z.enum([
  "menunggu_pickup",
  "diambil_kurir",
  "dalam_perjalanan",
  "selesai",
  "gagal",
]);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}, z.number().int().positive().nullable());

export const createShipmentSchema = z.object({
  senderName: z.string().min(2, "Nama pengirim wajib diisi"),
  senderPhone: z.string().optional(),
  receiverName: z.string().min(2, "Nama penerima wajib diisi"),
  receiverPhone: z.string().optional(),
  pickupAddress: z.string().min(5, "Alamat pickup wajib diisi"),
  destinationAddress: z.string().min(5, "Alamat tujuan wajib diisi"),
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  courierId: optionalNumber,
  customerId: optionalNumber,
});

export const updateShipmentStatusSchema = z.object({
  status: shipmentStatusSchema,
  note: z.string().optional(),
  location: z.string().optional(),
});

export const trackingSchema = z.object({
  trackingNumber: z.string().min(3, "Nomor resi minimal 3 karakter"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export type TrackingInput = z.infer<typeof trackingSchema>;
