"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

import { LISTING_PARAMS } from "../../constants/listing";

export function SearchBox() {
  const current = useSearchParams().get(LISTING_PARAMS.q) ?? "";
  return <SearchForm key={current} current={current} />;
}

function SearchForm({ current }: { current: string }) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(current);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      role="search"
      aria-busy={isPending}
      className="flex w-full max-w-[640px] items-stretch"
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        startTransition(() => {
          router.replace(query ? `${pathname}?${LISTING_PARAMS.q}=${encodeURIComponent(query)}` : pathname, {
            scroll: false,
          });
        });
      }}
    >
      <label htmlFor={id} className="sr-only">
        {t("search.label")}
      </label>
      <input
        id={id}
        type="search"
        name="q"
        value={value}
        maxLength={100}
        autoComplete="off"
        placeholder={t("search.placeholder")}
        onChange={(event) => setValue(event.target.value)}
        className="border-field placeholder:text-placeholder focus:border-ink h-14 min-w-0 flex-1 border bg-transparent px-5 text-[13.5px] focus:outline-none"
      />
      <Button type="submit" className="h-14 px-8 py-0">
        {t("search.submit")}
      </Button>
    </form>
  );
}
