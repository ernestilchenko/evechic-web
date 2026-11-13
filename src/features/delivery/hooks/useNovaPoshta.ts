"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { searchCities, searchWarehouses, type NpWarehouseType } from "../services/novaPoshtaService";

const DEBOUNCE_MS = 250;
const STALE_MS = 10 * 60_000;

export function useDebounced<T>(value: T, delay = DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useCitySearch(query: string, enabled: boolean) {
  const q = useDebounced(query.trim());
  return useQuery({
    queryKey: ["np", "cities", q.toLowerCase()],
    queryFn: () => searchCities(q),
    enabled: enabled && q.length >= 2,
    staleTime: STALE_MS,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function useWarehouseSearch(cityRef: string, type: NpWarehouseType, query: string, enabled: boolean) {
  const q = useDebounced(query.trim());
  return useQuery({
    queryKey: ["np", "warehouses", cityRef, type, q.toLowerCase()],
    queryFn: () => searchWarehouses(cityRef, type, q),
    enabled: enabled && Boolean(cityRef),
    staleTime: STALE_MS,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
