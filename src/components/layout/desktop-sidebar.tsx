"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { navigationByRole } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/roles";

export function DesktopSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] border-r border-emerald-100 bg-white/90 px-5 py-6 backdrop-blur lg:block">
      <Logo />
      <nav className="mt-10 space-y-2">
        {navigationByRole[role].map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/tracking" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
