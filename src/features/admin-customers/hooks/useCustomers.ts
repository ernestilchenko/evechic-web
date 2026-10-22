"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { customerKeys } from "../constants/customers";
import { fetchCustomer, fetchCustomers, updateCustomer } from "../services/customersService";
import type { CustomerDetail, CustomerSort, CustomerUpdate } from "../types";

export function useCustomers(params: { q: string; sort: CustomerSort; page: number }) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: number) {
  return useQuery({ queryKey: customerKeys.detail(id), queryFn: () => fetchCustomer(id) });
}

export function useUpdateCustomer(id: number) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (body: CustomerUpdate) => updateCustomer(id, body),
    onSuccess: (row) => {
      queryClient.setQueryData<CustomerDetail>(customerKeys.detail(id), (detail) =>
        detail
          ? {
              ...detail,
              profile: { ...detail.profile, bonus_balance: row.bonus_balance, is_active: row.is_active },
            }
          : detail,
      );
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success(t("adminCustomers.toast.saved"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminCustomers.toast.saveFailed"))),
  });
}
