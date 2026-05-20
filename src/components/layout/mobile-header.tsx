"use client";

import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-emerald-50/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={onMenuClick} aria-label="Buka menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Logo className="[&>div:last-child]:hidden" />
        <Button variant="outline" size="icon" aria-label="Notifikasi">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
