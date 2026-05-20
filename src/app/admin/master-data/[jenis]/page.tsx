import { notFound } from "next/navigation";

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
  searchParams: Promise<{ q?: string }>;
}) {
  const { jenis } = await params;
  const { q } = await searchParams;
  const search = q?.trim() ?? "";
  const config = getMasterConfig(jenis);

  if (!config) {
    notFound();
  }

  const [records, options] = await Promise.all([
    listMasterRecords(jenis, search),
    getMasterOptions(),
  ]);

  return <MasterDataManager config={config} records={records} options={options} search={search} />;
}
