"use client";

import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/utils";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Masuk ke Maidev Express</CardTitle>
        <CardDescription>Kelola dan lacak pengiriman dengan mudah.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message && !state.success ? <Alert>{state.message}</Alert> : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@cargoku.test" />
            {state.errors?.email ? (
              <p className="text-xs text-red-600">{state.errors.email[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="password123" />
            {state.errors?.password ? (
              <p className="text-xs text-red-600">{state.errors.password[0]}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
