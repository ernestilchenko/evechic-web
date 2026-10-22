"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import {
  AdminButton,
  Checkbox,
  Field,
  getErrorMessage,
  getFieldErrors,
  TextArea,
  TextInput,
} from "@/features/admin";
import { t } from "@/lib/i18n";

import { BANNER_PLACEMENTS } from "../constants/content";
import { useSaveBanner } from "../hooks/useContent";
import { toFormData } from "../services/contentService";
import type { AdminBanner, BannerPlacement } from "../types";
import { ImageInput } from "./ImageInput";

const TEXT_FIELDS = [
  ["eyebrow", 120],
  ["title", 200],
  ["subtitle", 255],
  ["image_alt", 200],
  ["cta_label", 60],
  ["cta_url", 255],
  ["secondary_cta_label", 60],
  ["secondary_cta_url", 255],
] as const;

type TextField = (typeof TEXT_FIELDS)[number][0];

export function BannerDialog({ banner, onClose }: { banner: AdminBanner | null; onClose: () => void }) {
  const mutation = useSaveBanner();
  const [placement, setPlacement] = useState<BannerPlacement>(banner?.placement ?? "hero");
  const [texts, setTexts] = useState<Record<TextField, string>>(
    () =>
      Object.fromEntries(TEXT_FIELDS.map(([key]) => [key, banner?.[key] ?? ""])) as Record<TextField, string>,
  );
  const [text, setText] = useState(banner?.text ?? "");
  const [sortOrder, setSortOrder] = useState(String(banner?.sort_order ?? 0));
  const [active, setActive] = useState(banner?.is_active ?? true);
  const [image, setImage] = useState<{ file: File | null; remove: boolean }>({ file: null, remove: false });
  const errors = getFieldErrors(mutation.error);
  const formId = "banner-form";

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={banner ? t("adminContent.banners.editTitle") : t("adminContent.banners.createTitle")}
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
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const body = toFormData({
            placement,
            ...texts,
            text,
            sort_order: sortOrder || "0",
            is_active: active,
            image: image.file,
            remove_image: image.remove || undefined,
          });
          mutation.mutate({ id: banner?.id ?? null, body }, { onSuccess: onClose });
        }}
      >
        <Field label={t("adminContent.banners.placement")} error={errors.placement}>
          {(props) => (
            <Select
              {...props}
              value={placement}
              onChange={(event) => setPlacement(event.target.value as BannerPlacement)}
            >
              {BANNER_PLACEMENTS.map((value) => (
                <option key={value} value={value}>
                  {t(`adminContent.placement.${value}`)}
                </option>
              ))}
            </Select>
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
        {TEXT_FIELDS.map(([key, max]) => (
          <Field key={key} label={t(`adminContent.banners.field.${key}`)} error={errors[key]}>
            {(props) => (
              <TextInput
                {...props}
                required={key === "title"}
                maxLength={max}
                value={texts[key]}
                onChange={(event) => setTexts((state) => ({ ...state, [key]: event.target.value }))}
              />
            )}
          </Field>
        ))}
        <Field label={t("adminContent.banners.field.text")} error={errors.text} className="sm:col-span-2">
          {(props) => (
            <TextArea {...props} rows={3} value={text} onChange={(event) => setText(event.target.value)} />
          )}
        </Field>
        <div className="sm:col-span-2">
          <ImageInput
            label={t("adminContent.image")}
            current={banner?.image ?? null}
            error={errors.image}
            onChange={setImage}
          />
        </div>
        <Checkbox
          className="sm:col-span-2"
          label={t("adminContent.active")}
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        {mutation.error && Object.keys(errors).length === 0 ? (
          <p role="alert" className="text-sale text-[12px] sm:col-span-2">
            {getErrorMessage(mutation.error, t("adminContent.toast.saveFailed"))}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
