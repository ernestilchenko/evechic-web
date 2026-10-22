import type { DashboardBadges, DashboardOverview } from "../types";

import { adminFetch } from "./adminClient";

export function fetchBadges() {
  return adminFetch<DashboardBadges>("dashboard/badges");
}

export function fetchDashboard(days: number) {
  return adminFetch<DashboardOverview>("dashboard", { query: { days } });
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
