import { MapPin, Package } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Shipment } from "@/features/shipments/types";
import { formatDate } from "@/lib/utils";

export function ShipmentCardList({ shipments }: { shipments: Shipment[] }) {
  return (
    <div className="grid gap-4 lg:hidden">
      {shipments.map((shipment) => (
        <Card key={shipment.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Package className="h-4 w-4 text-emerald-600" />
                  {shipment.trackingNumber}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Dibuat {formatDate(shipment.createdAt)}
                </p>
              </div>
              <StatusBadge status={shipment.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Penerima</p>
                <p className="font-semibold text-slate-700">{shipment.receiverName}</p>
              </div>
              <div className="flex gap-2 text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p>{shipment.destinationAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
