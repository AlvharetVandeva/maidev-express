import { CheckCircle2, ClipboardList, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ShipmentCardList } from "@/features/shipments/components/shipment-card-list";
import { ShipmentTable } from "@/features/shipments/components/shipment-table";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getCourierDashboardData } from "@/features/dashboard/service";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CourierDashboardPage() {
  const user = await requireRole(["courier"]);
  const { stats, tasks } = await getCourierDashboardData(user.id);

  return (
    <>
      <PageHeader
        title="Dashboard Kurir"
        description="Ringkasan tugas pengiriman yang ditugaskan kepada Anda."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tugas" value={stats.total} icon={ClipboardList} />
        <StatCard title="Belum Pickup" value={stats.active} icon={Package} tone="amber" />
        <StatCard title="Selesai" value={stats.completed} icon={CheckCircle2} />
        <StatCard title="Bermasalah" value={stats.failed} icon={Truck} tone="red" />
      </div>
      <div className="mt-6">
        <PageHeader title="Tugas Terbaru" />
        <ShipmentCardList shipments={tasks} />
        <ShipmentTable shipments={tasks} />
      </div>
    </>
  );
}
