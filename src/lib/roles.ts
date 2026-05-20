export const roles = ["admin", "courier", "customer"] as const;

export type UserRole = (typeof roles)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && roles.includes(value as UserRole);
}

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  courier: "Kurir",
  customer: "Customer",
};

export const roleDashboardPath: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  courier: "/courier/dashboard",
  customer: "/customer/dashboard",
};

export const roleProfilePath: Record<UserRole, string> = {
  admin: "/admin/profile",
  courier: "/courier/profile",
  customer: "/customer/profile",
};
