"use client";

import { useState } from "react";
import { Bell, LogOut } from "lucide-react";

import { logoutAction } from "@/features/auth/actions";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/roles";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
};

export function AppShell({ children, user }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50">
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        role={user.role}
      />
      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <DesktopSidebar role={user.role} />
        <div className="min-w-0 pb-24 lg:pb-0">
          <header className="hidden items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-8 py-5 backdrop-blur lg:flex">
            <div>
              <p className="text-sm font-medium text-emerald-700">Maidev Express</p>
              <p className="text-xl font-extrabold text-slate-900">Halo, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" aria-label="Notifikasi">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <form action={logoutAction}>
                <Button variant="ghost" size="icon" type="submit" aria-label="Keluar">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav role={user.role} />
    </div>
  );
}
