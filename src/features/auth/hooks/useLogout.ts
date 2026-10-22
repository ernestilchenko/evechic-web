"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/data/routes";

import { logout } from "../services/authService";
import { forgetCartToken } from "../utils/cartToken";

import { sessionQueryKey } from "./useSession";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      forgetCartToken();
      queryClient.setQueryData(sessionQueryKey, null);
      router.replace(routes.home);
      router.refresh();
      await queryClient.resetQueries({ predicate: (query) => query.queryKey[0] !== sessionQueryKey[0] });
    },
  });
}
