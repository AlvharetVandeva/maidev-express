import { redirect } from "next/navigation";

import { requireUser } from "@/lib/session";
import { roleProfilePath } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function ProfileRedirectPage() {
  const user = await requireUser();
  redirect(roleProfilePath[user.role]);
}
