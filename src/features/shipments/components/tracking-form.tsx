import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TrackingForm({
  defaultValue = "",
  action = "/tracking",
}: {
  defaultValue?: string;
  action?: string;
}) {
  return (
    <Card className="rounded-[1.75rem]">
      <CardContent className="p-4 sm:p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end" action={action}>
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
          <Button type="submit" className="h-12 w-full px-6 md:w-auto">
            <Search className="h-4 w-4" />
            Lacak
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
