import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
      {/* <Card className="mt-6 bg-emerald-500 text-white">
        <CardContent className="p-6">
          <p className="text-2xl font-extrabold">Kirim barangmu dengan aman & tepat waktu</p>
          <p className="mt-2 max-w-2xl text-emerald-50">
            Gunakan dashboard ini untuk menjaga operasional pengiriman tetap ringan,
            cepat, dan mudah dipantau.
          </p>
        </CardContent>
      </Card> */}
    </>
  );
}
