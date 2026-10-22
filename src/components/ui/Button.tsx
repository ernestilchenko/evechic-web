import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-ink/85",
  outline: "border border-ink text-ink hover:bg-ink hover:text-cream",
  light: "bg-cream text-ink hover:bg-sand",
};

const base =
  "inline-flex items-center justify-center px-9 py-[19px] text-[11px] leading-none font-semibold tracking-[0.16em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
