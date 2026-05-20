import Link from "next/link";

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
    <main className="min-h-screen bg-emerald-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/login">
            <Button variant="outline">Masuk</Button>
          </Link>
        </header>
        <PageHeader
          title="Tracking"
          description="Masukkan nomor resi untuk melihat status dan timeline pengiriman."
        />
        <div className="space-y-6">
          <TrackingForm defaultValue={resi} />
          {resi && !result ? (
            <EmptyState title="Nomor resi tidak ditemukan." />
          ) : result ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Pengiriman</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                  {[
                    ["No Resi", result.shipment.trackingNumber],
                    ["Nama Pengirim", result.shipment.senderName],
                    ["Nama Penerima", result.shipment.receiverName],
                    ["Kota Asal", result.shipment.originCity ?? "-"],
                    ["Kota Tujuan", result.shipment.destinationCity ?? "-"],
                    ["Tanggal Dibuat", formatDateTime(result.shipment.createdAt)],
                    ["Terakhir Diperbarui", formatDateTime(result.shipment.updatedAt)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 font-semibold text-slate-700">{value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={result.shipment.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Status</CardTitle>
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
