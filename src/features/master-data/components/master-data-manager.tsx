"use client";

import { useActionState, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";

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
  return relationValue ?? "-";
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
        Hapus
      </Button>
    </form>
  );
}

export function MasterDataManager({
  config,
  records,
  options,
}: {
  config: MasterConfig;
  records: MasterRecord[];
  options: MasterOptionMap;
}) {
  const tableFields = config.fields.filter((field) => field.table);

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

      <div className="hidden overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50/80 hover:bg-emerald-50/80">
              {tableFields.map((field) => (
                <TableHead key={field.name}>{field.label}</TableHead>
              ))}
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                {tableFields.map((field) => (
                  <TableCell key={field.name}>
                    {formatValue(field, record[field.name], options)}
                  </TableCell>
                ))}
                <TableCell>
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

      <div className="grid gap-4 lg:hidden">
        {records.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-700">
                    {config.title}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">
                    {record[config.codeField] ?? `ID ${record.id}`}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                {tableFields.slice(0, 5).map((field) => (
                  <div key={field.name}>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {field.label}
                    </p>
                    <div className="mt-1 font-semibold text-slate-700">
                      {formatValue(field, record[field.name], options)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <EditModal config={config} record={record} options={options} />
                <DeleteButton config={config} record={record} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
