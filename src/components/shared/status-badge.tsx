import { Badge } from "@/components/ui/badge";
import {
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type ShipmentStatus,
} from "@/features/shipments/types";
import { roleLabels, type UserRole } from "@/lib/roles";

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const className =
    role === "admin"
      ? "bg-emerald-100 text-emerald-700"
      : role === "courier"
        ? "bg-sky-100 text-sky-700"
        : "bg-amber-100 text-amber-700";

  return <Badge className={className}>{roleLabels[role]}</Badge>;
}
