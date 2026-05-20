"use server";

import { revalidatePath } from "next/cache";

import {
  createMasterRecord,
  deleteMasterRecord,
  formDataToMasterValues,
  updateMasterRecord,
  validateMasterValues,
} from "@/features/master-data/repository";
import type { ActionState } from "@/lib/utils";

function pathFor(slug: string) {
  return `/admin/master-data/${slug}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("duplicate key")) {
      return "Data dengan kode atau kombinasi tersebut sudah ada.";
    }

    if (error.message.includes("violates foreign key")) {
      return "Data relasi tidak valid atau masih digunakan.";
    }

    return error.message;
  }

  return "Terjadi kesalahan saat memproses data.";
}

export async function createMasterDataAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formDataToMasterValues(slug, formData);
  const validationError = validateMasterValues(slug, values);

  if (validationError) {
    return { success: false, message: validationError };
  }

  try {
    await createMasterRecord(slug, values);
    revalidatePath(pathFor(slug));
    revalidatePath("/admin/master-data");
    return { success: true, message: "Data berhasil ditambahkan." };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateMasterDataAction(
  slug: string,
  id: number,
  formData: FormData,
) {
  const values = formDataToMasterValues(slug, formData);
  const validationError = validateMasterValues(slug, values);

  if (validationError) {
    throw new Error(validationError);
  }

  await updateMasterRecord(slug, id, values);
  revalidatePath(pathFor(slug));
  revalidatePath("/admin/master-data");
}

export async function deleteMasterDataAction(slug: string, id: number) {
  await deleteMasterRecord(slug, id);
  revalidatePath(pathFor(slug));
  revalidatePath("/admin/master-data");
}
