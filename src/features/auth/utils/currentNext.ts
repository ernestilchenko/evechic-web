import { safeNextPath } from "./redirect";

export function currentNextParam() {
  if (typeof window === "undefined") return null;
  return safeNextPath(new URLSearchParams(window.location.search).get("next"));
}
