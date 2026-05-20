import { CalendarDays, MapPin, Package, Truck, UserRound } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  assignCourierFormAction,
  updateShipmentStatusFormAction,
} from "@/features/shipments/actions";
import {
  shipmentStatuses,
  STATUS_LABEL,
  type Shipment,
} from "@/features/shipments/types";
import type { User } from "@/features/users/types";
import { formatDate } from "@/lib/utils";

function getUserName(users: User[], id: number | null) {
  if (!id) return "Belum assign";
  return users.find((user) => user.id === id)?.name ?? `ID ${id}`;
}

export function AdminShipmentList({
  shipments,
  couriers,
}: {
  shipments: Shipment[];
  couriers: User[];
}) {
  if (shipments.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
              <TableHead className="w-[25%]">Pengiriman</TableHead>
              <TableHead className="w-[18%]">Rute</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Kurir</TableHead>
              <TableHead>Update Status</TableHead>
              <TableHead className="text-right">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-950">
                      {shipment.trackingNumber}
                    </p>
                    <p className="text-sm text-slate-500">
                      {shipment.senderName} ke {shipment.receiverName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-700">
                      {shipment.originCity ?? "-"} ke {shipment.destinationCity ?? "-"}
                    </p>
                    <p className="line-clamp-2 text-slate-500">
                      {shipment.destinationAddress}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} />
                </TableCell>
                <TableCell>
                  <form
                    action={assignCourierFormAction.bind(null, shipment.id)}
                    className="flex min-w-[220px] items-center gap-2"
                  >
                    <Select
                      name="courierId"
                      aria-label={`Assign kurir untuk ${shipment.trackingNumber}`}
                      defaultValue={shipment.courierId ?? ""}
                      className="h-10 rounded-xl"
                    >
                      <option value="">Belum assign</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.name}
                        </option>
                      ))}
                    </Select>
                    <Button type="submit" variant="outline" size="sm">
                      Simpan
                    </Button>
                  </form>
                </TableCell>
                <TableCell>
                  <form
                    action={updateShipmentStatusFormAction.bind(null, shipment.id)}
                    className="flex min-w-[230px] items-center gap-2"
                  >
                    <Select
                      name="status"
                      aria-label={`Update status ${shipment.trackingNumber}`}
                      defaultValue={shipment.status}
                      className="h-10 rounded-xl"
                    >
                      {shipmentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </Select>
                    <input type="hidden" name="location" value={shipment.destinationCity ?? ""} />
                    <Button type="submit" variant="outline" size="sm">
                      Update
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right text-sm text-slate-500">
                  {formatDate(shipment.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                      <Package className="h-4 w-4 shrink-0 text-emerald-700" />
                      {shipment.trackingNumber}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {shipment.senderName} ke {shipment.receiverName}
                    </p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div className="grid gap-3 text-sm">
                  <p className="flex gap-2 text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <span>{shipment.destinationAddress}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Truck className="h-4 w-4 text-emerald-700" />
                    {getUserName(couriers, shipment.courierId)}
                  </p>
                  <p className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4 text-emerald-700" />
                    {formatDate(shipment.createdAt)}
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl bg-white">
                  <form
                    action={assignCourierFormAction.bind(null, shipment.id)}
                    className="grid gap-2"
                  >
                    <Label
                      htmlFor={`mobile-courier-${shipment.id}`}
                      className="flex items-center gap-2"
                    >
                      <UserRound className="h-4 w-4 text-emerald-700" />
                      Assign Kurir
                    </Label>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Select
                        id={`mobile-courier-${shipment.id}`}
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
                        Simpan
                      </Button>
                    </div>
                  </form>

                  <form
                    action={updateShipmentStatusFormAction.bind(null, shipment.id)}
                    className="grid gap-2"
                  >
                    <Label htmlFor={`mobile-status-${shipment.id}`}>Update Status</Label>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Select
                        id={`mobile-status-${shipment.id}`}
                        name="status"
                        defaultValue={shipment.status}
                      >
                        {shipmentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </Select>
                      <input
                        type="hidden"
                        name="location"
                        value={shipment.destinationCity ?? ""}
                      />
                      <Button type="submit" size="sm">
                        Update
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
