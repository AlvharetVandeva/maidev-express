"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { RoleBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateUserStatusAction } from "@/features/users/actions";
import type { User } from "@/features/users/types";
import { formatDate } from "@/lib/utils";
import { isUserRole, roleLabels, type UserRole } from "@/lib/roles";

type UserFilterRole = UserRole | "all";

function buildUsersHref({
  search,
  role,
  page,
  pageSize,
}: {
  search: string;
  role: UserFilterRole;
  page: number;
  pageSize: number;
}) {
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (role !== "all") params.set("role", role);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== 10) params.set("perPage", String(pageSize));

  const query = params.toString();
  return `/admin/users${query ? `?${query}` : ""}`;
}

function PaginationButton({
  onNavigate,
  disabled,
  children,
  label,
}: {
  onNavigate: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-300"
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onNavigate}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      {children}
    </button>
  );
}

function UserTableSkeleton({ pageSize }: { pageSize: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="w-full overflow-auto">
        <div className="grid min-w-[920px] grid-cols-[64px_1fr_1.2fr_160px_130px_130px_130px_150px] gap-4 bg-emerald-50/80 px-4 py-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: Math.min(pageSize, 10) }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid min-w-[920px] grid-cols-[64px_1fr_1.2fr_160px_130px_130px_130px_150px] gap-4 border-b border-emerald-50 px-4 py-4 last:border-0"
          >
            {Array.from({ length: 8 }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={
                  columnIndex === 4 || columnIndex === 5
                    ? "h-7 w-24 rounded-full"
                    : columnIndex === 7
                      ? "h-9 w-28"
                      : "h-4 w-full"
                }
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-48 max-w-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserTableSkeletonView() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem]">
        <CardContent className="grid gap-3 p-5 lg:grid-cols-[1fr_180px_150px_auto] lg:items-end">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-full lg:w-28" />
        </CardContent>
      </Card>
      <UserTableSkeleton pageSize={10} />
    </div>
  );
}

function UserPagination({
  search,
  role,
  page,
  pageSize,
  totalRecords,
  visibleRecords,
  onNavigate,
}: {
  search: string;
  role: UserFilterRole;
  page: number;
  pageSize: number;
  totalRecords: number;
  visibleRecords: number;
  onNavigate: (href: string) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = totalRecords === 0 ? 0 : startRecord + visibleRecords - 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function hrefFor(nextPage: number) {
    return buildUsersHref({ search, role, page: nextPage, pageSize });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Menampilkan{" "}
        <span className="font-semibold text-slate-700">
          {startRecord}-{endRecord}
        </span>{" "}
        dari <span className="font-semibold text-slate-700">{totalRecords}</span> user
      </p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm font-semibold text-slate-600">
          Halaman {currentPage} / {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <PaginationButton
            onNavigate={() => onNavigate(hrefFor(1))}
            disabled={!hasPrevious}
            label="Halaman pertama"
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationButton>
          <PaginationButton
            onNavigate={() => onNavigate(hrefFor(Math.max(1, currentPage - 1)))}
            disabled={!hasPrevious}
            label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>
          <PaginationButton
            onNavigate={() => onNavigate(hrefFor(Math.min(totalPages, currentPage + 1)))}
            disabled={!hasNext}
            label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>
          <PaginationButton
            onNavigate={() => onNavigate(hrefFor(totalPages))}
            disabled={!hasNext}
            label="Halaman terakhir"
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}

export function UserTable({
  users,
  search,
  role,
  page,
  pageSize,
  totalRecords,
}: {
  users: User[];
  search: string;
  role: UserFilterRole;
  page: number;
  pageSize: number;
  totalRecords: number;
}) {
  const router = useRouter();
  const [isTablePending, startTableTransition] = useTransition();
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);

  function navigateToHref(href: string) {
    startTableTransition(() => {
      router.push(href);
    });
  }

  function navigateTable(formData: FormData, nextPageSize = pageSize) {
    const formSearch = formData.get("q");
    const formRole = formData.get("role");
    const nextSearch = typeof formSearch === "string" ? formSearch.trim() : search;
    const nextRole =
      typeof formRole === "string" && (formRole === "all" || isUserRole(formRole))
        ? (formRole as UserFilterRole)
        : role;

    navigateToHref(
      buildUsersHref({
        search: nextSearch,
        role: nextRole,
        page: 1,
        pageSize: nextPageSize,
      }),
    );
  }

  function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTable(new FormData(event.currentTarget));
  }

  function handleRoleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const form = event.currentTarget.form;
    navigateTable(form ? new FormData(form) : new FormData());
  }

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextPageSize = Number(event.currentTarget.value) || 10;
    const form = event.currentTarget.form;
    navigateTable(form ? new FormData(form) : new FormData(), nextPageSize);
  }

  function handleReset() {
    navigateToHref("/admin/users");
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem]">
        <CardContent className="p-5">
          <form
            onSubmit={handleFilterSubmit}
            className="grid gap-3 lg:grid-cols-[1fr_180px_150px_auto] lg:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="q">Cari User</Label>
              <Input
                id="q"
                name="q"
                defaultValue={search}
                placeholder="Nama, email, atau phone"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                defaultValue={role}
                disabled={isTablePending}
                onChange={handleRoleChange}
                className="h-12"
              >
                <option value="all">Semua Role</option>
                <option value="admin">{roleLabels.admin}</option>
                <option value="courier">{roleLabels.courier}</option>
                <option value="customer">{roleLabels.customer}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perPage">Baris</Label>
              <Select
                id="perPage"
                name="perPage"
                defaultValue={String(pageSize)}
                disabled={isTablePending}
                onChange={handlePageSizeChange}
                className="h-12"
              >
                <option value="5">5 / halaman</option>
                <option value="10">10 / halaman</option>
                <option value="20">20 / halaman</option>
                <option value="50">50 / halaman</option>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-[auto_auto]">
              <Button
                type="submit"
                disabled={isTablePending}
                className="h-12 w-full px-6 sm:w-auto"
              >
                <Search className="h-4 w-4" />
                {isTablePending ? "Memuat..." : "Cari"}
              </Button>
              {search || role !== "all" ? (
                <button
                  type="button"
                  disabled={isTablePending}
                  onClick={handleReset}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white px-6 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reset
                </button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {isTablePending ? <UserTableSkeleton pageSize={pageSize} /> : null}

      {!isTablePending && users.length === 0 ? (
        <EmptyState
          title="User tidak ditemukan."
          description="Coba ubah kata kunci, role, atau reset filter user."
        />
      ) : null}

      {!isTablePending && users.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Tabel User</h2>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `Hasil pencarian untuk "${search}"`
                  : "Data user terbaru ditampilkan lebih dulu."}
              </p>
            </div>
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              {totalRecords.toLocaleString("id-ID")} user
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
                <TableHead className="w-16 text-center">No</TableHead>
                <TableHead className="min-w-[180px]">Nama</TableHead>
                <TableHead className="min-w-[220px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Phone</TableHead>
                <TableHead className="min-w-[120px]">Role</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Dibuat</TableHead>
                <TableHead className="min-w-[150px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id} className="odd:bg-white even:bg-emerald-50/25">
                  <TableCell className="text-center text-sm font-semibold text-slate-400">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone ?? "-"}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <form
                      action={updateUserStatusAction.bind(null, user.id, !user.isActive)}
                      className="flex justify-end"
                    >
                      <Button variant="outline" size="sm" type="submit">
                        {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <UserPagination
            search={search}
            role={role}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            visibleRecords={users.length}
            onNavigate={navigateToHref}
          />
        </div>
      ) : null}
    </div>
  );
}
