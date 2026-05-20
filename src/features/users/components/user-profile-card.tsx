import { Mail, Phone, UserRound } from "lucide-react";

import { RoleBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/features/users/types";

export function UserProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile User</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
            <UserRound className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="grid gap-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600" />
            {user.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-600" />
            {user.phone ?? "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
