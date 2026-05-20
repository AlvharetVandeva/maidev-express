"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/features/auth/schema";
import { loginUser } from "@/features/auth/service";
import { createSession, destroySession } from "@/lib/session";
import { roleDashboardPath } from "@/lib/roles";
import type { ActionState } from "@/lib/utils";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali email dan password.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  let redirectPath = "/dashboard";

  try {
    const user = await loginUser(parsed.data);
    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    redirectPath = roleDashboardPath[user.role];
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login gagal.",
    };
  }

  redirect(redirectPath);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
