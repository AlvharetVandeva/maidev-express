import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ShipmentCardList } from "@/features/shipments/components/shipment-card-list";
import { ShipmentForm } from "@/features/shipments/components/shipment-form";
import { assignCourierFormAction, updateShipmentStatusAction } from "@/features/shipments/actions";
import { listAllShipments } from "@/features/shipments/service";
import { isShipmentStatus, shipmentStatuses, STATUS_LABEL, type ShipmentStatus } from "@/features/shipments/types";
import { listCouriers, listCustomers } from "@/features/users/service";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && isShipmentStatus(params.status) ? params.status : "all";
  const search = params.q ?? "";
  const [shipments, couriers, customers] = await Promise.all([
    listAllShipments({ status: status as ShipmentStatus | "all", search }),
    listCouriers(),
    listCustomers(),
  ]);

  return (
    <>
      <PageHeader
        title="Kelola Pengiriman"
        description="Cari, filter, tambah, assign kurir, dan update status pengiriman."
      />
      <div className="space-y-6">
        <ShipmentForm couriers={couriers} customers={customers} />
        <Card>
          <CardContent className="p-5">
            <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <div className="space-y-2">
                <Label htmlFor="q">Cari</Label>
                <Input
                  id="q"
                  name="q"
                  defaultValue={search}
                  placeholder="Resi, pengirim, penerima, kota tujuan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={status}>
                  <option value="all">Semua Status</option>
                  {shipmentStatuses.map((item) => (
                    <option key={item} value={item}>
                      {STATUS_LABEL[item]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <Search className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {shipments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ShipmentCardList shipments={shipments} />
            <div className="hidden space-y-3 lg:block">
              {shipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardContent className="grid gap-4 p-5 xl:grid-cols-[1.2fr_1fr_220px_220px]">
                    <div>
                      <p className="font-extrabold text-slate-900">
                        {shipment.trackingNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {shipment.senderName} ke {shipment.receiverName}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {shipment.destinationCity ?? "-"} • {shipment.destinationAddress}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <StatusBadge status={shipment.status} />
                      <p className="text-sm text-slate-500">
                        Kurir ID: {shipment.courierId ?? "Belum assign"}
                      </p>
                    </div>
                    <form
                      action={assignCourierFormAction.bind(null, shipment.id)}
                      className="space-y-2"
                    >
                      <Label htmlFor={`courier-${shipment.id}`}>Assign Kurir</Label>
                      <Select
                        id={`courier-${shipment.id}`}
                        name="courierId"
                        defaultValue={shipment.courierId ?? ""}
                      >
                        <option value="">Belum assign</option>
                        {couriers.map((courier) => (
                          <option key={courier.id} value={courier.id}>
                            {courier.name}
                          </option>
                        ))}
                      </Select>
                      <Button type="submit" variant="outline" size="sm">
                        Simpan Kurir
                      </Button>
                    </form>
                    <div className="space-y-2">
                      <Label>Update Status</Label>
                      <div className="flex flex-wrap gap-2">
                        {shipmentStatuses.map((item) => (
                          <form
                            key={item}
                            action={updateShipmentStatusAction.bind(
                              null,
                              shipment.id,
                              item,
                              "Status diperbarui admin",
                              shipment.destinationCity ?? undefined,
                            )}
                          >
                            <Button
                              type="submit"
                              variant={item === shipment.status ? "default" : "outline"}
                              size="sm"
                            >
                              {STATUS_LABEL[item]}
                            </Button>
                          </form>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
