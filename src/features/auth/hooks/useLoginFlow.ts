"use client";

import { useMemo, useSyncExternalStore } from "react";

import { getLoginFlowSnapshot, parseLoginFlow, subscribeLoginFlow } from "../utils/loginFlow";

export function useLoginFlow() {
  const raw = useSyncExternalStore(subscribeLoginFlow, getLoginFlowSnapshot, () => undefined);
  const flow = useMemo(() => (raw === undefined ? null : parseLoginFlow(raw)), [raw]);
  return { flow, isReady: raw !== undefined };
}
