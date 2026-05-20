"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { ChevronDownIcon, navigationByRole } from "@/lib/navigation";
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

          if (item.children?.length) {
            const open = pathname.startsWith("/admin/master-data");

            return (
              <div key={item.href} className="space-y-2">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    open
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </span>
                  <ChevronDownIcon
                    className={cn("h-4 w-4 transition", open && "rotate-180")}
                  />
                </Link>
                {open ? (
                  <div className="ml-4 space-y-1 border-l border-emerald-100 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                            childActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700",
                          )}
                        >
                          <ChildIcon className="h-4 w-4" aria-hidden="true" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

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
