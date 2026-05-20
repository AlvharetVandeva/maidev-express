import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ShipmentCardList } from "@/features/shipments/components/shipment-card-list";
import { ShipmentTable } from "@/features/shipments/components/shipment-table";
import { TrackingForm } from "@/features/shipments/components/tracking-form";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getCustomerDashboardData } from "@/features/dashboard/service";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const user = await requireRole(["customer"]);
  const { stats, shipments } = await getCustomerDashboardData(user.id);

  return (
    <>
      <PageHeader
        title="Dashboard Customer"
        description="Ringkasan paket Anda dan akses tracking cepat."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Paket Saya" value={stats.total} icon={Package} />
        <StatCard title="Paket Aktif" value={stats.active} icon={Truck} tone="blue" />
        <StatCard title="Selesai" value={stats.completed} icon={CheckCircle2} />
        <StatCard title="Bermasalah" value={stats.failed} icon={AlertTriangle} tone="red" />
      </div>
      <div className="mt-6">
        <TrackingForm action="/customer/tracking" />
      </div>
      <div className="mt-6">
        <PageHeader title="Paket Terbaru" />
        <ShipmentCardList shipments={shipments} />
        <ShipmentTable shipments={shipments} />
      </div>
    </>
  );
}
