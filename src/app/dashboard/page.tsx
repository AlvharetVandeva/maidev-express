import { redirect } from "next/navigation";

import { requireUser } from "@/lib/session";
import { roleDashboardPath } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function DashboardRedirectPage() {
  const user = await requireUser();
  redirect(roleDashboardPath[user.role]);
}
