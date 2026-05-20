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
  green: {
    icon: "bg-emerald-100 text-emerald-700",
    accent: "bg-emerald-500",
  },
  blue: {
    icon: "bg-sky-100 text-sky-700",
    accent: "bg-sky-500",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    accent: "bg-amber-500",
  },
  red: {
    icon: "bg-red-100 text-red-700",
    accent: "bg-red-500",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "green",
}: StatCardProps) {
  const toneClass = tones[tone];

  return (
    <Card className="relative min-h-[136px] overflow-hidden border-emerald-100/80 shadow-[0_10px_28px_rgba(15,118,110,0.08)]">
      <div className={cn("absolute inset-x-0 top-0 h-1", toneClass.accent)} />
      <CardContent className="flex h-full min-h-[136px] items-center justify-between gap-5 p-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-slate-500">{title}</p>
          <div className="mt-5 flex items-end gap-2">
            <p className="text-4xl font-extrabold leading-none text-slate-950">{value}</p>
            {description ? (
              <p className="pb-1 text-xs font-medium text-slate-400">{description}</p>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem]",
            toneClass.icon,
          )}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
