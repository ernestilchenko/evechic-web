import { t } from "@/lib/i18n";

export function AdminShellFallback() {
  return (
    <div className="bg-admin-bg min-h-dvh lg:flex">
      <div className="bg-ink hidden h-dvh w-[248px] shrink-0 lg:block" />
      <p role="status" className="text-placeholder flex-1 px-8 py-24 text-center text-[12.5px]">
        {t("admin.common.loading")}
      </p>
    </div>
  );
}
