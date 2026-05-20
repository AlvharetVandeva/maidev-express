import { redirect } from "next/navigation";
import { CheckCircle2, Truck } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";
import { Logo } from "@/components/shared/logo";
import { verifySession } from "@/lib/session";
import { roleDashboardPath } from "@/lib/roles";

export default async function LoginPage() {
  const session = await verifySession();

  if (session) {
    redirect(roleDashboardPath[session.role]);
  }

  return (
    <main className="grid min-h-screen bg-emerald-50 p-4 lg:grid-cols-2 lg:p-8">
      <section className="hidden flex-col justify-between rounded-[2rem] bg-emerald-500 p-10 text-white lg:flex">
        <Logo className="[&_*]:text-white" />
        <div>
          <Truck className="h-24 w-24 text-emerald-100" aria-hidden="true" />
          <h1 className="mt-8 max-w-lg text-5xl font-extrabold tracking-normal">
            Kirim barangmu dengan aman dan tepat waktu.
          </h1>
          <div className="mt-8 grid gap-3">
            {["Role-based dashboard", "Tracking nomor resi", "Tugas kurir mobile"].map(
              (item) => (
                <p key={item} className="flex items-center gap-3 font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  {item}
                </p>
              ),
            )}
          </div>
        </div>
        <p className="text-sm text-emerald-50">Maidev Express untuk UMKM Indonesia.</p>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
