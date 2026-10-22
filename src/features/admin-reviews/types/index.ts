import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type AdminReview = Schemas["AdminReview"];
export type ReviewCounts = Schemas["ReviewStatusCounts"];
export type ReviewStatus = Schemas["ReviewStatusEnum"];
export type ModerateStatus = Schemas["ReviewModerateStatusEnum"];
export type ReviewTab = keyof ReviewCounts;

export type ReviewListParams = { status: ReviewTab; q: string; rating: number | null; page: number };
export type ReviewListResult = { items: AdminReview[]; counts: ReviewCounts };
