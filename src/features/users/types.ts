import type { UserRole } from "@/lib/roles";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserWithPassword = User & {
  passwordHash: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: UserRole;
};
