"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createMasterDataAction,
  deleteMasterDataAction,
  updateMasterDataAction,
} from "@/features/master-data/actions";
import { getMasterOptionLabel } from "@/features/master-data/format";
import type {
  MasterConfig,
  MasterField,
  MasterOptionMap,
  MasterRecord,
} from "@/features/master-data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/utils";

function formatValue(
  field: MasterField,
  value: string | number | boolean | null,
  options: MasterOptionMap,
) {
  if (field.type === "boolean") {
    return (
      <Badge
        className={
          value
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }
      >
        {value ? "Aktif" : "Nonaktif"}
      </Badge>
    );
  }

  if (field.type === "money" && typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const relationValue = getMasterOptionLabel(options, field.relation, value);
  if (relationValue) return relationValue;

  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return value.toLocaleString("id-ID");

  return <span className="text-slate-400">-</span>;
}

function fieldValue(record: MasterRecord | null, field: MasterField) {
  const value = record?.[field.name];
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return "";
  return String(value);
}

function MasterInput({
  field,
  record,
  options,
}: {
  field: MasterField;
  record?: MasterRecord | null;
  options: MasterOptionMap;
}) {
  const id = `${record?.id ?? "new"}-${field.name}`;
  const commonProps = {
    id,
    name: field.name,
    required: field.required,
  };

  if (field.type === "textarea") {
    return (
      <Textarea
        {...commonProps}
        defaultValue={fieldValue(record ?? null, field)}
        className="min-h-24"
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <Select {...commonProps} defaultValue={fieldValue(record ?? null, field) || "true"}>
        <option value="true">Aktif / Ya</option>
        <option value="false">Nonaktif / Tidak</option>
      </Select>
    );
  }

  if (field.type === "select") {
    return (
      <Select {...commonProps} defaultValue={fieldValue(record ?? null, field)}>
        <option value="">Pilih {field.label}</option>
        {field.relation
          ? options[field.relation]?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : null}
      </Select>
    );
  }

  return (
    <Input
      {...commonProps}
      type={field.type === "email" ? "email" : field.type === "text" ? "text" : "number"}
      step={field.type === "money" || field.type === "number" ? "0.01" : undefined}
      defaultValue={fieldValue(record ?? null, field)}
    />
  );
}

function MasterFormFields({
  config,
  record,
  options,
}: {
  config: MasterConfig;
  record?: MasterRecord | null;
  options: MasterOptionMap;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {config.fields.map((field) => (
        <div
          key={field.name}
          className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
        >
          <Label htmlFor={`${record?.id ?? "new"}-${field.name}`}>
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </Label>
          <MasterInput field={field} record={record} options={options} />
        </div>
      ))}
    </div>
  );
}

function CreateModal({
  config,
  options,
}: {
  config: MasterConfig;
  options: MasterOptionMap;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createMasterDataAction.bind(null, config.slug),
    initialActionState,
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Tambah Data
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Tutup modal"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Tambah {config.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{config.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form action={formAction} className="space-y-5">
              {state.message ? (
                <div
                  className={
                    state.success
                      ? "rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                      : "rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                  }
                >
                  {state.message}
                </div>
              ) : null}
              <MasterFormFields config={config} options={options} />
              <Button type="submit" disabled={pending}>
                {pending ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function EditModal({
  config,
  record,
  options,
}: {
  config: MasterConfig;
  record: MasterRecord;
  options: MasterOptionMap;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Edit3 className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Tutup modal"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Edit {config.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Perbarui data master yang dipilih.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form
              action={updateMasterDataAction.bind(null, config.slug, record.id)}
              className="space-y-5"
            >
              <MasterFormFields config={config} record={record} options={options} />
              <Button type="submit">Simpan Perubahan</Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DeleteButton({ config, record }: { config: MasterConfig; record: MasterRecord }) {
  return (
    <form
      action={deleteMasterDataAction.bind(null, config.slug, record.id)}
      onSubmit={(event) => {
        if (!confirm("Hapus data master ini?")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}

function buildMasterDataHref({
  slug,
  search,
  page,
  pageSize,
}: {
  slug: string;
  search: string;
  page: number;
  pageSize: number;
}) {
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== 10) params.set("perPage", String(pageSize));

  const query = params.toString();
  return `/admin/master-data/${slug}${query ? `?${query}` : ""}`;
}

function PaginationLink({
  href,
  disabled,
  children,
  label,
}: {
  href: string;
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
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      {children}
    </Link>
  );
}

function MasterDataPagination({
  config,
  search,
  page,
  pageSize,
  totalRecords,
  visibleRecords,
}: {
  config: MasterConfig;
  search: string;
  page: number;
  pageSize: number;
  totalRecords: number;
  visibleRecords: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = totalRecords === 0 ? 0 : startRecord + visibleRecords - 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex flex-col gap-4 border-t border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Menampilkan{" "}
        <span className="font-semibold text-slate-700">
          {startRecord}-{endRecord}
        </span>{" "}
        dari <span className="font-semibold text-slate-700">{totalRecords}</span> data
      </p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm font-semibold text-slate-600">
          Halaman {currentPage} / {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <PaginationLink
            href={buildMasterDataHref({
              slug: config.slug,
              search,
              page: 1,
              pageSize,
            })}
            disabled={!hasPrevious}
            label="Halaman pertama"
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
          <PaginationLink
            href={buildMasterDataHref({
              slug: config.slug,
              search,
              page: Math.max(1, currentPage - 1),
              pageSize,
            })}
            disabled={!hasPrevious}
            label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
          <PaginationLink
            href={buildMasterDataHref({
              slug: config.slug,
              search,
              page: Math.min(totalPages, currentPage + 1),
              pageSize,
            })}
            disabled={!hasNext}
            label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
          <PaginationLink
            href={buildMasterDataHref({
              slug: config.slug,
              search,
              page: totalPages,
              pageSize,
            })}
            disabled={!hasNext}
            label="Halaman terakhir"
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </div>
      </div>
    </div>
  );
}

export function MasterDataManager({
  config,
  records,
  options,
  search = "",
  page,
  pageSize,
  totalRecords,
}: {
  config: MasterConfig;
  records: MasterRecord[];
  options: MasterOptionMap;
  search?: string;
  page: number;
  pageSize: number;
  totalRecords: number;
}) {
  const router = useRouter();
  const [isTablePending, startTableTransition] = useTransition();
  const tableFields = config.fields.filter((field) => field.table);
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);

  function navigateTable(formData: FormData, nextPageSize = pageSize) {
    const formSearch = formData.get("q");
    const nextSearch = typeof formSearch === "string" ? formSearch.trim() : search;

    startTableTransition(() => {
      router.push(
        buildMasterDataHref({
          slug: config.slug,
          search: nextSearch,
          page: 1,
          pageSize: nextPageSize,
        }),
      );
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTable(new FormData(event.currentTarget));
  }

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextPageSize = Number(event.currentTarget.value) || 10;
    const form = event.currentTarget.form;

    navigateTable(form ? new FormData(form) : new FormData(), nextPageSize);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
            {config.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 md:text-base">
            {config.description}
          </p>
        </div>
        <CreateModal config={config} options={options} />
      </div>

      <Card className="rounded-[1.75rem]">
        <CardContent className="p-5">
          <form
            method="get"
            onSubmit={handleSearchSubmit}
            className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end"
          >
            <div className="space-y-2 lg:max-w-3xl">
              <Label htmlFor="q">Cari Data</Label>
              <Input
                id="q"
                name="q"
                defaultValue={search}
                placeholder={`Cari ${config.title.toLowerCase()}...`}
                className="h-12"
              />
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
              {search ? (
                <Link
                  href={`/admin/master-data/${config.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white px-6 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {records.length === 0 ? (
        <EmptyState
          title={search ? "Data tidak ditemukan." : "Belum ada data master."}
          description={
            search
              ? "Coba gunakan kata kunci lain atau reset pencarian."
              : "Tambahkan data pertama melalui tombol Tambah Data."
          }
        />
      ) : null}

      {records.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Tabel {config.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `Hasil pencarian untuk "${search}"`
                  : "Data terbaru ditampilkan lebih dulu."}
              </p>
            </div>
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              {totalRecords.toLocaleString("id-ID")} data
            </Badge>
          </div>
          <div className="[&_table]:min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
                  <TableHead className="w-16 whitespace-nowrap text-center">No</TableHead>
                  {tableFields.map((field) => (
                    <TableHead key={field.name} className="min-w-[150px] whitespace-nowrap">
                      {field.label}
                    </TableHead>
                  ))}
                  <TableHead className="sticky right-0 min-w-[170px] bg-emerald-50/95 text-right shadow-[-12px_0_18px_-20px_rgba(15,23,42,0.55)]">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id} className="odd:bg-white even:bg-emerald-50/25">
                    <TableCell className="w-16 text-center text-sm font-semibold text-slate-400">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    {tableFields.map((field) => (
                      <TableCell
                        key={field.name}
                        className="min-w-[150px] max-w-[260px] whitespace-nowrap"
                      >
                        <span className="block truncate">
                          {formatValue(field, record[field.name], options)}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="sticky right-0 bg-inherit shadow-[-12px_0_18px_-20px_rgba(15,23,42,0.55)]">
                      <div className="flex justify-end gap-2">
                        <EditModal config={config} record={record} options={options} />
                        <DeleteButton config={config} record={record} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <MasterDataPagination
            config={config}
            search={search}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            visibleRecords={records.length}
          />
        </div>
      ) : null}
    </div>
  );
}
