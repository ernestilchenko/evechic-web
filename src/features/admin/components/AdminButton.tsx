import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream border border-ink hover:bg-ink/85",
  outline: "border border-admin-line bg-white text-ink hover:border-ink",
  danger: "border border-admin-danger-bg bg-admin-danger-bg text-admin-danger hover:border-admin-danger",
  ghost: "text-ink hover:bg-admin-bg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded px-[18px] py-3 text-[10px] leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function AdminButton({ variant = "primary", className, type = "button", ...props }: AdminButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...props} />;
}

type AdminButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: Variant };

export function AdminButtonLink({ variant = "primary", className, ...props }: AdminButtonLinkProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
