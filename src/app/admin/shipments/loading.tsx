import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShipmentListSkeleton } from "@/features/shipments/components/admin-shipment-list";

export default function AdminShipmentsLoading() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Kelola Pengiriman"
          description="Cari, filter, tambah, assign kurir, dan update status pengiriman."
        />
        <Skeleton className="h-11 w-full sm:w-44" />
      </div>
      <AdminShipmentListSkeleton />
    </>
  );
}
