"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatDateTime,
  LoadingBlock,
  Pagination,
  SearchField,
  StatusChip,
  useUrlState,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { t, tPlural } from "@/lib/i18n";

import { RATINGS, REVIEW_TABS, REVIEW_TONES } from "../constants/reviews";
import { useDeleteReview, useModerateReview, useReviews } from "../hooks/useReviews";
import type { AdminReview, ReviewTab } from "../types";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="text-gold text-[13px] tracking-[0.1em]"
      aria-label={t("adminReviews.rating", { rating })}
    >
      <span aria-hidden>{"★".repeat(rating)}</span>
      <span aria-hidden className="text-admin-line">
        {"★".repeat(5 - rating)}
      </span>
    </span>
  );
}

export function ReviewsList() {
  const url = useUrlState();
  const status = (REVIEW_TABS as string[]).includes(url.get("status"))
    ? (url.get("status") as ReviewTab)
    : "pending";
  const q = url.get("q");
  const rating = url.getNumber("rating", 0) || null;
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = useReviews({ status, q, rating, page });
  const moderate = useModerateReview();
  const remove = useDeleteReview();
  const [toDelete, setToDelete] = useState<AdminReview | null>(null);
  const reviews = data?.data.items ?? [];

  return (
    <>
      <AdminPageHeader title={t("adminReviews.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminReviews.searchLabel")}
          placeholder={t("adminReviews.searchPlaceholder")}
        />
        <label className="sr-only" htmlFor="reviews-rating">
          {t("adminReviews.ratingFilter")}
        </label>
        <Select
          id="reviews-rating"
          value={rating ?? ""}
          onChange={(event) => url.set({ rating: event.target.value })}
        >
          <option value="">{t("adminReviews.allRatings")}</option>
          {RATINGS.map((value) => (
            <option key={value} value={value}>
              {"★".repeat(value)}
            </option>
          ))}
        </Select>
      </AdminPageHeader>
      <AdminPageBody>
        <Tabs
          label={t("adminReviews.tabsLabel")}
          controls="reviews-list"
          value={status}
          onChange={(value) => url.set({ status: value === "pending" ? null : value })}
          items={REVIEW_TABS.map((value) => ({
            value,
            label: t(`adminReviews.tabs.${value}`),
            count: data?.data.counts[value],
          }))}
        />
        <section
          id="reviews-list"
          aria-busy={isFetching}
          aria-label={t("adminReviews.listLabel")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && reviews.length === 0 ? <EmptyState title={t("adminReviews.empty")} /> : null}
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border-admin-row flex flex-col gap-3 border-t px-5 py-5 first:border-t-0 sm:px-[22px]"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars rating={review.rating} />
                    <StatusChip tone={REVIEW_TONES[review.status]}>
                      {t(`adminReviews.status.${review.status}`)}
                    </StatusChip>
                    <span className="text-placeholder ml-auto text-[11px]">
                      {formatDateTime(review.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]">
                    <Link
                      href={routes.admin.customer(review.user.id)}
                      className="hover:text-gold font-semibold"
                    >
                      {review.user.full_name || review.user.email}
                    </Link>
                    <span className="text-placeholder">→</span>
                    <Link
                      href={routes.product(review.product.slug)}
                      target="_blank"
                      className="hover:text-gold"
                    >
                      {review.product.name}
                    </Link>
                    {review.size_purchased ? (
                      <span className="text-muted text-[11px]">
                        {t("adminReviews.size", { size: review.size_purchased })}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[13px] leading-relaxed whitespace-pre-line">{review.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {review.status !== "approved" ? (
                      <AdminButton
                        disabled={moderate.isPending}
                        onClick={() => moderate.mutate({ id: review.id, status: "approved" })}
                      >
                        {t("adminReviews.approve")}
                      </AdminButton>
                    ) : null}
                    {review.status !== "rejected" ? (
                      <AdminButton
                        variant="outline"
                        disabled={moderate.isPending}
                        onClick={() => moderate.mutate({ id: review.id, status: "rejected" })}
                      >
                        {t("adminReviews.reject")}
                      </AdminButton>
                    ) : null}
                    <AdminButton variant="danger" onClick={() => setToDelete(review)}>
                      {t("adminReviews.delete")}
                    </AdminButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          {data && data.pagination.count > 0 ? (
            <Pagination
              pagination={data.pagination}
              onChange={(next) => url.set({ page: next === 1 ? null : next })}
              summary={({ from, to, count }) => tPlural("adminReviews.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminReviews.confirmDelete")}
        message={toDelete?.text.slice(0, 160)}
        confirmLabel={t("adminReviews.delete")}
        cancelLabel={t("adminReviews.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </>
  );
}
