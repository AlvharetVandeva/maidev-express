import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentStatusTimeline } from "@/features/shipments/components/shipment-status-timeline";
import { TrackingForm } from "@/features/shipments/components/tracking-form";
import { trackShipmentByNumber } from "@/features/shipments/service";
import { requireRole } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ resi?: string }>;
}) {
  const user = await requireRole(["customer"]);
  const params = await searchParams;
  const resi = params.resi?.trim() ?? "";
  const result = resi ? await trackShipmentByNumber(resi) : null;
  const ownsShipment = result?.shipment.customerId === user.id;

  return (
    <>
      <PageHeader
        title="Tracking"
        description="Pantau paket Anda menggunakan nomor resi Maidev Express."
      />
      <div className="space-y-6">
        <TrackingForm defaultValue={resi} action="/customer/tracking" />
        {resi && !result ? <EmptyState title="Nomor resi tidak ditemukan." /> : null}
        {result ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">No Resi</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {result.shipment.trackingNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={result.shipment.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Penerima</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {ownsShipment ? result.shipment.receiverName : "Data terbatas"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Diperbarui</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {formatDateTime(result.shipment.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
            {ownsShipment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShipmentStatusTimeline logs={result.logs} />
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                title="Data detail dibatasi."
                description="Resi ditemukan, tetapi bukan paket yang terhubung ke akun Anda."
              />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
