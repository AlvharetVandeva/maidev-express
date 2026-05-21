import { notFound, redirect } from "next/navigation";

import { MasterDataManager } from "@/features/master-data/components/master-data-manager";
import { getMasterConfig } from "@/features/master-data/config";
import {
  getMasterOptions,
  listMasterRecords,
} from "@/features/master-data/repository";

export const dynamic = "force-dynamic";

export default async function MasterDataDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ jenis: string }>;
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
}) {
  const { jenis } = await params;
  const { q, page: pageParam, perPage: perPageParam } = await searchParams;
  const search = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(perPageParam) || 10));
  const config = getMasterConfig(jenis);

  if (!config) {
    notFound();
  }

  const [{ records, total }, options] = await Promise.all([
    listMasterRecords(jenis, { search, page, pageSize }),
    getMasterOptions(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total > 0 && page > totalPages) {
    const query = new URLSearchParams();

    if (search) query.set("q", search);
    query.set("page", String(totalPages));
    if (pageSize !== 10) query.set("perPage", String(pageSize));

    redirect(`/admin/master-data/${jenis}?${query.toString()}`);
  }

  return (
    <MasterDataManager
      config={config}
      records={records}
      options={options}
      search={search}
      page={page}
      pageSize={pageSize}
      totalRecords={total}
    />
  );
}
