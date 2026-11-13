"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminKeys, getErrorMessage, useAdminToast, type OrderStatus } from "@/features/admin";
import { ApiError } from "@/lib/api/client";
import { t } from "@/lib/i18n";

import { orderKeys } from "../constants/orders";
import {
  changeOrderStatus,
  createWaybill,
  deleteWaybill,
  fetchOrder,
  fetchOrders,
  refreshTracking,
  updateOrder,
} from "../services/ordersService";
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

type WaybillAction = { kind: "create"; weight: string } | { kind: "delete" } | { kind: "refresh" };

export function useWaybill(number: number) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (action: WaybillAction) =>
      action.kind === "create"
        ? createWaybill(number, action.weight)
        : action.kind === "delete"
          ? deleteWaybill(number)
          : refreshTracking(number),
    onSuccess: (order: AdminOrder, action) => {
      queryClient.setQueryData(orderKeys.detail(number), order);
      toast.success(
        action.kind === "create"
          ? t("adminOrders.waybill.toast.created", { number: order.tracking_number })
          : action.kind === "delete"
            ? t("adminOrders.waybill.toast.deleted")
            : t("adminOrders.waybill.toast.refreshed"),
      );
    },
    onError: (error) => toast.error(waybillError(error)),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.badges });
    },
  });
}

function waybillError(error: unknown) {
  const detail =
    error instanceof ApiError && error.data && typeof error.data === "object" && "detail" in error.data
      ? String((error.data as { detail: unknown }).detail)
      : null;
  const message = getErrorMessage(error, t("adminOrders.waybill.toast.failed"));
  return detail ? `${message} ${detail}` : message;
}
