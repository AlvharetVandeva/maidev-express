import { CheckCircle2, Circle } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import type { ShipmentLog } from "@/features/shipments/types";
import { formatDateTime } from "@/lib/utils";

export function ShipmentStatusTimeline({ logs }: { logs: ShipmentLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada timeline status.</p>;
  }

  return (
    <ol className="space-y-4">
      {logs.map((log, index) => {
        const Icon = index === logs.length - 1 ? CheckCircle2 : Circle;

        return (
          <li key={log.id} className="flex gap-3">
            <div className="mt-1 text-emerald-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl bg-emerald-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={log.status} />
                <span className="text-xs font-medium text-slate-500">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>
              {log.location ? (
                <p className="mt-2 text-sm font-semibold text-slate-700">{log.location}</p>
              ) : null}
              {log.note ? <p className="mt-1 text-sm text-slate-500">{log.note}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
