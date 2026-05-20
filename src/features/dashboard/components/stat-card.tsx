import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: "green" | "blue" | "amber" | "red";
};

const tones = {
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "green",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-3xl", tones[tone])}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        {description ? <p className="mt-3 text-sm text-slate-500">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
