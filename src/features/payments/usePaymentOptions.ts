"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPaymentOptions } from "./paymentOptions";

export function usePaymentOptions() {
  return useQuery({ queryKey: ["payment-options"], queryFn: fetchPaymentOptions, staleTime: 5 * 60_000 });
}
