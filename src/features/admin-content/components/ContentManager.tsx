"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import {
  AdminButton,
  AdminButtonLink,
  AdminPageBody,
  AdminPageHeader,
  formatShortDate,
  LoadingBlock,
  RowMenu,
  StatusChip,
  Thumb,
  useUrlState,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { CONTENT_TABS } from "../constants/content";
import {
  useBanners,
  useDeleteBanner,
  useDeleteInstagramPost,
  useDeletePage,
  useInstagramPosts,
  usePages,
} from "../hooks/useContent";
import type { AdminBanner, AdminInstagramPost, AdminPageRow, ContentTab } from "../types";
import { BannerDialog } from "./BannerDialog";
import { ContentError } from "./ContentError";
import { InstagramDialog } from "./InstagramDialog";

type Removal = { kind: "banner" | "instagram" | "page"; id: number; label: string } | null;

function ActiveChip({ active }: { active: boolean }) {
  return (
    <StatusChip tone={active ? "success" : "neutral"}>
      {active ? t("adminContent.activeChip") : t("adminContent.hiddenChip")}
    </StatusChip>
  );
}

function BannersTable({
  onEdit,
  onDelete,
}: {
  onEdit: (banner: AdminBanner) => void;
  onDelete: (removal: Removal) => void;
}) {
  const { data, error, isLoading, refetch } = useBanners();
  if (isLoading) return <LoadingBlock />;
  if (error) return <ContentError error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) return <EmptyState title={t("adminContent.banners.empty")} />;
  return (
    <Table>
      <THead>
        <tr>
          <Th className="w-14">
            <span className="sr-only">{t("adminContent.image")}</span>
          </Th>
          <Th>{t("adminContent.banners.field.title")}</Th>
          <Th>{t("adminContent.banners.placement")}</Th>
          <Th>{t("adminContent.sortOrder")}</Th>
          <Th>{t("adminContent.status")}</Th>
          <Th>
            <span className="sr-only">{t("adminContent.actions")}</span>
          </Th>
        </tr>
      </THead>
      <TBody>
        {data.map((banner) => (
          <Tr key={banner.id}>
            <Td className="py-3">
              <Thumb src={banner.image} alt={banner.image_alt || banner.title} />
            </Td>
            <Td className="min-w-[200px] py-3">
              <button
                type="button"
                className="hover:text-gold text-left font-medium"
                onClick={() => onEdit(banner)}
              >
                {banner.title}
              </button>
              {banner.subtitle ? (
                <span className="text-placeholder block text-[11px]">{banner.subtitle}</span>
              ) : null}
            </Td>
            <Td className="py-3">{t(`adminContent.placement.${banner.placement}`)}</Td>
            <Td className="py-3">{banner.sort_order}</Td>
            <Td className="py-3">
              <ActiveChip active={banner.is_active} />
            </Td>
            <Td className="py-3 text-right">
              <RowMenu
                label={t("adminContent.rowActions", { name: banner.title })}
                items={[
                  { label: t("adminContent.edit"), onSelect: () => onEdit(banner) },
                  {
                    label: t("adminContent.delete"),
                    tone: "danger",
                    onSelect: () => onDelete({ kind: "banner", id: banner.id, label: banner.title }),
                  },
                ]}
              />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
}

function InstagramGrid({
  onEdit,
  onDelete,
}: {
  onEdit: (post: AdminInstagramPost) => void;
  onDelete: (removal: Removal) => void;
}) {
  const { data, error, isLoading, refetch } = useInstagramPosts();
  if (isLoading) return <LoadingBlock />;
  if (error) return <ContentError error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) return <EmptyState title={t("adminContent.instagram.empty")} />;
  return (
    <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6">
      {data.map((post) => (
        <li key={post.id} className="border-admin-line flex flex-col overflow-hidden rounded border">
          <Thumb src={post.image} alt={post.alt} className="aspect-square h-auto w-full rounded-none" />
          <div className="flex flex-col gap-2 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <ActiveChip active={post.is_active} />
              <span className="text-placeholder text-[11px]">#{post.sort_order}</span>
            </div>
            <div className="flex gap-3 text-[11px]">
              <button type="button" className="hover:underline" onClick={() => onEdit(post)}>
                {t("adminContent.edit")}
              </button>
              <button
                type="button"
                className="text-sale hover:underline"
                onClick={() => onDelete({ kind: "instagram", id: post.id, label: post.alt || `#${post.id}` })}
              >
                {t("adminContent.delete")}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PagesTable({ q, onDelete }: { q: string; onDelete: (removal: Removal) => void }) {
  const { data, error, isLoading, refetch } = usePages(q);
  if (isLoading) return <LoadingBlock />;
  if (error) return <ContentError error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) return <EmptyState title={t("adminContent.pages.empty")} />;
  return (
    <Table>
      <THead>
        <tr>
          <Th>{t("adminContent.pages.field.title")}</Th>
          <Th>{t("adminContent.pages.field.slug")}</Th>
          <Th>{t("adminContent.pages.faq")}</Th>
          <Th>{t("adminContent.pages.updated")}</Th>
          <Th>{t("adminContent.status")}</Th>
          <Th>
            <span className="sr-only">{t("adminContent.actions")}</span>
          </Th>
        </tr>
      </THead>
      <TBody>
        {data.map((page: AdminPageRow) => (
          <Tr key={page.id}>
            <Td className="font-medium">
              <Link href={routes.admin.contentPage(page.id)} className="hover:text-gold">
                {page.title}
              </Link>
            </Td>
            <Td className="text-muted">/{page.slug}</Td>
            <Td>{page.faq_count}</Td>
            <Td className="whitespace-nowrap">{formatShortDate(page.updated_at)}</Td>
            <Td>
              <StatusChip tone={page.is_published ? "success" : "neutral"}>
                {page.is_published ? t("adminContent.pages.published") : t("adminContent.pages.draft")}
              </StatusChip>
            </Td>
            <Td className="text-right">
              <RowMenu
                label={t("adminContent.rowActions", { name: page.title })}
                items={[
                  { label: t("adminContent.edit"), href: routes.admin.contentPage(page.id) },
                  {
                    label: t("adminContent.delete"),
                    tone: "danger",
                    onSelect: () => onDelete({ kind: "page", id: page.id, label: page.title }),
                  },
                ]}
              />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
}

export function ContentManager() {
  const url = useUrlState();
  const tab = (CONTENT_TABS as string[]).includes(url.get("tab"))
    ? (url.get("tab") as ContentTab)
    : "banners";
  const [banner, setBanner] = useState<AdminBanner | null | undefined>(undefined);
  const [post, setPost] = useState<AdminInstagramPost | null | undefined>(undefined);
  const [removal, setRemoval] = useState<Removal>(null);
  const deleteBanner = useDeleteBanner();
  const deletePost = useDeleteInstagramPost();
  const deletePage = useDeletePage();
  const removing = deleteBanner.isPending || deletePost.isPending || deletePage.isPending;

  const confirmRemoval = () => {
    if (!removal) return;
    const options = { onSettled: () => setRemoval(null) };
    if (removal.kind === "banner") deleteBanner.mutate(removal.id, options);
    if (removal.kind === "instagram") deletePost.mutate(removal.id, options);
    if (removal.kind === "page") deletePage.mutate(removal.id, options);
  };

  return (
    <>
      <AdminPageHeader title={t("adminContent.title")}>
        {tab === "banners" ? (
          <AdminButton onClick={() => setBanner(null)}>+ {t("adminContent.banners.add")}</AdminButton>
        ) : null}
        {tab === "instagram" ? (
          <AdminButton onClick={() => setPost(null)}>+ {t("adminContent.instagram.add")}</AdminButton>
        ) : null}
        {tab === "pages" ? (
          <AdminButtonLink href={routes.admin.contentPageNew}>
            + {t("adminContent.pages.add")}
          </AdminButtonLink>
        ) : null}
      </AdminPageHeader>
      <AdminPageBody>
        <Tabs
          label={t("adminContent.tabsLabel")}
          controls="content-panel"
          value={tab}
          onChange={(value) => url.set({ tab: value === "banners" ? null : value })}
          items={CONTENT_TABS.map((value) => ({ value, label: t(`adminContent.tabs.${value}`) }))}
        />
        <section
          id="content-panel"
          aria-label={t(`adminContent.tabs.${tab}`)}
          className="border-admin-line rounded-md border bg-white"
        >
          {tab === "banners" ? <BannersTable onEdit={setBanner} onDelete={setRemoval} /> : null}
          {tab === "instagram" ? <InstagramGrid onEdit={setPost} onDelete={setRemoval} /> : null}
          {tab === "pages" ? <PagesTable q="" onDelete={setRemoval} /> : null}
        </section>
      </AdminPageBody>
      {banner !== undefined ? <BannerDialog banner={banner} onClose={() => setBanner(undefined)} /> : null}
      {post !== undefined ? <InstagramDialog post={post} onClose={() => setPost(undefined)} /> : null}
      <ConfirmDialog
        open={removal !== null}
        tone="danger"
        title={t("adminContent.confirmDelete", { name: removal?.label ?? "" })}
        confirmLabel={t("adminContent.delete")}
        cancelLabel={t("adminContent.cancel")}
        pending={removing}
        onCancel={() => setRemoval(null)}
        onConfirm={confirmRemoval}
      />
    </>
  );
}
