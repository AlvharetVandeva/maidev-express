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
    <Card>
      <CardContent className="p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" action={action}>
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Nomor Resi</Label>
            <Input
              id="trackingNumber"
              name="resi"
              defaultValue={defaultValue}
              placeholder="Contoh: CKL-2026-0128"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">
              <Search className="h-4 w-4" />
              Lacak
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
