"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cartQueryKey } from "@/features/cart";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { repeatOrder } from "../services/accountService";

type RepeatOrderButtonProps = {
  number: number;
  className?: string;
  onError?: (message: string) => void;
};

export function RepeatOrderButton({ number, className, onError }: RepeatOrderButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => repeatOrder(number),
    onSuccess: async (result) => {
      if (result.added.length === 0) {
        onError?.(t("account.orders.repeatError"));
        return;
      }
      await queryClient.invalidateQueries({ queryKey: cartQueryKey });
      router.push(routes.cart);
    },
    onError: () => onError?.(t("account.orders.repeatError")),
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={cn(
        "bg-ink text-cream hover:bg-ink/85 px-[22px] py-3.5 text-[10.5px] leading-none font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition-colors disabled:opacity-60",
        className,
      )}
    >
      {mutation.isPending ? t("account.orders.repeating") : t("account.orders.repeat")}
    </button>
  );
}
