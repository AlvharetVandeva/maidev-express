import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile } from "@/features/company-profile/types";

export function CompanyContactCard({ profile }: { profile: CompanyProfile }) {
  const items = [
    { icon: Phone, label: "WhatsApp", value: profile.phone },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: MapPin, label: "Alamat", value: profile.address },
    { icon: Clock, label: "Jam Operasional", value: profile.hours },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontak</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
