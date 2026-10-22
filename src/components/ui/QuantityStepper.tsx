import { cn } from "@/lib/cn";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  className?: string;
};

const stepClass =
  "flex h-[42px] w-10 items-center justify-center text-[13px] transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  disabled,
  label,
  decreaseLabel,
  increaseLabel,
  className,
}: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("border-line inline-flex items-center border", className)}
    >
      <button
        type="button"
        className={stepClass}
        aria-label={decreaseLabel}
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output
        aria-live="polite"
        className="flex size-[42px] items-center justify-center text-[13px] font-medium"
      >
        {value}
      </output>
      <button
        type="button"
        className={stepClass}
        aria-label={increaseLabel}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
