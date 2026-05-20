import type { UserRole } from "@/lib/roles";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
