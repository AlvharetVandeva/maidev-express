"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ChevronDownIcon, navigationByRole } from "@/lib/navigation";
import type { UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  role: UserRole;
};

export function MobileDrawer({ open, onClose, role }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        className="absolute inset-0 bg-slate-900/30"
        aria-label="Tutup menu"
        onClick={onClose}
      />
      <div className="relative h-full w-[82vw] max-w-xs bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-8 space-y-2">
          {navigationByRole[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            if (item.children?.length) {
              const open = pathname.startsWith("/admin/master-data");

              return (
                <div key={item.href} className="space-y-2">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold",
                      open
                        ? "bg-emerald-500 text-white"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </span>
                    <ChevronDownIcon className={cn("h-4 w-4", open && "rotate-180")} />
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
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
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
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold",
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
