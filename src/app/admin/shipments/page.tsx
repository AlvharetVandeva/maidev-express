import { redirect } from "next/navigation";

import { CargoAdminManager } from "@/features/cargo/components/cargo-admin-manager";
import { getAdminCargoShipments, getCargoOptions } from "@/features/cargo/service";
import {
  isCargoStatus,
  type CargoStatus,
} from "@/features/cargo/types";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; perPage?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && isCargoStatus(params.status) ? params.status : "all";
  const search = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(params.perPage) || 10));
  const [{ shipments, total }, options] = await Promise.all([
    getAdminCargoShipments({
      status: status as CargoStatus | "all",
      search,
      page,
      pageSize,
    }),
    getCargoOptions(),
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
    <CargoAdminManager
      shipments={shipments}
      options={options}
      search={search}
      status={status}
      page={page}
      pageSize={pageSize}
      totalRecords={total}
    />
  );
}
