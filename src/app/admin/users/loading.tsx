import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTableSkeletonView } from "@/features/users/components/user-table-skeleton";

export default function AdminUsersLoading() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Kelola User"
          description="Buat akun dan kelola status aktif pengguna Maidev Express."
        />
        <Skeleton className="h-11 w-full sm:w-36" />
      </div>
      <UserTableSkeletonView />
    </>
  );
}
