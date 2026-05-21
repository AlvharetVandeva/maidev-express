import {
  assignCourier,
  createShipment,
  createShipmentLog,
  getAllShipments,
  getShipmentById,
  getShipmentByTrackingNumber,
  getShipmentLogs,
  getShipmentsByCourierId,
  getShipmentsByCustomerId,
  updateShipmentStatus,
} from "@/features/shipments/repository";
import type { CreateShipmentInput } from "@/features/shipments/schema";
import type { ShipmentStatus } from "@/features/shipments/types";
import type { UserRole } from "@/lib/roles";
import type { ShipmentListParams } from "@/features/shipments/repository";

export async function listAllShipments(filters: ShipmentListParams = {}) {
  return getAllShipments(filters);
}

export async function listCourierShipments(courierId: number) {
  return getShipmentsByCourierId(courierId);
}

export async function listCustomerShipments(customerId: number) {
  return getShipmentsByCustomerId(customerId);
}

export async function createShipmentRecord(input: CreateShipmentInput, createdBy: number) {
  const shipment = await createShipment({
    senderName: input.senderName,
    senderPhone: input.senderPhone || null,
    receiverName: input.receiverName,
    receiverPhone: input.receiverPhone || null,
    pickupAddress: input.pickupAddress,
    destinationAddress: input.destinationAddress,
    originCity: input.originCity || null,
    destinationCity: input.destinationCity || null,
    courierId: input.courierId ?? null,
    customerId: input.customerId ?? null,
    createdBy,
  });

  await createShipmentLog({
    shipmentId: shipment.id,
    status: shipment.status,
    note: "Pengiriman dibuat",
    updatedBy: createdBy,
  });

  return shipment;
}

export async function assignCourierToShipment(shipmentId: number, courierId: number | null) {
  return assignCourier(shipmentId, courierId);
}

export async function changeShipmentStatus(input: {
  shipmentId: number;
  status: ShipmentStatus;
  userId: number;
  role: UserRole;
  note?: string | null;
  location?: string | null;
}) {
  const shipment = await getShipmentById(input.shipmentId);

  if (!shipment) {
    throw new Error("Pengiriman tidak ditemukan");
  }

  if (input.role === "courier" && shipment.courierId !== input.userId) {
    throw new Error("Anda tidak bisa mengubah pengiriman yang bukan tugas Anda");
  }

  if (input.role === "customer") {
    throw new Error("Customer tidak bisa mengubah status pengiriman");
  }

  const updatedShipment = await updateShipmentStatus(input.shipmentId, input.status);
  await createShipmentLog({
    shipmentId: input.shipmentId,
    status: input.status,
    note: input.note || null,
    location: input.location || null,
    updatedBy: input.userId,
  });

  return updatedShipment;
}

export async function trackShipmentByNumber(trackingNumber: string) {
  const shipment = await getShipmentByTrackingNumber(trackingNumber.trim());

  if (!shipment) return null;

  const logs = await getShipmentLogs(shipment.id);
  return { shipment, logs };
}

export async function getShipmentTimeline(shipmentId: number) {
  return getShipmentLogs(shipmentId);
}
