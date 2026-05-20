"use client";

import { useActionState } from "react";

import { createShipmentAction } from "@/features/shipments/actions";
import type { User } from "@/features/users/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/utils";

export function ShipmentForm({
  couriers,
  customers,
  variant = "card",
}: {
  couriers: User[];
  customers: User[];
  variant?: "card" | "plain";
}) {
  const [state, formAction, pending] = useActionState(createShipmentAction, initialActionState);

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
            <Label htmlFor="senderName">Nama Pengirim</Label>
            <Input id="senderName" name="senderName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderPhone">Telepon Pengirim</Label>
            <Input id="senderPhone" name="senderPhone" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiverName">Nama Penerima</Label>
            <Input id="receiverName" name="receiverName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiverPhone">Telepon Penerima</Label>
            <Input id="receiverPhone" name="receiverPhone" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="pickupAddress">Alamat Pickup</Label>
            <Textarea id="pickupAddress" name="pickupAddress" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="destinationAddress">Alamat Tujuan</Label>
            <Textarea id="destinationAddress" name="destinationAddress" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originCity">Kota Asal</Label>
            <Input id="originCity" name="originCity" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinationCity">Kota Tujuan</Label>
            <Input id="destinationCity" name="destinationCity" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courierId">Kurir</Label>
            <Select id="courierId" name="courierId" defaultValue="">
              <option value="">Belum assign</option>
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select id="customerId" name="customerId" defaultValue="">
              <option value="">Tanpa customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Menyimpan..." : "Tambah Pengiriman"}
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
        <CardTitle>Tambah Pengiriman</CardTitle>
        <CardDescription>Input paket baru dan assign kurir jika sudah tersedia.</CardDescription>
      </CardHeader>
      <CardContent>
        {form}
      </CardContent>
    </Card>
  );
}
