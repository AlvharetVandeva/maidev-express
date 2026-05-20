import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["customer"]);
  return <AppShell user={user}>{children}</AppShell>;
}
