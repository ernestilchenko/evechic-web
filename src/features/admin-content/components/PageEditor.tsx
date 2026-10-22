"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  Checkbox,
  Field,
  getFieldErrors,
  LoadingBlock,
  Panel,
  TextArea,
  TextInput,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { usePage, useSavePage } from "../hooks/useContent";
import { toFormData } from "../services/contentService";
import type { AdminPage } from "../types";
import { ContentError } from "./ContentError";
import { FaqEditor } from "./FaqEditor";
import { ImageInput } from "./ImageInput";

type Draft = Pick<
  AdminPage,
  "slug" | "title" | "meta_title" | "meta_description" | "lead" | "body" | "image_alt" | "is_published"
>;

function PageForm({ page }: { page: AdminPage | null }) {
  const router = useRouter();
  const mutation = useSavePage();
  const [draft, setDraft] = useState<Draft>({
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    meta_title: page?.meta_title ?? "",
    meta_description: page?.meta_description ?? "",
    lead: page?.lead ?? "",
    body: page?.body ?? "",
    image_alt: page?.image_alt ?? "",
    is_published: page?.is_published ?? true,
  });
  const [image, setImage] = useState<{ file: File | null; remove: boolean }>({ file: null, remove: false });
  const errors = getFieldErrors(mutation.error);
  const set = (patch: Partial<Draft>) => setDraft((state) => ({ ...state, ...patch }));

  return (
    <Panel title={t("adminContent.pages.main")} titleId="page-main">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const body = toFormData({ ...draft, image: image.file, remove_image: image.remove || undefined });
          mutation.mutate(
            { id: page?.id ?? null, body },
            { onSuccess: (saved) => (page ? undefined : router.replace(routes.admin.contentPage(saved.id))) },
          );
        }}
      >
        <Field label={t("adminContent.pages.field.title")} error={errors.title}>
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={200}
              value={draft.title}
              onChange={(event) => set({ title: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminContent.pages.field.slug")}
          hint={t("adminContent.pages.slugHint")}
          error={errors.slug}
        >
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={80}
              pattern="^[a-z0-9-]+$"
              value={draft.slug}
              onChange={(event) => set({ slug: event.target.value.toLowerCase() })}
            />
          )}
        </Field>
        <Field label={t("adminContent.pages.field.metaTitle")} error={errors.meta_title}>
          {(props) => (
            <TextInput
              {...props}
              maxLength={200}
              value={draft.meta_title}
              onChange={(event) => set({ meta_title: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminContent.pages.field.metaDescription")} error={errors.meta_description}>
          {(props) => (
            <TextInput
              {...props}
              maxLength={300}
              value={draft.meta_description}
              onChange={(event) => set({ meta_description: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminContent.pages.field.lead")} error={errors.lead} className="sm:col-span-2">
          {(props) => (
            <TextArea
              {...props}
              rows={3}
              value={draft.lead}
              onChange={(event) => set({ lead: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminContent.pages.field.body")}
          hint={t("adminContent.pages.bodyHint")}
          error={errors.body}
          className="sm:col-span-2"
        >
          {(props) => (
            <TextArea
              {...props}
              rows={14}
              className="font-mono text-[12px]"
              value={draft.body}
              onChange={(event) => set({ body: event.target.value })}
            />
          )}
        </Field>
        <div className="sm:col-span-2">
          <ImageInput
            label={t("adminContent.image")}
            current={page?.image ?? null}
            error={errors.image}
            onChange={setImage}
          />
        </div>
        <Field label={t("adminContent.pages.field.imageAlt")} error={errors.image_alt}>
          {(props) => (
            <TextInput
              {...props}
              maxLength={200}
              value={draft.image_alt}
              onChange={(event) => set({ image_alt: event.target.value })}
            />
          )}
        </Field>
        <div className="flex items-end pb-2.5">
          <Checkbox
            label={t("adminContent.pages.isPublished")}
            checked={draft.is_published}
            onChange={(event) => set({ is_published: event.target.checked })}
          />
        </div>
        <div className="sm:col-span-2">
          <AdminButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? t("adminContent.saving") : t("adminContent.save")}
          </AdminButton>
        </div>
      </form>
    </Panel>
  );
}

export function PageEditor({ id }: { id: number | null }) {
  const { data: page, error, isLoading, refetch } = usePage(id);
  const back = { href: `${routes.admin.content}?tab=pages`, label: t("adminContent.title") };

  if (id === null) {
    return (
      <>
        <AdminPageHeader title={t("adminContent.pages.newTitle")} back={back} />
        <AdminPageBody>
          <PageForm page={null} />
        </AdminPageBody>
      </>
    );
  }

  if (isLoading || !page) {
    return (
      <>
        <AdminPageHeader title={t("adminContent.pages.editTitle")} back={back} />
        <AdminPageBody>
          {error ? <ContentError error={error} onRetry={() => refetch()} /> : <LoadingBlock />}
        </AdminPageBody>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title={page.title} back={back} />
      <AdminPageBody>
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_480px]">
          <PageForm key={page.updated_at} page={page} />
          <FaqEditor pageId={page.id} items={page.faq} />
        </div>
      </AdminPageBody>
    </>
  );
}
