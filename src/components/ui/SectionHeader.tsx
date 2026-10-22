import Link from "next/link";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  id?: string;
  action?: { href: string; label: string };
  className?: string;
};

export function SectionHeader({ title, id, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <h2 id={id} className="flex-1 font-serif text-[32px] font-light sm:text-[40px]">
        {title}
      </h2>
      {action ? (
        <Link href={action.href} className="caps text-gold hover:text-ink">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
