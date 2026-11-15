import Image from "next/image";

import { formatDate } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { getProductReviews } from "../services/reviewsService";

import { RatingStars } from "./RatingStars";
import { ReviewForm } from "./ReviewForm";

type ProductReviewsProps = {
  slug: string;
  sizes: string[];
};

export async function ProductReviews({ slug, sizes }: ProductReviewsProps) {
  const data = await getProductReviews(slug).catch(() => null);
  const items = data?.items ?? [];
  const summary = data?.summary ?? {
    average: null,
    count: 0,
    distribution: {},
    fit: { small: 0, true_to_size: 0, large: 0, verdict: null },
  };
  const fitTotal = summary.fit.small + summary.fit.true_to_size + summary.fit.large;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="container-page border-line scroll-mt-24 border-t pt-16 pb-6"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col gap-6">
          <h2 id="reviews-title" className="font-serif text-[32px] font-light sm:text-[40px]">
            {t("reviews.title")}
          </h2>
          {summary.count > 0 && summary.average !== null ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-serif text-5xl font-light">{summary.average.toFixed(1)}</span>
                <div className="flex flex-col gap-1">
                  <RatingStars value={summary.average} />
                  <span className="text-muted text-xs">{tPlural("reviews.count", summary.count)}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = summary.distribution[String(stars)] ?? 0;
                  return (
                    <li key={stars} className="text-muted flex items-center gap-3 text-xs">
                      <span className="w-3">{stars}</span>
                      <span className="bg-line relative h-1 flex-1">
                        <span
                          className="bg-gold absolute inset-y-0 left-0"
                          style={{ width: `${(count / summary.count) * 100}%` }}
                        />
                      </span>
                      <span className="w-6 text-right">{count}</span>
                      <span className="sr-only">{t("reviews.distribution", { stars, count })}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {fitTotal > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-muted text-[10.5px] font-semibold tracking-[0.2em] uppercase">
                {t("reviews.fitSummary")}
              </p>
              <ul className="flex flex-col gap-1.5">
                {(["small", "true_to_size", "large"] as const).map((fit) => (
                  <li key={fit} className="text-muted flex items-center gap-3 text-xs">
                    <span className="w-24">{t(`reviews.fit.${fit}`)}</span>
                    <span className="bg-line relative h-1 flex-1">
                      <span
                        className="bg-ink absolute inset-y-0 left-0"
                        style={{ width: `${(summary.fit[fit] / fitTotal) * 100}%` }}
                      />
                    </span>
                    <span className="w-6 text-right">{summary.fit[fit]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ReviewForm slug={slug} sizes={sizes} />
        </div>
        <div>
          {items.length > 0 ? (
            <ul className="flex flex-col">
              {items.map((review) => (
                <li key={review.id} className="border-line flex flex-col gap-3 border-b py-6 first:pt-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-[13px] font-semibold">{review.author_name}</span>
                    <RatingStars value={review.rating} />
                    <time dateTime={review.created_at} className="text-placeholder text-xs">
                      {formatDate(review.created_at)}
                    </time>
                  </div>
                  <p className="text-muted text-[13px] leading-[1.75] whitespace-pre-line">{review.text}</p>
                  {review.photos.length > 0 ? (
                    <ul className="flex gap-2">
                      {review.photos.map((photo, index) => (
                        <li key={photo}>
                          <a
                            href={photo}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-sand relative block size-20 overflow-hidden"
                          >
                            <Image
                              src={photo}
                              alt={t("reviews.photo", { index: index + 1 })}
                              fill
                              sizes="80px"
                              className="object-cover object-top"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-placeholder flex flex-wrap gap-x-3 text-xs">
                    {review.size_purchased ? (
                      <span>{t("reviews.size", { size: review.size_purchased })}</span>
                    ) : null}
                    {review.fit ? <span>{t(`reviews.fit.${review.fit}`)}</span> : null}
                    {review.verified_purchase ? (
                      <span className="text-success">{t("reviews.verified")}</span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-[13px]">{t("reviews.empty")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
