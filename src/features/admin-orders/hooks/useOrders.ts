"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminKeys, getErrorMessage, useAdminToast, type OrderStatus } from "@/features/admin";
import { t } from "@/lib/i18n";

import { orderKeys } from "../constants/orders";
import { changeOrderStatus, fetchOrder, fetchOrders, updateOrder } from "../services/ordersService";
import type { AdminOrder, AdminOrderUpdate, OrderListParams } from "../types";

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(number: number) {
  return useQuery({ queryKey: orderKeys.detail(number), queryFn: () => fetchOrder(number) });
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ number, status }: { number: number; status: OrderStatus }) =>
      changeOrderStatus(number, status),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.number), order);
      toast.success(
        t("adminOrders.toast.statusChanged", {
          number: order.number,
          status: t(`admin.orderStatus.${order.status}`),
        }),
      );
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminOrders.toast.statusFailed"))),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.badges });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useUpdateOrder(number: number) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (body: AdminOrderUpdate) => updateOrder(number, body),
    onSuccess: (order: AdminOrder) => {
      queryClient.setQueryData(orderKeys.detail(number), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success(t("adminOrders.toast.saved"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminOrders.toast.saveFailed"))),
  });
}
