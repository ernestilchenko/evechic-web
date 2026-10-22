const numberFormatter = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("uk-UA", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export const EMPTY_VALUE = "—";

export function formatNumber(value: number | string) {
  return numberFormatter.format(Number(value));
}

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

export function formatShortDate(value: string | null | undefined) {
  if (!value) return EMPTY_VALUE;
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return EMPTY_VALUE;
  return new Intl.DateTimeFormat("uk-UA", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function formatDayLabel(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short" }).format(new Date(value));
}

export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null;
}
