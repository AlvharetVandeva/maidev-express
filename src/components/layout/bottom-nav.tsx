"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { bottomNavigationLabels, navigationByRole } from "@/lib/navigation";
import type { UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = navigationByRole[role].filter((item) =>
    bottomNavigationLabels.includes(item.label),
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white px-2 py-2 shadow-sm lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold",
                active ? "bg-emerald-50 text-emerald-700" : "text-slate-500",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
