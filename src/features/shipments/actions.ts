"use server";

import { revalidatePath } from "next/cache";

import {
  createShipmentSchema,
  trackingSchema,
  updateShipmentStatusSchema,
} from "@/features/shipments/schema";
import {
  assignCourierToShipment,
  changeShipmentStatus,
  createShipmentRecord,
  trackShipmentByNumber,
} from "@/features/shipments/service";
import { requireRole, requireUser } from "@/lib/session";
import type { ActionState } from "@/lib/utils";

export async function createShipmentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin"]);
  const parsed = createShipmentSchema.safeParse({
    senderName: formData.get("senderName"),
    senderPhone: formData.get("senderPhone") || undefined,
    receiverName: formData.get("receiverName"),
    receiverPhone: formData.get("receiverPhone") || undefined,
    pickupAddress: formData.get("pickupAddress"),
    destinationAddress: formData.get("destinationAddress"),
    originCity: formData.get("originCity") || undefined,
    destinationCity: formData.get("destinationCity") || undefined,
    courierId: formData.get("courierId"),
    customerId: formData.get("customerId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data pengiriman.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createShipmentRecord(parsed.data, user.id);
    revalidatePath("/admin/shipments");
    return { success: true, message: "Pengiriman berhasil dibuat." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat pengiriman.",
    };
  }
}

export async function assignCourierAction(shipmentId: number, courierId: number | null) {
  await requireRole(["admin"]);
  await assignCourierToShipment(shipmentId, courierId);
  revalidatePath("/admin/shipments");
}

export async function assignCourierFormAction(shipmentId: number, formData: FormData) {
  const courierIdValue = formData.get("courierId");
  const courierId = courierIdValue ? Number(courierIdValue) : null;
  await assignCourierAction(shipmentId, courierId);
}

export async function updateShipmentStatusAction(
  shipmentId: number,
  status: string,
  note?: string,
  location?: string,
) {
  const user = await requireUser();
  const parsed = updateShipmentStatusSchema.safeParse({ status, note, location });

  if (!parsed.success) {
    throw new Error("Status pengiriman tidak valid");
  }

  await changeShipmentStatus({
    shipmentId,
    status: parsed.data.status,
    userId: user.id,
    role: user.role,
    note: parsed.data.note,
    location: parsed.data.location,
  });

  revalidatePath("/admin/shipments");
  revalidatePath("/courier/tasks");
  revalidatePath("/customer/shipments");
}

export async function updateShipmentStatusFormAction(
  shipmentId: number,
  formData: FormData,
) {
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "Status diperbarui admin");
  const locationValue = formData.get("location");
  const location = locationValue ? String(locationValue) : undefined;

  await updateShipmentStatusAction(shipmentId, status, note, location);
}

export async function trackShipmentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = trackingSchema.safeParse({
    trackingNumber: formData.get("trackingNumber"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Nomor resi tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await trackShipmentByNumber(parsed.data.trackingNumber);
  return {
    success: Boolean(result),
    message: result ? "Pengiriman ditemukan." : "Nomor resi tidak ditemukan.",
  };
}
