import { sql } from "@/lib/db";
import type { ChartPoint, DashboardStats, RecentActivity } from "@/features/dashboard/types";

type StatsRow = {
  total: number;
  active: number;
  completed: number;
  failed: number;
};

type ActivityRow = {
  id: number;
  tracking_number: string;
  receiver_name: string;
  status: string;
  updated_at: string;
};

type ChartRow = {
  label: string;
  total: number;
};

function mapStats(row?: StatsRow): DashboardStats {
  return {
    total: Number(row?.total ?? 0),
    active: Number(row?.active ?? 0),
    completed: Number(row?.completed ?? 0),
    failed: Number(row?.failed ?? 0),
  };
}

function mapActivity(row: ActivityRow): RecentActivity {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    receiverName: row.receiver_name,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

export async function getAdminStats() {
  const rows = await sql<StatsRow[]>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status IN ('menunggu_pickup', 'diambil_kurir', 'dalam_perjalanan'))::int AS active,
      COUNT(*) FILTER (WHERE status = 'selesai')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'gagal')::int AS failed
    FROM shipments
  `;

  return mapStats(rows[0]);
}

export async function getCourierStats(courierId: number) {
  const rows = await sql<StatsRow[]>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'menunggu_pickup')::int AS active,
      COUNT(*) FILTER (WHERE status = 'selesai')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'gagal')::int AS failed
    FROM shipments
    WHERE courier_id = ${courierId}
  `;

  return mapStats(rows[0]);
}

export async function getCustomerStats(customerId: number) {
  const rows = await sql<StatsRow[]>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status IN ('menunggu_pickup', 'diambil_kurir', 'dalam_perjalanan'))::int AS active,
      COUNT(*) FILTER (WHERE status = 'selesai')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'gagal')::int AS failed
    FROM shipments
    WHERE customer_id = ${customerId}
  `;

  return mapStats(rows[0]);
}

export async function getRecentShipmentActivities(limit = 5) {
  const rows = await sql<ActivityRow[]>`
    SELECT id, tracking_number, receiver_name, status, updated_at
    FROM shipments
    ORDER BY updated_at DESC
    LIMIT ${limit}
  `;

  return rows.map(mapActivity);
}

export async function getShipmentChartData(days = 7): Promise<ChartPoint[]> {
  const rows = await sql<ChartRow[]>`
    SELECT to_char(day::date, 'DD Mon') AS label, COUNT(s.id)::int AS total
    FROM generate_series(
      CURRENT_DATE - (${days - 1} || ' days')::interval,
      CURRENT_DATE,
      '1 day'
    ) day
    LEFT JOIN shipments s ON DATE(s.created_at) = day::date
    GROUP BY day
    ORDER BY day ASC
  `;

  return rows.map((row) => ({ label: row.label, total: Number(row.total) }));
}
