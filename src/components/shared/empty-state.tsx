import { PackageSearch } from "lucide-react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Belum ada paket yang perlu ditampilkan.",
  description = "Coba ubah filter atau cek kembali nomor resi Anda.",
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
        <PackageSearch className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      </div>
    </Card>
  );
}
