import { AuthLayout } from "@/features/auth";
import { getHomeContent } from "@/features/content";

export default async function AuthRouteLayout({ children }: LayoutProps<"/">) {
  const { hero } = await getHomeContent();
  return <AuthLayout image={hero?.image ?? null}>{children}</AuthLayout>;
}
