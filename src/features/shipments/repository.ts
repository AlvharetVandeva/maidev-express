import { sql } from "@/lib/db";
import {
  type CreateShipmentData,
  type Shipment,
  type ShipmentFilters,
  type ShipmentLog,
  type ShipmentStatus,
} from "@/features/shipments/types";

type ShipmentRow = {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string | null;
  receiver_name: string;
  receiver_phone: string | null;
  pickup_address: string;
  destination_address: string;
  origin_city: string | null;
  destination_city: string | null;
  status: ShipmentStatus;
  courier_id: number | null;
  customer_id: number | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

type ShipmentLogRow = {
  id: number;
  shipment_id: number;
  status: ShipmentStatus;
  note: string | null;
  location: string | null;
  updated_by: number | null;
  created_at: string;
};

function mapShipment(row: ShipmentRow): Shipment {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    pickupAddress: row.pickup_address,
    destinationAddress: row.destination_address,
    originCity: row.origin_city,
    destinationCity: row.destination_city,
    status: row.status,
    courierId: row.courier_id,
    customerId: row.customer_id,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapShipmentLog(row: ShipmentLogRow): ShipmentLog {
  return {
    id: row.id,
    shipmentId: row.shipment_id,
    status: row.status,
    note: row.note,
    location: row.location,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
  };
}

function generateTrackingNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const suffix = `${date.getTime()}`.slice(-6);
  return `CKL-${y}-${suffix}`;
}

export async function getAllShipments(filters: ShipmentFilters = {}) {
  const conditions = [];

  if (filters.status && filters.status !== "all") {
    conditions.push(sql`status = ${filters.status}`);
  }

  if (filters.search) {
    const keyword = `%${filters.search}%`;
    conditions.push(sql`(
      tracking_number ILIKE ${keyword}
      OR sender_name ILIKE ${keyword}
      OR receiver_name ILIKE ${keyword}
      OR destination_city ILIKE ${keyword}
    )`);
  }

  const where =
    conditions.length > 0
      ? conditions.reduce((left, right) => sql`${left} AND ${right}`)
      : sql`TRUE`;

  const rows = await sql<ShipmentRow[]>`
    SELECT *
    FROM shipments
    WHERE ${where}
    ORDER BY created_at DESC
  `;

  return rows.map(mapShipment);
}

export async function getShipmentById(id: number) {
  const rows = await sql<ShipmentRow[]>`
    SELECT *
    FROM shipments
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapShipment(rows[0]) : null;
}

export async function getShipmentByTrackingNumber(trackingNumber: string) {
  const rows = await sql<ShipmentRow[]>`
    SELECT *
    FROM shipments
    WHERE tracking_number = ${trackingNumber}
    LIMIT 1
  `;

  return rows[0] ? mapShipment(rows[0]) : null;
}

export async function getShipmentsByCourierId(courierId: number) {
  const rows = await sql<ShipmentRow[]>`
    SELECT *
    FROM shipments
    WHERE courier_id = ${courierId}
    ORDER BY updated_at DESC
  `;

  return rows.map(mapShipment);
}

export async function getShipmentsByCustomerId(customerId: number) {
  const rows = await sql<ShipmentRow[]>`
    SELECT *
    FROM shipments
    WHERE customer_id = ${customerId}
    ORDER BY updated_at DESC
  `;

  return rows.map(mapShipment);
}

export async function createShipment(data: CreateShipmentData) {
  const trackingNumber = generateTrackingNumber();
  const rows = await sql<ShipmentRow[]>`
    INSERT INTO shipments (
      tracking_number,
      sender_name,
      sender_phone,
      receiver_name,
      receiver_phone,
      pickup_address,
      destination_address,
      origin_city,
      destination_city,
      courier_id,
      customer_id,
      created_by
    )
    VALUES (
      ${trackingNumber},
      ${data.senderName},
      ${data.senderPhone ?? null},
      ${data.receiverName},
      ${data.receiverPhone ?? null},
      ${data.pickupAddress},
      ${data.destinationAddress},
      ${data.originCity ?? null},
      ${data.destinationCity ?? null},
      ${data.courierId ?? null},
      ${data.customerId ?? null},
      ${data.createdBy ?? null}
    )
    RETURNING *
  `;

  return mapShipment(rows[0]);
}

export async function assignCourier(shipmentId: number, courierId: number | null) {
  const rows = await sql<ShipmentRow[]>`
    UPDATE shipments
    SET courier_id = ${courierId}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${shipmentId}
    RETURNING *
  `;

  return rows[0] ? mapShipment(rows[0]) : null;
}

export async function updateShipmentStatus(shipmentId: number, status: ShipmentStatus) {
  const rows = await sql<ShipmentRow[]>`
    UPDATE shipments
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${shipmentId}
    RETURNING *
  `;

  return rows[0] ? mapShipment(rows[0]) : null;
}

export async function createShipmentLog(data: {
  shipmentId: number;
  status: ShipmentStatus;
  note?: string | null;
  location?: string | null;
  updatedBy?: number | null;
}) {
  const rows = await sql<ShipmentLogRow[]>`
    INSERT INTO shipment_logs (shipment_id, status, note, location, updated_by)
    VALUES (
      ${data.shipmentId},
      ${data.status},
      ${data.note ?? null},
      ${data.location ?? null},
      ${data.updatedBy ?? null}
    )
    RETURNING *
  `;

  return mapShipmentLog(rows[0]);
}

export async function getShipmentLogs(shipmentId: number) {
  const rows = await sql<ShipmentLogRow[]>`
    SELECT *
    FROM shipment_logs
    WHERE shipment_id = ${shipmentId}
    ORDER BY created_at ASC
  `;

  return rows.map(mapShipmentLog);
}
