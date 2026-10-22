import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { REFRESH_COOKIE } from "@/features/auth";
import { getSessionUser } from "@/features/auth/server/getSessionUser";
import { routes } from "@/data/routes";

import { AdminForbidden } from "../components/AdminForbidden";
import { AdminSessionRefresh } from "../components/AdminSessionRefresh";
import { AdminShell } from "../components/AdminShell";

export async function AdminGate({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    if ((await cookies()).has(REFRESH_COOKIE)) return <AdminSessionRefresh />;
    redirect(`${routes.login}?next=${encodeURIComponent(routes.admin.dashboard)}`);
  }
  if (user.role !== "owner" && user.role !== "manager") return <AdminForbidden />;

  return (
    <AdminShell
      user={{ id: user.id, name: user.full_name || user.email, email: user.email, role: user.role }}
    >
      {children}
    </AdminShell>
  );
}
