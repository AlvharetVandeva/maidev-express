"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useTransition, useState } from "react";
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import {
  createCargoShipmentAction,
  deleteCargoShipmentAction,
  updateCargoShipmentAction,
} from "@/features/cargo/actions";
import {
  cargoItemStatuses,
  cargoStatuses,
  CARGO_ITEM_STATUS_CLASS,
  CARGO_ITEM_STATUS_LABEL,
  CARGO_STATUS_CLASS,
  CARGO_STATUS_LABEL,
  isCargoStatus,
  PAYMENT_STATUS_CLASS,
  PAYMENT_STATUS_LABEL,
  paymentStatuses,
  type CargoFormOptions,
  type CargoItemStatus,
  type CargoShipment,
  type CargoStatus,
  type PaymentStatus,
} from "@/features/cargo/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatDate, initialActionState } from "@/lib/utils";

type CargoFilterStatus = CargoStatus | "all";

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function CargoStatusBadge({ status }: { status: CargoStatus }) {
  return <Badge className={CARGO_STATUS_CLASS[status]}>{CARGO_STATUS_LABEL[status]}</Badge>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge className={PAYMENT_STATUS_CLASS[status]}>
      {PAYMENT_STATUS_LABEL[status]}
    </Badge>
  );
}

function CargoItemStatusBadge({ status }: { status: CargoItemStatus }) {
  return (
    <Badge className={CARGO_ITEM_STATUS_CLASS[status]}>
      {CARGO_ITEM_STATUS_LABEL[status]}
    </Badge>
  );
}

function FieldError({
  name,
  errors,
}: {
  name: string;
  errors?: Record<string, string[]>;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;

  return <p className="text-xs font-semibold text-red-600">{message}</p>;
}

function textValue(value: string | number | null | undefined, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function CargoFormFields({
  record,
  options,
  errors,
}: {
  record?: CargoShipment | null;
  options: CargoFormOptions;
  errors?: Record<string, string[]>;
}) {
  const [kotaAsalId, setKotaAsalId] = useState(textValue(record?.kotaAsalId));
  const [kotaTujuanId, setKotaTujuanId] = useState(textValue(record?.kotaTujuanId));
  const [jenisPengirimanId, setJenisPengirimanId] = useState(
    textValue(record?.jenisPengirimanId),
  );
  const [beratBarang, setBeratBarang] = useState(
    record ? textValue(record.beratBarang) : "",
  );
  const selectedTariff = useMemo(() => {
    const asalId = Number(kotaAsalId);
    const tujuanId = Number(kotaTujuanId);
    const jenisId = Number(jenisPengirimanId);

    if (!asalId || !tujuanId || !jenisId) return null;

    return (
      options.tarifPengiriman.find(
        (tarif) =>
          tarif.kotaAsalId === asalId &&
          tarif.kotaTujuanId === tujuanId &&
          tarif.jenisPengirimanId === jenisId,
      ) ?? null
    );
  }, [jenisPengirimanId, kotaAsalId, kotaTujuanId, options.tarifPengiriman]);
  const calculatedTariff = useMemo(() => {
    const berat = Number(beratBarang);

    if (!selectedTariff || !Number.isFinite(berat) || berat <= 0) return "";

    const beratTagihan = Math.max(berat, selectedTariff.beratMinimumKg);
    return Math.round(
      selectedTariff.hargaDasar + beratTagihan * selectedTariff.hargaPerKg,
    ).toString();
  }, [beratBarang, selectedTariff]);
  const routeReady = Boolean(kotaAsalId && kotaTujuanId && jenisPengirimanId);
  const showTariffMissing = routeReady && !selectedTariff;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="pelangganId">Pelanggan</Label>
        <Select
          id="pelangganId"
          name="pelangganId"
          defaultValue={textValue(record?.pelangganId)}
        >
          <option value="">Tanpa pelanggan</option>
          {options.pelanggan.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="pelangganId" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggalKirim">Tanggal Kirim *</Label>
        <Input
          id="tanggalKirim"
          name="tanggalKirim"
          type="date"
          defaultValue={record?.tanggalKirim ?? todayInputValue()}
          required
        />
        <FieldError name="tanggalKirim" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="namaPengirim">Nama Pengirim *</Label>
        <Input
          id="namaPengirim"
          name="namaPengirim"
          defaultValue={textValue(record?.namaPengirim)}
          required
        />
        <FieldError name="namaPengirim" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teleponPengirim">No Telepon Pengirim</Label>
        <Input
          id="teleponPengirim"
          name="teleponPengirim"
          defaultValue={textValue(record?.teleponPengirim)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="namaPenerima">Nama Penerima *</Label>
        <Input
          id="namaPenerima"
          name="namaPenerima"
          defaultValue={textValue(record?.namaPenerima)}
          required
        />
        <FieldError name="namaPenerima" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teleponPenerima">No Telepon Penerima *</Label>
        <Input
          id="teleponPenerima"
          name="teleponPenerima"
          defaultValue={textValue(record?.teleponPenerima)}
          required
        />
        <FieldError name="teleponPenerima" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kotaAsalId">Kota Asal *</Label>
        <Select
          id="kotaAsalId"
          name="kotaAsalId"
          value={kotaAsalId}
          onChange={(event) => setKotaAsalId(event.currentTarget.value)}
          required
        >
          <option value="">Pilih kota asal</option>
          {options.kota.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="kotaAsalId" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kotaTujuanId">Kota Tujuan *</Label>
        <Select
          id="kotaTujuanId"
          name="kotaTujuanId"
          value={kotaTujuanId}
          onChange={(event) => setKotaTujuanId(event.currentTarget.value)}
          required
        >
          <option value="">Pilih kota tujuan</option>
          {options.kota.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="kotaTujuanId" errors={errors} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="alamatPickup">Alamat Pickup *</Label>
        <Textarea
          id="alamatPickup"
          name="alamatPickup"
          defaultValue={textValue(record?.alamatPickup)}
          required
        />
        <FieldError name="alamatPickup" errors={errors} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="alamatTujuan">Alamat Tujuan *</Label>
        <Textarea
          id="alamatTujuan"
          name="alamatTujuan"
          defaultValue={textValue(record?.alamatTujuan)}
          required
        />
        <FieldError name="alamatTujuan" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barangId">Jenis Barang *</Label>
        <Select
          id="barangId"
          name="barangId"
          defaultValue={textValue(record?.barangId)}
          required
        >
          <option value="">Pilih barang</option>
          {options.barang.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="barangId" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jumlahBarang">Jumlah Barang *</Label>
        <Input
          id="jumlahBarang"
          name="jumlahBarang"
          type="number"
          min="1"
          step="1"
          defaultValue={textValue(record?.jumlahBarang, "1")}
          required
        />
        <FieldError name="jumlahBarang" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="beratBarang">Berat Barang (kg) *</Label>
        <Input
          id="beratBarang"
          name="beratBarang"
          type="number"
          min="0.01"
          step="0.01"
          value={beratBarang}
          onChange={(event) => setBeratBarang(event.currentTarget.value)}
          required
        />
        <FieldError name="beratBarang" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jenisPengirimanId">Jenis Pengiriman *</Label>
        <Select
          id="jenisPengirimanId"
          name="jenisPengirimanId"
          value={jenisPengirimanId}
          onChange={(event) => setJenisPengirimanId(event.currentTarget.value)}
          required
        >
          <option value="">Pilih jenis pengiriman</option>
          {options.jenisPengiriman.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="jenisPengirimanId" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hargaPengiriman">Harga/Tarif Pengiriman *</Label>
        <Input
          id="hargaPengiriman"
          name="hargaPengiriman"
          type="number"
          min="1"
          step="100"
          value={calculatedTariff}
          readOnly
          aria-invalid={showTariffMissing || undefined}
          className={
            showTariffMissing
              ? "border-red-200 bg-red-50 text-red-700 focus:border-red-300 focus:ring-red-100"
              : "bg-emerald-50/80 font-semibold text-emerald-800"
          }
          required
        />
        {selectedTariff ? (
          <p className="text-xs font-medium text-emerald-700">
            Tarif otomatis: dasar {formatMoney(selectedTariff.hargaDasar)} +{" "}
            {formatMoney(selectedTariff.hargaPerKg)}/kg, minimum{" "}
            {selectedTariff.beratMinimumKg.toLocaleString("id-ID")} kg.
          </p>
        ) : null}
        {showTariffMissing ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            Tarif untuk kota asal, kota tujuan, dan jenis pengiriman ini belum ada.
            Tambahkan terlebih dahulu di menu Data Master - Tarif Pengiriman.
          </div>
        ) : null}
        <FieldError name="hargaPengiriman" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="biayaAsuransi">Biaya Asuransi</Label>
        <Input
          id="biayaAsuransi"
          name="biayaAsuransi"
          type="number"
          min="0"
          step="100"
          defaultValue={textValue(record?.biayaAsuransi, "0")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kendaraanId">Kendaraan *</Label>
        <Select
          id="kendaraanId"
          name="kendaraanId"
          defaultValue={textValue(record?.kendaraanId)}
          required
        >
          <option value="">Pilih kendaraan</option>
          {options.kendaraan.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError name="kendaraanId" errors={errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kurirId">Kurir</Label>
        <Select id="kurirId" name="kurirId" defaultValue={textValue(record?.kurirId)}>
          <option value="">Belum assign</option>
          {options.kurir.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status Pengiriman *</Label>
        <Select id="status" name="status" defaultValue={record?.status ?? "menunggu_pickup"}>
          {cargoStatuses.map((status) => (
            <option key={status} value={status}>
              {CARGO_STATUS_LABEL[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="statusBarang">Status Barang *</Label>
        <Select
          id="statusBarang"
          name="statusBarang"
          defaultValue={record?.statusBarang ?? "diproses"}
        >
          {cargoItemStatuses.map((status) => (
            <option key={status} value={status}>
              {CARGO_ITEM_STATUS_LABEL[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="statusPembayaran">Status Transaksi *</Label>
        <Select
          id="statusPembayaran"
          name="statusPembayaran"
          defaultValue={record?.statusPembayaran ?? "belum_dibayar"}
        >
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {PAYMENT_STATUS_LABEL[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="catatanBarang">Deskripsi/Catatan Barang</Label>
        <Textarea
          id="catatanBarang"
          name="catatanBarang"
          defaultValue={textValue(record?.catatanBarang)}
          className="min-h-24"
        />
      </div>
    </div>
  );
}

function CreateCargoModal({ options }: { options: CargoFormOptions }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createCargoShipmentAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Tambah Cargo
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Tutup modal"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-5xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Tambah Data Cargo
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Nomor resi dibuat otomatis saat data disimpan.
                </p>
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
              <CargoFormFields options={options} errors={state.errors} />
              <Button type="submit" disabled={pending}>
                {pending ? "Menyimpan..." : "Simpan Data Cargo"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function EditCargoModal({
  record,
  options,
}: {
  record: CargoShipment;
  options: CargoFormOptions;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateCargoShipmentAction.bind(null, record.id),
    initialActionState,
  );

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Edit3 className="h-4 w-4" />
        Edit
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Tutup modal"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-5xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Edit {record.nomorResi}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Data lama sudah dimuat pada form dan siap diperbarui.
                </p>
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
              <CargoFormFields record={record} options={options} errors={state.errors} />
              <Button type="submit" disabled={pending}>
                {pending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DeleteCargoButton({ record }: { record: CargoShipment }) {
  return (
    <form
      action={deleteCargoShipmentAction.bind(null, record.id)}
      onSubmit={(event) => {
        if (!confirm(`Hapus pengiriman ${record.nomorResi}?`)) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        <Trash2 className="h-4 w-4" />
        Hapus
      </Button>
    </form>
  );
}

function buildCargoHref({
  search,
  status,
  page,
  pageSize,
}: {
  search: string;
  status: CargoFilterStatus;
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

function CargoPagination({
  search,
  status,
  page,
  pageSize,
  totalRecords,
  visibleRecords,
  onNavigate,
}: {
  search: string;
  status: CargoFilterStatus;
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
    return buildCargoHref({ search, status, page: nextPage, pageSize });
  }

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

export function CargoAdminManager({
  shipments,
  options,
  search,
  status,
  page,
  pageSize,
  totalRecords,
}: {
  shipments: CargoShipment[];
  options: CargoFormOptions;
  search: string;
  status: CargoFilterStatus;
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
      typeof formStatus === "string" && (formStatus === "all" || isCargoStatus(formStatus))
        ? (formStatus as CargoFilterStatus)
        : status;

    navigateToHref(
      buildCargoHref({
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
            CRUDS Cargo
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 md:text-base">
            Kelola create, read, update, delete, dan search data cargo sesuai kebutuhan UGD SIWEB.
          </p>
        </div>
        <CreateCargoModal options={options} />
      </div>

      <Card className="rounded-[1.75rem]">
        <CardContent className="p-5">
          <form
            onSubmit={handleFilterSubmit}
            className="grid gap-3 lg:grid-cols-[1fr_220px_150px_auto] lg:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="q">Cari Cargo</Label>
              <Input
                id="q"
                name="q"
                defaultValue={search}
                placeholder="No resi, pengirim, penerima, nama barang"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Pengiriman</Label>
              <Select
                id="status"
                name="status"
                defaultValue={status}
                disabled={isTablePending}
                onChange={handleStatusChange}
                className="h-12"
              >
                <option value="all">Semua Status</option>
                {cargoStatuses.map((item) => (
                  <option key={item} value={item}>
                    {CARGO_STATUS_LABEL[item]}
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
                {isTablePending ? "Memuat..." : "Cari"}
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

      {shipments.length === 0 ? (
        <EmptyState
          title={search ? "Data cargo tidak ditemukan." : "Belum ada data cargo."}
          description={
            search
              ? "Coba cari dengan no resi, nama pengirim, nama penerima, atau nama barang lain."
              : "Tambahkan transaksi cargo pertama melalui tombol Tambah Cargo."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Tabel Pengiriman Cargo
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `Hasil pencarian untuk "${search}"`
                  : "Data terbaru ditampilkan lebih dulu dari database."}
              </p>
            </div>
            <Badge className="w-fit bg-emerald-100 text-emerald-700">
              {totalRecords.toLocaleString("id-ID")} data
            </Badge>
          </div>

          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead className="min-w-[240px]">Pengiriman</TableHead>
                  <TableHead className="min-w-[190px]">Barang</TableHead>
                  <TableHead className="min-w-[190px]">Rute</TableHead>
                  <TableHead className="min-w-[220px]">Kendaraan</TableHead>
                  <TableHead className="min-w-[190px]">Status</TableHead>
                  <TableHead className="min-w-[160px] text-right">Tarif</TableHead>
                  <TableHead className="min-w-[180px] text-right">Aksi</TableHead>
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
                          {shipment.nomorResi}
                        </p>
                        <p className="text-sm text-slate-500">
                          {shipment.namaPengirim} ke {shipment.namaPenerima}
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                          {formatDate(shipment.tanggalKirim)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700">
                          {shipment.semuaBarang ?? shipment.namaBarang ?? "-"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {shipment.beratBarang.toLocaleString("id-ID")} kg
                        </p>
                        <CargoItemStatusBadge status={shipment.statusBarang} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-700">
                          {shipment.kotaAsalLabel}
                        </p>
                        <p className="text-slate-500">{shipment.kotaTujuanLabel}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-700">
                          {shipment.kodeKendaraan ?? "-"} {shipment.nomorPolisi ? `- ${shipment.nomorPolisi}` : ""}
                        </p>
                        <p className="text-slate-500">
                          {shipment.jenisKendaraan ?? "-"} - {shipment.kapasitasKg?.toLocaleString("id-ID") ?? "-"} kg
                        </p>
                        <Badge
                          className={
                            shipment.kendaraanAktif
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        >
                          {shipment.kendaraanAktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <CargoStatusBadge status={shipment.status} />
                        <PaymentStatusBadge status={shipment.statusPembayaran} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-900">
                          {formatMoney(shipment.hargaPengiriman)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Total {formatMoney(shipment.totalBiaya)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <EditCargoModal record={shipment} options={options} />
                        <DeleteCargoButton record={shipment} />
                      </div>
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
                          {shipment.nomorResi}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {shipment.namaPengirim} ke {shipment.namaPenerima}
                        </p>
                      </div>
                      <CargoStatusBadge status={shipment.status} />
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="grid gap-3 text-sm">
                      <p className="flex gap-2 text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <span>{shipment.kotaAsalLabel} ke {shipment.kotaTujuanLabel}</span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-600">
                        <Truck className="h-4 w-4 text-emerald-700" />
                        {shipment.kodeKendaraan ?? "-"} - {shipment.nomorPolisi ?? "-"}
                      </p>
                      <p className="flex items-center gap-2 text-slate-500">
                        <CalendarDays className="h-4 w-4 text-emerald-700" />
                        {formatDate(shipment.tanggalKirim)}
                      </p>
                    </div>

                    <div className="grid gap-2 rounded-2xl bg-emerald-50/60 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Barang</span>
                        <span className="text-right font-semibold text-slate-800">
                          {shipment.semuaBarang ?? shipment.namaBarang ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Berat</span>
                        <span className="font-semibold text-slate-800">
                          {shipment.beratBarang.toLocaleString("id-ID")} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Tarif</span>
                        <span className="font-semibold text-slate-800">
                          {formatMoney(shipment.hargaPengiriman)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <CargoItemStatusBadge status={shipment.statusBarang} />
                      <PaymentStatusBadge status={shipment.statusPembayaran} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <EditCargoModal record={shipment} options={options} />
                      <DeleteCargoButton record={shipment} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <CargoPagination
            search={search}
            status={status}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            visibleRecords={shipments.length}
            onNavigate={navigateToHref}
          />
        </div>
      )}
    </div>
  );
}
