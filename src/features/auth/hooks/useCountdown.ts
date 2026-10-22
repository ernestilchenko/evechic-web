"use client";

import { useEffect, useState } from "react";

export function useCountdown(target: number | null) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timeout = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [target]);

  if (target === null || now === null) return { seconds: null, isDone: false };
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  return { seconds, isDone: seconds === 0 };
}
