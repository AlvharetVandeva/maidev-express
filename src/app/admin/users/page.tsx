import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { UserCreateModal } from "@/features/users/components/user-create-modal";
import { UserTable } from "@/features/users/components/user-table";
import { listUsers } from "@/features/users/service";
import { isUserRole, type UserRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string; perPage?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const role = params.role && isUserRole(params.role) ? params.role : "all";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(params.perPage) || 10));
  const { users, total } = await listUsers({
    search,
    role: role as UserRole | "all",
    page,
    pageSize,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total > 0 && page > totalPages) {
    const query = new URLSearchParams();

    if (search) query.set("q", search);
    if (role !== "all") query.set("role", role);
    query.set("page", String(totalPages));
    if (pageSize !== 10) query.set("perPage", String(pageSize));

    redirect(`/admin/users?${query.toString()}`);
  }

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
        <UserTable
          users={users}
          search={search}
          role={role}
          page={page}
          pageSize={pageSize}
          totalRecords={total}
        />
      </div>
    </>
  );
}
