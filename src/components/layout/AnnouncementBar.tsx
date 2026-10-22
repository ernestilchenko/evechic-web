import { t } from "@/lib/i18n";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-sand px-4 py-[14px] text-center text-[10.5px] font-medium tracking-[0.2em] uppercase">
      {t("layout.announcement")}
    </div>
  );
}
