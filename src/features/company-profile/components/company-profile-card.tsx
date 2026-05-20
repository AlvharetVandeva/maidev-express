import { Building2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile } from "@/features/company-profile/types";

export function CompanyProfileCard({ profile }: { profile: CompanyProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Perusahaan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
            <Building2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{profile.name}</h2>
            <p className="text-sm font-medium text-emerald-700">{profile.kind}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{profile.description}</p>
      </CardContent>
    </Card>
  );
}
