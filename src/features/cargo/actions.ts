"use server";

import { revalidatePath } from "next/cache";

import { cargoShipmentFormSchema } from "@/features/cargo/schema";
import {
  createAdminCargoShipment,
  removeAdminCargoShipment,
  updateAdminCargoShipment,
} from "@/features/cargo/service";
import { requireRole } from "@/lib/session";
import type { ActionState } from "@/lib/utils";

function formDataToPayload(formData: FormData) {
  return {
    pelangganId: formData.get("pelangganId"),
    kurirId: formData.get("kurirId"),
    kendaraanId: formData.get("kendaraanId"),
    jenisPengirimanId: formData.get("jenisPengirimanId"),
    kotaAsalId: formData.get("kotaAsalId"),
    kotaTujuanId: formData.get("kotaTujuanId"),
    namaPengirim: formData.get("namaPengirim"),
    teleponPengirim: formData.get("teleponPengirim") || undefined,
    namaPenerima: formData.get("namaPenerima"),
    teleponPenerima: formData.get("teleponPenerima"),
    alamatPickup: formData.get("alamatPickup"),
    alamatTujuan: formData.get("alamatTujuan"),
    tanggalKirim: formData.get("tanggalKirim"),
    status: formData.get("status"),
    barangId: formData.get("barangId"),
    jumlahBarang: formData.get("jumlahBarang"),
    beratBarang: formData.get("beratBarang"),
    hargaPengiriman: formData.get("hargaPengiriman"),
    biayaAsuransi: formData.get("biayaAsuransi"),
    statusPembayaran: formData.get("statusPembayaran"),
    statusBarang: formData.get("statusBarang"),
    catatanBarang: formData.get("catatanBarang") || undefined,
  };
}

function errorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  if (error.message.includes("duplicate key")) {
    return "Nomor resi atau data relasi yang unik sudah digunakan.";
  }

  if (error.message.includes("violates foreign key")) {
    return "Data relasi tidak valid. Pastikan pelanggan, kota, kendaraan, dan barang tersedia.";
  }

  return error.message;
}

export async function createCargoShipmentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin"]);
  const parsed = cargoShipmentFormSchema.safeParse(formDataToPayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data cargo.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createAdminCargoShipment(parsed.data, user.id);
    revalidatePath("/admin/shipments");
    return { success: true, message: "Data cargo berhasil ditambahkan." };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, "Gagal menambahkan data cargo."),
    };
  }
}

export async function updateCargoShipmentAction(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin"]);
  const parsed = cargoShipmentFormSchema.safeParse(formDataToPayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data cargo.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAdminCargoShipment(id, parsed.data, user.id);
    revalidatePath("/admin/shipments");
    return { success: true, message: "Data cargo berhasil diperbarui." };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, "Gagal memperbarui data cargo."),
    };
  }
}

export async function deleteCargoShipmentAction(id: number) {
  await requireRole(["admin"]);
  await removeAdminCargoShipment(id);
  revalidatePath("/admin/shipments");
}
