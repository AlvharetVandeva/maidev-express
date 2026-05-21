"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrackingResultSkeleton } from "@/features/shipments/components/tracking-skeleton";

export function TrackingForm({
  defaultValue = "",
  action = "/tracking",
  showResultSkeletonOnSubmit = false,
}: {
  defaultValue?: string;
  action?: string;
  showResultSkeletonOnSubmit?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const resi = String(formData.get("resi") ?? "").trim();
    const params = new URLSearchParams();

    if (resi) params.set("resi", resi);

    startTransition(() => {
      router.push(`${action}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <>
      <Card className="rounded-[1.75rem]">
        <CardContent className="p-4 sm:p-5">
          <form
            className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end"
            action={action}
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Nomor Resi</Label>
              <Input
                id="trackingNumber"
                name="resi"
                defaultValue={defaultValue}
                placeholder="Contoh: CKL-2026-0128"
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isPending} className="h-12 w-full px-6 md:w-auto">
              <Search className="h-4 w-4" />
              {isPending ? "Melacak..." : "Lacak"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {showResultSkeletonOnSubmit && isPending ? <TrackingResultSkeleton /> : null}
    </>
  );
}
