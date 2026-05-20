import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CourierLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["courier"]);
  return <AppShell user={user}>{children}</AppShell>;
}
