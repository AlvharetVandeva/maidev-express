import type { CargoShipmentFormInput } from "@/features/cargo/schema";
import {
  createCargoShipment,
  deleteCargoShipment,
  getCargoFormOptions,
  listCargoShipments,
  updateCargoShipment,
} from "@/features/cargo/repository";
import type { CargoShipmentFilters } from "@/features/cargo/types";

export async function getAdminCargoShipments(filters: CargoShipmentFilters = {}) {
  return listCargoShipments(filters);
}

export async function getCargoOptions() {
  return getCargoFormOptions();
}

export async function createAdminCargoShipment(
  input: CargoShipmentFormInput,
  userId: number,
) {
  return createCargoShipment(input, userId);
}

export async function updateAdminCargoShipment(
  id: number,
  input: CargoShipmentFormInput,
  userId: number,
) {
  return updateCargoShipment(id, input, userId);
}

export async function removeAdminCargoShipment(id: number) {
  return deleteCargoShipment(id);
}
