import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShipmentListSkeleton } from "@/features/shipments/components/admin-shipment-list-skeleton";

export default function AdminShipmentsLoading() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="CRUDS Cargo"
          description="Memuat data create, read, update, delete, dan search cargo."
        />
        <Skeleton className="h-11 w-full sm:w-44" />
      </div>
      <AdminShipmentListSkeleton />
    </>
  );
}
