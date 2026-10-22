import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type DashboardBadges = Schemas["DashboardBadges"];
export type DashboardOverview = Schemas["DashboardOverview"];
export type SalesDay = Schemas["SalesDay"];
export type TopProduct = Schemas["TopProduct"];
export type RecentOrder = Schemas["RecentOrder"];
export type LowStock = Schemas["LowStock"];
export type StaffRole = Schemas["UserRoleEnum"];

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
};

export type ChipTone = "info" | "warn" | "success" | "danger" | "violet" | "neutral";
