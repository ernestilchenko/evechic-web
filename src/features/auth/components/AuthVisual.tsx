import Image from "next/image";

import { t } from "@/lib/i18n";

export function AuthVisual({ image }: { image: string | null }) {
  return (
    <div className="bg-ink relative hidden overflow-hidden lg:block">
      {image ? (
        <>
          <Image src={image} alt="" fill sizes="600px" className="object-cover" />
          <div aria-hidden className="bg-ink/35 absolute inset-0" />
        </>
      ) : null}
      <div aria-hidden className="absolute bottom-16 left-16 flex flex-col gap-3 font-light">
        <p className="text-cream font-serif text-[34px] tracking-[0.3em]">EVECHIC</p>
        <p className="text-sand font-serif text-xl tracking-[0.04em] italic">{t("auth.visual.tagline")}</p>
      </div>
    </div>
  );
}
