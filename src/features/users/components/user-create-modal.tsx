"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { UserForm } from "@/features/users/components/user-form";
import { Button } from "@/components/ui/button";

export function UserCreateModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Tambah User
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Tutup modal"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Tambah User</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Buat akun baru untuk admin, kurir, atau customer.
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
            <UserForm variant="plain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
