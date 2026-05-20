import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { MasterDataManager } from "@/features/master-data/components/master-data-manager";
import { getMasterConfig } from "@/features/master-data/config";
import {
  getMasterOptions,
  listMasterRecords,
} from "@/features/master-data/repository";

export const dynamic = "force-dynamic";

export default async function MasterDataDetailPage({
  params,
}: {
  params: Promise<{ jenis: string }>;
}) {
  const { jenis } = await params;
  const config = getMasterConfig(jenis);

  if (!config) {
    notFound();
  }

  const [records, options] = await Promise.all([
    listMasterRecords(jenis),
    getMasterOptions(),
  ]);

  return (
    <>
      <MasterDataManager config={config} records={records} options={options} />
      {records.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Belum ada data master."
            description="Tambahkan data pertama melalui tombol Tambah Data."
          />
        </div>
      ) : null}
    </>
  );
}
