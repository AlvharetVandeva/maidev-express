import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variant === "default"
          ? "bg-emerald-100 text-emerald-700"
          : "border border-emerald-100 bg-white text-slate-600",
        className,
      )}
      {...props}
    />
  );
}
