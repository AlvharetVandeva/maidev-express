import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shipment } from "@/features/shipments/types";
import { formatDate } from "@/lib/utils";

export function ShipmentTable({ shipments }: { shipments: Shipment[] }) {
  return (
    <div className="hidden rounded-3xl border border-emerald-100 bg-white lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Resi</TableHead>
            <TableHead>Pengirim</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Kota Tujuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-bold text-slate-900">
                {shipment.trackingNumber}
              </TableCell>
              <TableCell>{shipment.senderName}</TableCell>
              <TableCell>{shipment.receiverName}</TableCell>
              <TableCell>{shipment.destinationCity ?? "-"}</TableCell>
              <TableCell>
                <StatusBadge status={shipment.status} />
              </TableCell>
              <TableCell>{formatDate(shipment.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
