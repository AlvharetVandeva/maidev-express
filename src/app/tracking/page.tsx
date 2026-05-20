import Link from "next/link";
import { CalendarDays, MapPin, Package, UserRound } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ShipmentStatusTimeline } from "@/features/shipments/components/shipment-status-timeline";
import { TrackingForm } from "@/features/shipments/components/tracking-form";
import { trackShipmentByNumber } from "@/features/shipments/service";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ resi?: string }>;
}) {
  const params = await searchParams;
  const resi = params.resi?.trim() ?? "";
  const result = resi ? await trackShipmentByNumber(resi) : null;

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/login">
            <Button variant="outline">Masuk</Button>
          </Link>
        </header>
        <section className="mb-8">
          <PageHeader
            title="Tracking"
            description="Masukkan nomor resi untuk melihat status dan timeline pengiriman."
          />
        </section>
        <div className="space-y-8">
          <TrackingForm defaultValue={resi} />
          {resi && !result ? (
            <EmptyState title="Nomor resi tidak ditemukan." />
          ) : result ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.9fr]">
              <Card className="rounded-[1.75rem]">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle>Detail Pengiriman</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Informasi utama paket dan tujuan pengiriman.
                      </p>
                    </div>
                    <StatusBadge status={result.shipment.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-3xl bg-emerald-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Package className="h-4 w-4 text-emerald-700" />
                      No Resi
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-950">
                      {result.shipment.trackingNumber}
                    </p>
                  </div>
                  <div className="grid gap-4 text-sm md:grid-cols-2">
                    {[
                      {
                        icon: UserRound,
                        label: "Nama Pengirim",
                        value: result.shipment.senderName,
                      },
                      {
                        icon: UserRound,
                        label: "Nama Penerima",
                        value: result.shipment.receiverName,
                      },
                      {
                        icon: MapPin,
                        label: "Kota Asal",
                        value: result.shipment.originCity ?? "-",
                      },
                      {
                        icon: MapPin,
                        label: "Kota Tujuan",
                        value: result.shipment.destinationCity ?? "-",
                      },
                      {
                        icon: CalendarDays,
                        label: "Tanggal Dibuat",
                        value: formatDateTime(result.shipment.createdAt),
                      },
                      {
                        icon: CalendarDays,
                        label: "Terakhir Diperbarui",
                        value: formatDateTime(result.shipment.updatedAt),
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div key={item.label} className="rounded-2xl border border-emerald-100 p-4">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                            <Icon className="h-4 w-4 text-emerald-600" />
                            {item.label}
                          </p>
                          <p className="mt-2 font-bold text-slate-800">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[1.75rem]">
                <CardHeader>
                  <CardTitle>Timeline Status</CardTitle>
                  <p className="text-sm text-slate-500">
                    Riwayat perpindahan status paket.
                  </p>
                </CardHeader>
                <CardContent>
                  <ShipmentStatusTimeline logs={result.logs} />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
