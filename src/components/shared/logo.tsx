import { Truck } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
        <Truck className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-extrabold leading-tight text-slate-900">
          Maidev Express
        </p>
        <p className="text-xs font-medium text-emerald-700">Delivery UMKM</p>
      </div>
    </div>
  );
}
