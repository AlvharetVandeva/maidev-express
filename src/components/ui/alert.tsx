import * as React from "react";

import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700",
        className,
      )}
      role="alert"
      {...props}
    />
  );
}
