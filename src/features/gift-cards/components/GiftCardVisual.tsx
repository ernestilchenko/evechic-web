import { formatPrice } from "@/lib/format";

export function GiftCardVisual({ amount, selected = false }: { amount: number; selected?: boolean }) {
  return (
    <span
      className={`relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden rounded-[18px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5 text-white shadow-lg transition ${
        selected ? "ring-gold ring-4 ring-offset-2" : "ring-1 ring-white/10"
      }`}
    >
      <span className="flex items-start justify-between">
        <span className="font-serif text-[20px] font-light tracking-[0.3em]">EVECHIC</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase">Gift card</span>
      </span>
      <span className="font-serif text-[34px] font-light">{formatPrice(amount)}</span>
    </span>
  );
}
