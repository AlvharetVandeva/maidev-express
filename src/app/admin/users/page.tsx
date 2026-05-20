import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { UserCreateModal } from "@/features/users/components/user-create-modal";
import { UserTable } from "@/features/users/components/user-table";
import { listUsers } from "@/features/users/service";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Kelola User"
          description="Buat akun dan kelola status aktif pengguna Maidev Express."
        />
        <UserCreateModal />
      </div>
      <div className="space-y-6">
        {users.length === 0 ? <EmptyState title="Belum ada user." /> : <UserTable users={users} />}
      </div>
    </>
  );
}
