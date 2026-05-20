"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { ShipmentForm } from "@/features/shipments/components/shipment-form";
import type { User } from "@/features/users/types";
import { Button } from "@/components/ui/button";

export function ShipmentCreateModal({
  couriers,
  customers,
}: {
  couriers: User[];
  customers: User[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Tambah Pengiriman
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
                  Tambah Pengiriman
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Input paket baru dan assign kurir jika sudah tersedia.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Tutup modal"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ShipmentForm couriers={couriers} customers={customers} variant="plain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
