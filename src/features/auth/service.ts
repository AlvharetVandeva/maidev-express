import { findUserByEmail } from "@/features/auth/repository";
import type { LoginInput } from "@/features/auth/schema";
import { verifyPassword } from "@/lib/password";

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new Error("Email atau password tidak sesuai");
  }

  const validPassword = await verifyPassword(input.password, user.passwordHash);

  if (!validPassword) {
    throw new Error("Email atau password tidak sesuai");
  }

  if (!user.isActive) {
    throw new Error("Akun Anda sedang dinonaktifkan");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
