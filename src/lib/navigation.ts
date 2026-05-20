import {
  ClipboardList,
  Home,
  Package,
  Search,
  User,
  Users,
} from "lucide-react";

import type { UserRole } from "@/lib/roles";

export const navigationByRole = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Pengiriman", href: "/admin/shipments", icon: Package },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Tracking", href: "/tracking", icon: Search },
    { label: "Profile", href: "/admin/profile", icon: User },
  ],
  courier: [
    { label: "Dashboard", href: "/courier/dashboard", icon: Home },
    { label: "Tugas", href: "/courier/tasks", icon: ClipboardList },
    { label: "Tracking", href: "/tracking", icon: Search },
    { label: "Profile", href: "/courier/profile", icon: User },
  ],
  customer: [
    { label: "Dashboard", href: "/customer/dashboard", icon: Home },
    { label: "Paket Saya", href: "/customer/shipments", icon: Package },
    { label: "Tracking", href: "/customer/tracking", icon: Search },
    { label: "Profile", href: "/customer/profile", icon: User },
  ],
} as const satisfies Record<UserRole, readonly NavigationItem[]>;

export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const bottomNavigationLabels = ["Dashboard", "Tracking", "Profile"];
