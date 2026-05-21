import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackingPageSkeleton() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-10 w-24" />
        </header>
        <section className="mb-8 space-y-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </section>
        <div className="space-y-8">
          <TrackingFormSkeleton />
          <TrackingResultSkeleton />
        </div>
      </div>
    </main>
  );
}

export function TrackingFormSkeleton() {
  return (
    <Card className="rounded-[1.75rem]">
      <CardContent className="grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full md:w-28" />
      </CardContent>
    </Card>
  );
}

export function TrackingResultSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.9fr]">
      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-3xl bg-emerald-50 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-56 max-w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-emerald-100 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-5 w-full max-w-44" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[32px_1fr] gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="mt-3 h-4 w-40" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
