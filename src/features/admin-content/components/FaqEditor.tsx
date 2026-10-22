"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminButton, Field, Panel, TextArea, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useDeleteFaq, useReorderFaq, useSaveFaq } from "../hooks/useContent";
import type { AdminFaq } from "../types";

function FaqItemForm({
  pageId,
  item,
  onDone,
}: {
  pageId: number;
  item: AdminFaq | null;
  onDone?: () => void;
}) {
  const save = useSaveFaq(pageId);
  const [question, setQuestion] = useState(item?.question ?? "");
  const [answer, setAnswer] = useState(item?.answer ?? "");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate(
          { faqId: item?.id ?? null, body: { question: question.trim(), answer } },
          {
            onSuccess: () => {
              if (!item) {
                setQuestion("");
                setAnswer("");
              }
              onDone?.();
            },
          },
        );
      }}
    >
      <Field label={t("adminContent.faq.question")}>
        {(props) => (
          <TextInput
            {...props}
            required
            maxLength={255}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
        )}
      </Field>
      <Field label={t("adminContent.faq.answer")}>
        {(props) => (
          <TextArea
            {...props}
            required
            rows={3}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
        )}
      </Field>
      <AdminButton
        type="submit"
        variant={item ? "outline" : "primary"}
        disabled={save.isPending}
        className="self-start"
      >
        {item ? t("adminContent.save") : t("adminContent.faq.add")}
      </AdminButton>
    </form>
  );
}

export function FaqEditor({ pageId, items }: { pageId: number; items: AdminFaq[] }) {
  const reorder = useReorderFaq(pageId);
  const remove = useDeleteFaq(pageId);
  const [editing, setEditing] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<AdminFaq | null>(null);

  const move = (index: number, to: number) => {
    const ids = items.map((item) => item.id);
    const [id] = ids.splice(index, 1);
    ids.splice(to, 0, id);
    reorder.mutate(ids);
  };

  return (
    <Panel title={t("adminContent.faq.title")} titleId="page-faq">
      {items.length > 0 ? (
        <ol className="mb-5 flex flex-col">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="border-admin-row flex flex-col gap-2 border-t py-3 first:border-t-0 first:pt-0"
            >
              {editing === item.id ? (
                <FaqItemForm
                  key={item.updated_at}
                  pageId={pageId}
                  item={item}
                  onDone={() => setEditing(null)}
                />
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-[12.5px] font-semibold">{item.question}</p>
                    <p className="text-muted line-clamp-2 text-[12px]">{item.answer}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-[12px]">
                    <button
                      type="button"
                      disabled={index === 0 || reorder.isPending}
                      onClick={() => move(index, index - 1)}
                      aria-label={t("adminContent.faq.moveUp", { index: index + 1 })}
                      className="hover:bg-admin-bg rounded px-1.5 py-1 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1 || reorder.isPending}
                      onClick={() => move(index, index + 1)}
                      aria-label={t("adminContent.faq.moveDown", { index: index + 1 })}
                      className="hover:bg-admin-bg rounded px-1.5 py-1 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(item.id)}
                      className="px-1.5 py-1 hover:underline"
                    >
                      {t("adminContent.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(item)}
                      className="text-sale px-1.5 py-1 hover:underline"
                    >
                      {t("adminContent.delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-placeholder mb-5 text-[12px]">{t("adminContent.faq.empty")}</p>
      )}
      <div className="border-admin-row border-t pt-5">
        <FaqItemForm pageId={pageId} item={null} />
      </div>
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminContent.confirmDelete", { name: toDelete?.question ?? "" })}
        confirmLabel={t("adminContent.delete")}
        cancelLabel={t("adminContent.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </Panel>
  );
}
