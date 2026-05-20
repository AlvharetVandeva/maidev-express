import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentCardList } from "@/features/shipments/components/shipment-card-list";
import { ShipmentStatusTimeline } from "@/features/shipments/components/shipment-status-timeline";
import { ShipmentTable } from "@/features/shipments/components/shipment-table";
import { getShipmentTimeline, listCustomerShipments } from "@/features/shipments/service";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CustomerShipmentsPage() {
  const user = await requireRole(["customer"]);
  const shipments = await listCustomerShipments(user.id);
  const latest = shipments[0];
  const logs = latest ? await getShipmentTimeline(latest.id) : [];

  return (
    <>
      <PageHeader
        title="Paket Saya"
        description="Daftar pengiriman yang terhubung dengan akun Anda."
      />
      {shipments.length === 0 ? (
        <EmptyState title="Belum ada paket milik Anda." />
      ) : (
        <div className="space-y-6">
          <ShipmentCardList shipments={shipments} />
          <ShipmentTable shipments={shipments} />
          <Card>
            <CardHeader>
              <CardTitle>Timeline Paket Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentStatusTimeline logs={logs} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
