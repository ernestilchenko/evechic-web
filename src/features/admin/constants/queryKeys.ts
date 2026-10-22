export const adminKeys = {
  all: ["admin"] as const,
  badges: ["admin", "badges"] as const,
  dashboard: (days: number) => ["admin", "dashboard", days] as const,
};

export const BADGES_POLL_INTERVAL = 60_000;
export const DASHBOARD_PERIODS = [7, 30, 90] as const;
export const DEFAULT_PERIOD = 30;
export const SEARCH_DEBOUNCE_MS = 350;
