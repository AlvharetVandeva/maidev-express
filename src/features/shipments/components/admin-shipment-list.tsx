"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Search,
  Truck,
  UserRound,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
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
import {
  assignCourierFormAction,
  updateShipmentStatusFormAction,
} from "@/features/shipments/actions";
import {
  shipmentStatuses,
  STATUS_LABEL,
  type Shipment,
  type ShipmentStatus,
} from "@/features/shipments/types";
import type { User } from "@/features/users/types";
import { formatDate } from "@/lib/utils";

type ShipmentFilterStatus = ShipmentStatus | "all";

function getUserName(users: User[], id: number | null) {
  if (!id) return "Belum assign";
  return users.find((user) => user.id === id)?.name ?? `ID ${id}`;
}

function buildShipmentsHref({
  search,
  status,
  page,
  pageSize,
}: {
  search: string;
  status: ShipmentFilterStatus;
  page: number;
  pageSize: number;
}) {
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== 10) params.set("perPage", String(pageSize));

  const query = params.toString();
  return `/admin/shipments${query ? `?${query}` : ""}`;
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

function ShipmentTableSkeleton({ pageSize }: { pageSize: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[64px_1.35fr_1fr_130px_260px_260px_130px] gap-4 bg-emerald-50/80 px-4 py-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: Math.min(pageSize, 10) }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[64px_1.35fr_1fr_130px_260px_260px_130px] gap-4 border-b border-emerald-50 px-4 py-4 last:border-0"
          >
            {Array.from({ length: 7 }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={columnIndex === 3 ? "h-7 w-24 rounded-full" : "h-4 w-full"}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {Array.from({ length: Math.min(pageSize, 4) }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-56 max-w-full" />
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

export function AdminShipmentListSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem]">
        <CardContent className="grid gap-3 p-5 lg:grid-cols-[1fr_220px_150px_auto] lg:items-end">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-full lg:w-28" />
        </CardContent>
      </Card>
      <ShipmentTableSkeleton pageSize={10} />
    </div>
  );
}

function ShipmentPagination({
  search,
  status,
  page,
  pageSize,
  totalRecords,
  visibleRecords,
  onNavigate,
}: {
  search: string;
  status: ShipmentFilterStatus;
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
    return buildShipmentsHref({ search, status, page: nextPage, pageSize });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Menampilkan{" "}
        <span className="font-semibold text-slate-700">
          {startRecord}-{endRecord}
        </span>{" "}
        dari <span className="font-semibold text-slate-700">{totalRecords}</span> pengiriman
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

export function AdminShipmentList({
  shipments,
  couriers,
  search,
  status,
  page,
  pageSize,
  totalRecords,
}: {
  shipments: Shipment[];
  couriers: User[];
  search: string;
  status: ShipmentFilterStatus;
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
    const formStatus = formData.get("status");
    const nextSearch = typeof formSearch === "string" ? formSearch.trim() : search;
    const nextStatus =
      typeof formStatus === "string" && (formStatus === "all" || shipmentStatuses.includes(formStatus as ShipmentStatus))
        ? (formStatus as ShipmentFilterStatus)
        : status;

    navigateToHref(
      buildShipmentsHref({
        search: nextSearch,
        status: nextStatus,
        page: 1,
        pageSize: nextPageSize,
      }),
    );
  }

  function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTable(new FormData(event.currentTarget));
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const form = event.currentTarget.form;
    navigateTable(form ? new FormData(form) : new FormData());
  }

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextPageSize = Number(event.currentTarget.value) || 10;
    const form = event.currentTarget.form;
    navigateTable(form ? new FormData(form) : new FormData(), nextPageSize);
  }

  function handleReset() {
    navigateToHref("/admin/shipments");
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem]">
        <CardContent className="p-5">
          <form
            onSubmit={handleFilterSubmit}
            className="grid gap-3 lg:grid-cols-[1fr_220px_150px_auto] lg:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="q">Cari</Label>
              <Input
                id="q"
                name="q"
                defaultValue={search}
                placeholder="Resi, pengirim, penerima, kota tujuan"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                defaultValue={status}
                disabled={isTablePending}
                onChange={handleStatusChange}
                className="h-12"
              >
                <option value="all">Semua Status</option>
                {shipmentStatuses.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABEL[item]}
                  </option>
                ))}
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
                {isTablePending ? "Memuat..." : "Filter"}
              </Button>
              {search || status !== "all" ? (
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

      {isTablePending ? <ShipmentTableSkeleton pageSize={pageSize} /> : null}

      {!isTablePending && shipments.length === 0 ? (
        <EmptyState
          title="Pengiriman tidak ditemukan."
          description="Coba ubah kata kunci, status, atau reset filter pengiriman."
        />
      ) : null}

      {!isTablePending && shipments.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Tabel Pengiriman
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `Hasil pencarian untuk "${search}"`
                  : "Data pengiriman terbaru ditampilkan lebih dulu."}
              </p>
            </div>
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              {totalRecords.toLocaleString("id-ID")} pengiriman
            </Badge>
          </div>

          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead className="min-w-[220px]">Pengiriman</TableHead>
                  <TableHead className="min-w-[180px]">Rute</TableHead>
                  <TableHead className="min-w-[130px]">Status</TableHead>
                  <TableHead className="min-w-[260px]">Kurir</TableHead>
                  <TableHead className="min-w-[260px]">Update Status</TableHead>
                  <TableHead className="min-w-[130px] text-right">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment, index) => (
                  <TableRow key={shipment.id} className="odd:bg-white even:bg-emerald-50/25">
                    <TableCell className="text-center text-sm font-semibold text-slate-400">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-950">
                          {shipment.trackingNumber}
                        </p>
                        <p className="text-sm text-slate-500">
                          {shipment.senderName} ke {shipment.receiverName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-700">
                          {shipment.originCity ?? "-"} ke {shipment.destinationCity ?? "-"}
                        </p>
                        <p className="line-clamp-2 text-slate-500">
                          {shipment.destinationAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell>
                      <form
                        action={assignCourierFormAction.bind(null, shipment.id)}
                        className="flex min-w-[220px] items-center gap-2"
                      >
                        <Select
                          name="courierId"
                          aria-label={`Assign kurir untuk ${shipment.trackingNumber}`}
                          defaultValue={shipment.courierId ?? ""}
                          className="h-10 rounded-xl"
                        >
                          <option value="">Belum assign</option>
                          {couriers.map((courier) => (
                            <option key={courier.id} value={courier.id}>
                              {courier.name}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" variant="outline" size="sm">
                          Simpan
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell>
                      <form
                        action={updateShipmentStatusFormAction.bind(null, shipment.id)}
                        className="flex min-w-[230px] items-center gap-2"
                      >
                        <Select
                          name="status"
                          aria-label={`Update status ${shipment.trackingNumber}`}
                          defaultValue={shipment.status}
                          className="h-10 rounded-xl"
                        >
                          {shipmentStatuses.map((item) => (
                            <option key={item} value={item}>
                              {STATUS_LABEL[item]}
                            </option>
                          ))}
                        </Select>
                        <input
                          type="hidden"
                          name="location"
                          value={shipment.destinationCity ?? ""}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          Update
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-500">
                      {formatDate(shipment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {shipments.map((shipment) => (
              <Card key={shipment.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                          <Package className="h-4 w-4 shrink-0 text-emerald-700" />
                          {shipment.trackingNumber}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {shipment.senderName} ke {shipment.receiverName}
                        </p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="grid gap-3 text-sm">
                      <p className="flex gap-2 text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <span>{shipment.destinationAddress}</span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-600">
                        <Truck className="h-4 w-4 text-emerald-700" />
                        {getUserName(couriers, shipment.courierId)}
                      </p>
                      <p className="flex items-center gap-2 text-slate-500">
                        <CalendarDays className="h-4 w-4 text-emerald-700" />
                        {formatDate(shipment.createdAt)}
                      </p>
                    </div>

                    <div className="grid gap-3 rounded-2xl bg-white">
                      <form
                        action={assignCourierFormAction.bind(null, shipment.id)}
                        className="grid gap-2"
                      >
                        <Label
                          htmlFor={`mobile-courier-${shipment.id}`}
                          className="flex items-center gap-2"
                        >
                          <UserRound className="h-4 w-4 text-emerald-700" />
                          Assign Kurir
                        </Label>
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <Select
                            id={`mobile-courier-${shipment.id}`}
                            name="courierId"
                            defaultValue={shipment.courierId ?? ""}
                          >
                            <option value="">Belum assign</option>
                            {couriers.map((courier) => (
                              <option key={courier.id} value={courier.id}>
                                {courier.name}
                              </option>
                            ))}
                          </Select>
                          <Button type="submit" variant="outline" size="sm">
                            Simpan
                          </Button>
                        </div>
                      </form>

                      <form
                        action={updateShipmentStatusFormAction.bind(null, shipment.id)}
                        className="grid gap-2"
                      >
                        <Label htmlFor={`mobile-status-${shipment.id}`}>Update Status</Label>
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <Select
                            id={`mobile-status-${shipment.id}`}
                            name="status"
                            defaultValue={shipment.status}
                          >
                            {shipmentStatuses.map((item) => (
                              <option key={item} value={item}>
                                {STATUS_LABEL[item]}
                              </option>
                            ))}
                          </Select>
                          <input
                            type="hidden"
                            name="location"
                            value={shipment.destinationCity ?? ""}
                          />
                          <Button type="submit" size="sm">
                            Update
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <ShipmentPagination
            search={search}
            status={status}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            visibleRecords={shipments.length}
            onNavigate={navigateToHref}
          />
        </div>
      ) : null}
    </div>
  );
}
