import { hashPassword } from "@/lib/password";
import { createUser, findUserByEmail, getUsers, getUsersByRole, updateUserStatus } from "@/features/users/repository";
import type { CreateUserInput } from "@/features/users/schema";
import type { UserRole } from "@/lib/roles";
import type { UserListParams } from "@/features/users/repository";

export async function listUsers(params: UserListParams = {}) {
  return getUsers(params);
}

export async function listCouriers() {
  return getUsersByRole("courier");
}

export async function listCustomers() {
  return getUsersByRole("customer");
}

export async function createUserAccount(input: CreateUserInput) {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("Email sudah digunakan");
  }

  const passwordHash = await hashPassword(input.password);

  return createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    phone: input.phone || null,
    role: input.role as UserRole,
  });
}

export async function setUserActiveStatus(userId: number, isActive: boolean) {
  return updateUserStatus(userId, isActive);
}
