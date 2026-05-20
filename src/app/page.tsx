import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PackageSearch, ShieldCheck, Truck } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifySession } from "@/lib/session";
import { roleDashboardPath } from "@/lib/roles";

export default async function Home() {
  const session = await verifySession();

  if (session) {
    redirect(roleDashboardPath[session.role]);
  }

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/login">
            <Button>Masuk</Button>
          </Link>
        </header>
        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-emerald-700">
              Pengiriman darat untuk UMKM
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-normal text-slate-900 md:text-6xl">
              Maidev Express
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Kelola paket, tugas kurir, dan tracking resi dalam satu aplikasi
              ringan yang nyaman dipakai di desktop maupun HP.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tracking">
                <Button className="w-full sm:w-auto">
                  Lacak Paket
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Masuk Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="space-y-5 p-6">
              <div className="rounded-3xl bg-emerald-500 p-6 text-white">
                <Truck className="h-12 w-12" aria-hidden="true" />
                <p className="mt-8 text-2xl font-extrabold">CKL-2026-0128</p>
                <p className="text-emerald-50">Dalam Perjalanan ke Semarang</p>
              </div>
              {[
                { icon: PackageSearch, text: "Tracking cepat berdasarkan nomor resi" },
                { icon: ShieldCheck, text: "Akses aman berdasarkan role pengguna" },
                { icon: Truck, text: "Workflow tugas kurir dan status paket" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
                    <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-700">{item.text}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
