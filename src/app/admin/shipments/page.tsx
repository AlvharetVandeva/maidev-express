import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { AdminShipmentList } from "@/features/shipments/components/admin-shipment-list";
import { ShipmentCreateModal } from "@/features/shipments/components/shipment-create-modal";
import { listAllShipments } from "@/features/shipments/service";
import {
  isShipmentStatus,
  type ShipmentStatus,
} from "@/features/shipments/types";
import { listCouriers, listCustomers } from "@/features/users/service";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; perPage?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && isShipmentStatus(params.status) ? params.status : "all";
  const search = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(params.perPage) || 10));
  const [{ shipments, total }, couriers, customers] = await Promise.all([
    listAllShipments({
      status: status as ShipmentStatus | "all",
      search,
      page,
      pageSize,
    }),
    listCouriers(),
    listCustomers(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total > 0 && page > totalPages) {
    const query = new URLSearchParams();

    if (search) query.set("q", search);
    if (status !== "all") query.set("status", status);
    query.set("page", String(totalPages));
    if (pageSize !== 10) query.set("perPage", String(pageSize));

    redirect(`/admin/shipments?${query.toString()}`);
  }

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
        <AdminShipmentList
          shipments={shipments}
          couriers={couriers}
          search={search}
          status={status}
          page={page}
          pageSize={pageSize}
          totalRecords={total}
        />
      </div>
    </>
  );
}
