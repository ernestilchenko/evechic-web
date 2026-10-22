"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { loginPath, useSession } from "@/features/auth";

export function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !user) router.replace(loginPath(pathname));
  }, [isLoading, user, pathname, router]);

  return <>{children}</>;
}
