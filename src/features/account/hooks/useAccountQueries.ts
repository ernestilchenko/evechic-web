"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { accountQueryKeys, type OrderPeriod } from "../constants/account";
import { fetchAccountSummary, fetchAddresses, fetchOrder, fetchOrders } from "../services/accountService";

export function useAccountSummary() {
  return useQuery({ queryKey: accountQueryKeys.summary, queryFn: fetchAccountSummary, staleTime: 30_000 });
}

export function useOrders(period: OrderPeriod) {
  return useInfiniteQuery({
    queryKey: accountQueryKeys.orders(period),
    queryFn: ({ pageParam }) => fetchOrders(period, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.total_pages ? last.pagination.page + 1 : undefined,
  });
}

export function useOrder(number: string) {
  return useQuery({
    queryKey: accountQueryKeys.order(number),
    queryFn: () => fetchOrder(number),
    retry: false,
  });
}

export function useAddresses() {
  return useQuery({ queryKey: accountQueryKeys.addresses, queryFn: fetchAddresses });
}
