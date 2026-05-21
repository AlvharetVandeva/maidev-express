import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ShipmentTableSkeleton({ pageSize }: { pageSize: number }) {
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
