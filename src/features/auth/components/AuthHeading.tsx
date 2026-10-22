import { cn } from "@/lib/cn";

type AuthHeadingProps = {
  eyebrow?: React.ReactNode;
  title: string;
  lead?: React.ReactNode;
  eyebrowTone?: "gold" | "muted";
};

export function AuthHeading({ eyebrow, title, lead, eyebrowTone = "gold" }: AuthHeadingProps) {
  return (
    <>
      {eyebrow ? (
        <div
          className={cn(
            "text-[10.5px] font-semibold tracking-[0.22em] uppercase",
            eyebrowTone === "gold" ? "text-gold" : "text-muted",
          )}
        >
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-serif text-[38px] leading-tight font-light sm:text-[44px]">{title}</h1>
      {lead ? <p className="text-muted text-[13.5px] leading-[1.72]">{lead}</p> : null}
    </>
  );
}
