"use client";

import { useActionState } from "react";

import { createUserAction } from "@/features/users/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { initialActionState } from "@/lib/utils";

export function UserForm({ variant = "card" }: { variant?: "card" | "plain" }) {
  const [state, formAction, pending] = useActionState(createUserAction, initialActionState);

  const form = (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {state.message ? (
        <Alert
          className={
            state.success
              ? "border-emerald-100 bg-emerald-50 text-emerald-700 md:col-span-2"
              : "md:col-span-2"
          }
        >
          {state.message}
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telepon</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select id="role" name="role" defaultValue="customer">
          <option value="admin">Admin</option>
          <option value="courier">Kurir</option>
          <option value="customer">Customer</option>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Tambah User"}
        </Button>
      </div>
    </form>
  );

  if (variant === "plain") {
    return form;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah User</CardTitle>
        <CardDescription>Buat akun baru untuk admin, kurir, atau customer.</CardDescription>
      </CardHeader>
      <CardContent>
        {form}
      </CardContent>
    </Card>
  );
}
