"use server";

import { revalidatePath } from "next/cache";

import { createUserSchema } from "@/features/users/schema";
import { createUserAccount, setUserActiveStatus } from "@/features/users/service";
import type { ActionState } from "@/lib/utils";

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data user.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createUserAccount(parsed.data);
    revalidatePath("/admin/users");
    return { success: true, message: "User berhasil dibuat." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat user.",
    };
  }
}

export async function updateUserStatusAction(userId: number, isActive: boolean) {
  await setUserActiveStatus(userId, isActive);
  revalidatePath("/admin/users");
}
