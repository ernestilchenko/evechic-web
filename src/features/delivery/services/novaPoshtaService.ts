import { apiFetch } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type NpCity = components["schemas"]["City"];
export type NpWarehouse = components["schemas"]["Warehouse"];
export type NpWarehouseType = NpWarehouse["type"];

export function searchCities(q: string) {
  return apiFetch<NpCity[]>("delivery/cities/", { query: { q } });
}

export function searchWarehouses(cityRef: string, type: NpWarehouseType, q: string) {
  return apiFetch<NpWarehouse[]>("delivery/warehouses/", { query: { city_ref: cityRef, type, q } });
}

export type DeliveryPrice = { free: boolean; cost: string | null; free_delivery_threshold: string };
export type PriceService = "branch" | "locker" | "courier";

export function fetchDeliveryPrice(cityRef: string, service: PriceService, amount: number) {
  return apiFetch<DeliveryPrice>("delivery/price/", { query: { city_ref: cityRef, service, amount } });
}
