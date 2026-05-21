import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PageHeaderSkeleton({ withDescription = true }: { withDescription?: boolean }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-56" />
      {withDescription ? <Skeleton className="h-4 w-full max-w-lg" /> : null}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="relative min-h-[136px] overflow-hidden border-emerald-100/80 shadow-[0_10px_28px_rgba(15,118,110,0.08)]">
      <Skeleton className="absolute inset-x-0 top-0 h-1 rounded-none" />
      <CardContent className="flex h-full min-h-[136px] items-center justify-between gap-5 p-6">
        <div className="min-w-0 space-y-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-14 w-14 shrink-0 rounded-[1.35rem]" />
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-end gap-3">
          {[48, 76, 54, 92, 68, 84, 60].map((height, index) => (
            <Skeleton
              key={index}
              className="flex-1 rounded-t-2xl rounded-b-md"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full max-w-44" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TrackingFormSkeleton() {
  return (
    <Card>
      <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full md:w-32" />
      </CardContent>
    </Card>
  );
}

function ShipmentListSkeleton() {
  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden rounded-3xl border border-emerald-100 bg-white lg:block">
        <div className="grid grid-cols-6 gap-4 border-b border-emerald-100 px-4 py-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-6 gap-4 border-b border-emerald-50 px-4 py-4 last:border-0"
          >
            {Array.from({ length: 6 }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={columnIndex === 4 ? "h-7 w-24 rounded-full" : "h-4 w-full"}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export function DashboardSkeleton({ variant = "admin" }: { variant?: "admin" | "courier" | "customer" }) {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      {variant === "admin" ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <ChartCardSkeleton />
          <ActivityCardSkeleton />
        </div>
      ) : null}
      {variant === "customer" ? (
        <div className="mt-6">
          <TrackingFormSkeleton />
        </div>
      ) : null}
      {variant !== "admin" ? (
        <div className="mt-6 space-y-4">
          <PageHeaderSkeleton withDescription={false} />
          <ShipmentListSkeleton />
        </div>
      ) : null}
    </>
  );
}
