import Image from "next/image";

import { cn } from "@/lib/cn";

type Tone = "light" | "dark";

const PAYMENT_LOGOS = [
  { name: "plata", alt: "plata by mono", width: 619, height: 128, size: 18 },
  { name: "visa", alt: "Visa", width: 149, height: 48, size: 14 },
  { name: "mc", alt: "Mastercard", width: 91, height: 56, size: 20 },
  { name: "apple-pay", alt: "Apple Pay", width: 147, height: 62, size: 20 },
  { name: "google-pay", alt: "Google Pay", width: 159, height: 62, size: 20 },
] as const;

export function PaymentLogos({ tone, className }: { tone: Tone; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)} aria-label="Способи оплати">
      {PAYMENT_LOGOS.map((logo) => (
        <li key={logo.name} className="flex items-center">
          <Image
            src={`/brands/${logo.name}-${tone}.svg`}
            alt={logo.alt}
            width={Math.round((logo.width / logo.height) * logo.size)}
            height={logo.size}
            unoptimized
          />
        </li>
      ))}
    </ul>
  );
}

export function NovaPoshtaLogo({ className, withName = true }: { className?: string; withName?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src="/brands/nova-poshta.svg" alt="Нова Пошта" width={20} height={20} unoptimized />
      {withName ? <span className="font-semibold">Нова Пошта</span> : null}
    </span>
  );
}
