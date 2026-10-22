import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  text?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, text, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-14 text-center", className)}>
      <p className="text-[14px] font-semibold">{title}</p>
      {text ? <p className="text-muted max-w-sm text-[12.5px]">{text}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
