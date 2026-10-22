import { LOGIN_FLOW_STORAGE_KEY } from "../constants/auth";

export type LoginFlow = {
  email: string;
  next: string | null;
  resendAt: number;
  expiresAt: number | null;
};

const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.sessionStorage.getItem(LOGIN_FLOW_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function subscribeLoginFlow(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLoginFlowSnapshot() {
  return read();
}

export function parseLoginFlow(raw: string | null): LoginFlow | null {
  if (!raw) return null;
  try {
    const flow = JSON.parse(raw) as LoginFlow;
    return typeof flow.email === "string" && flow.email ? flow : null;
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function saveLoginFlow(flow: LoginFlow) {
  try {
    window.sessionStorage.setItem(LOGIN_FLOW_STORAGE_KEY, JSON.stringify(flow));
  } catch {}
  emit();
}

export function updateLoginFlow(patch: Partial<LoginFlow>) {
  const current = parseLoginFlow(read());
  if (current) saveLoginFlow({ ...current, ...patch });
}

export function clearLoginFlow() {
  try {
    window.sessionStorage.removeItem(LOGIN_FLOW_STORAGE_KEY);
  } catch {}
  emit();
}
