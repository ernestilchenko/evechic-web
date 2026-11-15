"use client";

import Image from "next/image";
import { useState } from "react";

import { Checkbox, Field } from "@/features/admin";
import { t } from "@/lib/i18n";

import { IMAGE_ACCEPT } from "../constants/content";

type ImageInputProps = {
  label: string;
  current: string | null;
  error?: string;
  removable?: boolean;
  required?: boolean;
  onChange: (value: { file: File | null; remove: boolean }) => void;
};

export function ImageInput({ label, current, error, removable = true, required, onChange }: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(current);
  const [file, setFile] = useState<File | null>(null);
  const [remove, setRemove] = useState(false);

  return (
    <Field label={label} error={error}>
      {(props) => (
        <div className="flex flex-wrap items-center gap-4">
          {preview && !remove ? (
            <span className="bg-sand relative block h-24 w-20 shrink-0 overflow-hidden rounded">
              <Image
                src={preview}
                alt=""
                fill
                sizes="80px"
                className="object-cover object-top"
                unoptimized={preview.startsWith("blob:")}
              />
            </span>
          ) : null}
          <div className="flex flex-col gap-2">
            <input
              {...props}
              type="file"
              accept={IMAGE_ACCEPT}
              required={required && !current}
              className="text-[12px]"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                setRemove(false);
                setPreview(next ? URL.createObjectURL(next) : current);
                onChange({ file: next, remove: false });
              }}
            />
            {removable && current && !file ? (
              <Checkbox
                label={t("adminContent.removeImage")}
                checked={remove}
                onChange={(event) => {
                  setRemove(event.target.checked);
                  onChange({ file: null, remove: event.target.checked });
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </Field>
  );
}
