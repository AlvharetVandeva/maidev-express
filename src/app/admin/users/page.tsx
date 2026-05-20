import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/users/components/user-form";
import { UserTable } from "@/features/users/components/user-table";
import { listUsers } from "@/features/users/service";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <>
      <PageHeader
        title="Kelola User"
        description="Buat akun dan kelola status aktif pengguna Maidev Express."
      />
      <div className="space-y-6">
        <UserForm />
        {users.length === 0 ? <EmptyState title="Belum ada user." /> : <UserTable users={users} />}
      </div>
    </>
  );
}
