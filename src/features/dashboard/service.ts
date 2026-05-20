import {
  getAdminStats,
  getCourierStats,
  getCustomerStats,
  getRecentShipmentActivities,
  getShipmentChartData,
} from "@/features/dashboard/repository";
import { getShipmentsByCourierId, getShipmentsByCustomerId } from "@/features/shipments/repository";

export async function getAdminDashboardData() {
  const [stats, chartData, activities] = await Promise.all([
    getAdminStats(),
    getShipmentChartData(7),
    getRecentShipmentActivities(6),
  ]);

  return { stats, chartData, activities };
}

export async function getCourierDashboardData(courierId: number) {
  const [stats, tasks] = await Promise.all([
    getCourierStats(courierId),
    getShipmentsByCourierId(courierId),
  ]);

  return { stats, tasks: tasks.slice(0, 5) };
}

export async function getCustomerDashboardData(customerId: number) {
  const [stats, shipments] = await Promise.all([
    getCustomerStats(customerId),
    getShipmentsByCustomerId(customerId),
  ]);

  return { stats, shipments: shipments.slice(0, 5) };
}
