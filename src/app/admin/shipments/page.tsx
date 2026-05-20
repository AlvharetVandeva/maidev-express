import { Search } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AdminShipmentList } from "@/features/shipments/components/admin-shipment-list";
import { ShipmentCreateModal } from "@/features/shipments/components/shipment-create-modal";
import { listAllShipments } from "@/features/shipments/service";
import {
  isShipmentStatus,
  shipmentStatuses,
  STATUS_LABEL,
  type ShipmentStatus,
} from "@/features/shipments/types";
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Kelola Pengiriman"
          description="Cari, filter, tambah, assign kurir, dan update status pengiriman."
        />
        <ShipmentCreateModal couriers={couriers} customers={customers} />
      </div>

      <div className="space-y-6">
        <Card className="rounded-[1.75rem]">
          <CardContent className="p-5">
            <form className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
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
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4" />
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        <AdminShipmentList shipments={shipments} couriers={couriers} />
      </div>
    </>
  );
}
