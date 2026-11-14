const VISITOR_KEY = "evechic_vid";
const SESSION_KEY = "evechic_sid";
const SESSION_SEEN_KEY = "evechic_sid_seen";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function storage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ ((Math.random() * 16) >> (Number(c) / 4))).toString(16),
      );
}

export function visitorId() {
  const store = storage();
  let id = store?.getItem(VISITOR_KEY) ?? null;
  if (!id) {
    id = newId();
    store?.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function currentSession() {
  const store = storage();
  const now = Date.now();
  const seen = Number(store?.getItem(SESSION_SEEN_KEY) ?? 0);
  let id = store?.getItem(SESSION_KEY) ?? null;
  const isNew = !id || now - seen > SESSION_TIMEOUT_MS;
  if (isNew) {
    id = newId();
    store?.setItem(SESSION_KEY, id);
  }
  store?.setItem(SESSION_SEEN_KEY, String(now));
  return { id: id as string, isNew };
}

export function peekSessionId() {
  return storage()?.getItem(SESSION_KEY) ?? null;
}
