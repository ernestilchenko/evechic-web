"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import { FILTER_PARAM_KEYS, LISTING_PARAMS } from "../constants/listing";
import { parseListingParams } from "../utils/listingParams";

type ParamValue = string | number | boolean | readonly (string | number)[] | null | undefined;

function serialize(value: ParamValue) {
  if (value === null || value === undefined || value === false || value === "") return null;
  if (Array.isArray(value)) return value.length ? value.join(",") : null;
  if (value === true) return "1";
  return String(value);
}

export function useListingParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const state = useMemo(
    () => parseListingParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const navigate = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const update = useCallback(
    (changes: Record<string, ParamValue>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        const serialized = serialize(value);
        if (serialized === null) next.delete(key);
        else next.set(key, serialized);
      });
      next.delete(LISTING_PARAMS.page);
      navigate(next);
    },
    [navigate, searchParams],
  );

  const reset = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    FILTER_PARAM_KEYS.forEach((key) => next.delete(key));
    next.delete(LISTING_PARAMS.page);
    navigate(next);
  }, [navigate, searchParams]);

  return { state, update, reset, isPending };
}
