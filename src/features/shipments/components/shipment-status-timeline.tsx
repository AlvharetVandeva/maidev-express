import { CheckCircle2, Circle } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import type { ShipmentLog } from "@/features/shipments/types";
import { formatDateTime } from "@/lib/utils";

export function ShipmentStatusTimeline({ logs }: { logs: ShipmentLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada timeline status.</p>;
  }

  return (
    <ol className="relative space-y-0">
      {logs.map((log, index) => {
        const isLatest = index === logs.length - 1;
        const Icon = isLatest ? CheckCircle2 : Circle;

        return (
          <li key={log.id} className="relative grid grid-cols-[32px_1fr] gap-3 pb-5 last:pb-0">
            {index !== logs.length - 1 ? (
              <span className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px bg-emerald-100" />
            ) : null}
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Icon
                className={isLatest ? "h-5 w-5 text-emerald-600" : "h-4 w-4 text-emerald-500"}
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 rounded-3xl border border-emerald-100 bg-emerald-50/80 px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <StatusBadge status={log.status} />
                <span className="text-xs font-medium text-slate-500">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>
              {log.location ? (
                <p className="mt-3 text-sm font-bold text-slate-800">{log.location}</p>
              ) : null}
              {log.note ? <p className="mt-1 text-sm leading-6 text-slate-500">{log.note}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
