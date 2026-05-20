import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { ShipmentChart } from "@/features/dashboard/components/shipment-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getAdminDashboardData } from "@/features/dashboard/service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { stats, chartData, activities } = await getAdminDashboardData();

  return (
    <>
      <PageHeader
        title="Dashboard Admin"
        description="Pantau seluruh pengiriman, status paket, dan aktivitas terbaru."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <StatCard title="Total Paket" value={stats.total} icon={Package} />
        <StatCard title="Sedang Dikirim" value={stats.active} icon={Truck} tone="blue" />
        <StatCard title="Selesai" value={stats.completed} icon={CheckCircle2} />
        <StatCard title="Gagal" value={stats.failed} icon={AlertTriangle} tone="red" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <ShipmentChart data={chartData} />
        <RecentActivityCard activities={activities} />
      </div>
    </>
  );
}
