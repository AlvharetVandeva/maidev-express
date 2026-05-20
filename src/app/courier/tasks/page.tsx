import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateShipmentStatusAction } from "@/features/shipments/actions";
import { listCourierShipments } from "@/features/shipments/service";
import { STATUS_LABEL, type ShipmentStatus } from "@/features/shipments/types";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

function nextStatuses(status: ShipmentStatus): ShipmentStatus[] {
  if (status === "menunggu_pickup") return ["diambil_kurir"];
  if (status === "diambil_kurir") return ["dalam_perjalanan"];
  if (status === "dalam_perjalanan") return ["selesai", "gagal"];
  return [];
}

export default async function CourierTasksPage() {
  const user = await requireRole(["courier"]);
  const shipments = await listCourierShipments(user.id);

  return (
    <>
      <PageHeader
        title="Tugas Pengiriman"
        description="Update status paket yang ditugaskan kepada Anda."
      />
      {shipments.length === 0 ? (
        <EmptyState title="Belum ada tugas untuk kurir." />
      ) : (
        <div className="grid gap-4">
          {shipments.map((shipment) => (
            <Card key={shipment.id}>
              <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto]">
                <div>
                  <p className="font-extrabold text-slate-900">{shipment.trackingNumber}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Pickup: {shipment.pickupAddress}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Tujuan: {shipment.destinationAddress}
                  </p>
                </div>
                <div className="space-y-2">
                  <StatusBadge status={shipment.status} />
                  <p className="text-sm font-semibold text-slate-700">
                    Penerima: {shipment.receiverName}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  {nextStatuses(shipment.status).length === 0 ? (
                    <p className="text-sm font-semibold text-slate-500">Status final</p>
                  ) : (
                    nextStatuses(shipment.status).map((status) => (
                      <form
                        key={status}
                        action={updateShipmentStatusAction.bind(
                          null,
                          shipment.id,
                          status,
                          "Status diperbarui kurir",
                          shipment.destinationCity ?? shipment.originCity ?? undefined,
                        )}
                      >
                        <Button type="submit" size="sm">
                          {STATUS_LABEL[status]}
                        </Button>
                      </form>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
