import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton({ pageSize }: { pageSize: number }) {
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
