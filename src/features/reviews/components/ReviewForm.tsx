"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { routes } from "@/data/routes";
import { useSession } from "@/features/auth";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { createReview } from "../services/reviewsClient";

type ReviewFormProps = {
  slug: string;
  sizes: string[];
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;

export function ReviewForm({ slug, sizes }: ReviewFormProps) {
  const id = useId();
  const { isAuthenticated, isLoading } = useSession();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: () =>
      createReview(slug, { rating, text: text.trim(), ...(size ? { size_purchased: size } : {}) }),
    onError: (cause) =>
      setError(cause instanceof ApiError && cause.message ? cause.message : t("reviews.form.error")),
  });

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <p className="text-muted text-[13px]">
        {t("reviews.form.guest")}{" "}
        <Link
          href={`${routes.login}?next=${encodeURIComponent(routes.product(slug))}`}
          className="text-ink underline underline-offset-2"
        >
          {t("reviews.form.login")}
        </Link>
      </p>
    );
  }

  if (mutation.isSuccess) {
    return (
      <p role="status" className="bg-sand p-5 text-[13px]">
        {t("reviews.form.success")}
      </p>
    );
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating < 1) return setError(t("reviews.form.ratingRequired"));
    if (text.trim().length < MIN_LENGTH) return setError(t("reviews.form.textTooShort"));
    setError(null);
    mutation.mutate();
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-[11px] font-semibold tracking-[0.18em] uppercase">
        {t("reviews.form.title")}
      </h3>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-muted mb-2 text-[10.5px] font-semibold tracking-[0.2em] uppercase">
          {t("reviews.form.rating")}
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name={`${id}-rating`}
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                className="peer sr-only"
              />
              <span className="sr-only">{t("reviews.form.ratingOption", { value })}</span>
              <span
                aria-hidden
                className={cn(
                  "peer-focus-visible:outline-gold block text-2xl leading-none peer-focus-visible:outline-2",
                  value <= rating ? "text-gold" : "text-line-strong hover:text-gold/60",
                )}
              >
                ★
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-text`}
          className="text-muted text-[10.5px] font-semibold tracking-[0.2em] uppercase"
        >
          {t("reviews.form.text")}
        </label>
        <textarea
          id={`${id}-text`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
          rows={5}
          required
          aria-describedby={`${id}-hint`}
          className="border-field focus:border-ink border bg-transparent p-4 text-[13px] focus:outline-none"
        />
        <p id={`${id}-hint`} className="text-placeholder text-xs">
          {t("reviews.form.textHint")}
        </p>
      </div>
      {sizes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${id}-size`}
            className="text-muted text-[10.5px] font-semibold tracking-[0.2em] uppercase"
          >
            {t("reviews.form.size")}
          </label>
          <select
            id={`${id}-size`}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="border-field focus:border-ink h-11 w-48 border bg-transparent px-3 text-[13px] focus:outline-none"
          >
            <option value="">{t("reviews.form.sizeNone")}</option>
            {sizes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <p aria-live="assertive" className="text-sale min-h-4 text-[12.5px]">
        {error}
      </p>
      <Button type="submit" disabled={mutation.isPending} className="self-start">
        {mutation.isPending ? t("reviews.form.submitting") : t("reviews.form.submit")}
      </Button>
    </form>
  );
}
