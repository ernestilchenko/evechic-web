import { ApiError } from "@/lib/api/client";

type ErrorPayload = { errors?: Record<string, unknown> } | null;

function flatten(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === "object") return Object.values(value).flatMap(flatten);
  return value === undefined || value === null ? [] : [String(value)];
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  const errors = (error.data as ErrorPayload)?.errors ?? {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, value]) => [field, flatten(value).join(" ")]),
  );
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback;
  const fields = getFieldErrors(error);
  const messages = Object.entries(fields).map(([field, message]) =>
    field === "non_field_errors" || field === "detail" ? message : `${field}: ${message}`,
  );
  if (messages.length > 0) return messages.join(" ");
  return error.message || fallback;
}
