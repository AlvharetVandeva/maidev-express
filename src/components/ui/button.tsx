import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "icon";
};

const variants = {
  default: "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600",
  outline:
    "border border-emerald-100 bg-white text-slate-700 shadow-sm hover:bg-emerald-50",
  ghost: "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
  danger: "bg-red-500 text-white shadow-sm hover:bg-red-600",
};

const sizes = {
  default: "h-11 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
