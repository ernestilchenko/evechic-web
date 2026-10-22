import { cn } from "@/lib/cn";

type PanelProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  titleId?: string;
  action?: React.ReactNode;
  padded?: boolean;
};

export function Panel({ title, titleId, action, padded = true, className, children, ...props }: PanelProps) {
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={cn("border-admin-line rounded-md border bg-white", padded && "p-5 sm:p-6", className)}
      {...props}
    >
      {title ? (
        <div className={cn("flex items-center gap-4", padded ? "pb-5" : "px-5 pt-6 pb-5 sm:px-[22px]")}>
          <h2 id={titleId} className="flex-1 text-[14px] font-semibold">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
