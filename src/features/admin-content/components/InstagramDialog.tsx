"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { AdminButton, Checkbox, Field, getErrorMessage, getFieldErrors, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useSaveInstagramPost } from "../hooks/useContent";
import { toFormData } from "../services/contentService";
import type { AdminInstagramPost } from "../types";
import { ImageInput } from "./ImageInput";

export function InstagramDialog({ post, onClose }: { post: AdminInstagramPost | null; onClose: () => void }) {
  const mutation = useSaveInstagramPost();
  const [url, setUrl] = useState(post?.url ?? "");
  const [alt, setAlt] = useState(post?.alt ?? "");
  const [sortOrder, setSortOrder] = useState(String(post?.sort_order ?? 0));
  const [active, setActive] = useState(post?.is_active ?? true);
  const [file, setFile] = useState<File | null>(null);
  const errors = getFieldErrors(mutation.error);
  const formId = "instagram-form";

  return (
    <Dialog
      open
      onClose={onClose}
      title={post ? t("adminContent.instagram.editTitle") : t("adminContent.instagram.createTitle")}
      closeLabel={t("adminContent.cancel")}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            {t("adminContent.cancel")}
          </AdminButton>
          <AdminButton type="submit" form={formId} disabled={mutation.isPending}>
            {mutation.isPending ? t("adminContent.saving") : t("adminContent.save")}
          </AdminButton>
        </>
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const body = toFormData({
            url: url.trim() || undefined,
            alt,
            sort_order: sortOrder || "0",
            is_active: active,
            image: file,
          });
          mutation.mutate({ id: post?.id ?? null, body }, { onSuccess: onClose });
        }}
      >
        <ImageInput
          label={t("adminContent.image")}
          current={post?.image ?? null}
          removable={false}
          required
          error={errors.image}
          onChange={(value) => setFile(value.file)}
        />
        <Field
          label={t("adminContent.instagram.url")}
          hint={t("adminContent.instagram.urlHint")}
          error={errors.url}
        >
          {(props) => (
            <TextInput
              {...props}
              type="url"
              maxLength={500}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          )}
        </Field>
        <Field label={t("adminContent.instagram.alt")} error={errors.alt}>
          {(props) => (
            <TextInput
              {...props}
              maxLength={200}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          )}
        </Field>
        <Field label={t("adminContent.sortOrder")} error={errors.sort_order}>
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />
          )}
        </Field>
        <Checkbox
          label={t("adminContent.active")}
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        {mutation.error && Object.keys(errors).length === 0 ? (
          <p role="alert" className="text-sale text-[12px]">
            {getErrorMessage(mutation.error, t("adminContent.toast.saveFailed"))}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
