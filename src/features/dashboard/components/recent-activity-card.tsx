import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentActivity } from "@/features/dashboard/types";
import { isShipmentStatus } from "@/features/shipments/types";
import { formatDateTime } from "@/lib/utils";

export function RecentActivityCard({ activities }: { activities: RecentActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada aktivitas terbaru.</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {activity.trackingNumber}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {activity.receiverName} • {formatDateTime(activity.updatedAt)}
                </p>
              </div>
              {isShipmentStatus(activity.status) ? (
                <StatusBadge status={activity.status} />
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
