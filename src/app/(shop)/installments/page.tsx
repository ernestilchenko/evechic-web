import type { Metadata } from "next";

import { routes } from "@/data/routes";
import { PageBreadcrumbs } from "@/features/content/components/PageBreadcrumbs";

const TITLE = "Покупка частинами monobank | Universal Bank";

export const metadata: Metadata = {
  title: TITLE,
  alternates: { canonical: routes.installments },
};

export default function InstallmentsPage() {
  return (
    <article className="container-page pt-8 pb-20 sm:pb-[88px]">
      <PageBreadcrumbs title={TITLE} path={routes.installments} />
      <header className="flex max-w-[820px] flex-col gap-5 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <h1 className="font-serif text-[36px] leading-[1.1] font-light sm:text-[52px]">{TITLE}</h1>
      </header>
      <div className="border-line flex max-w-[720px] flex-col gap-5 border-t pt-10 text-[15px] leading-[1.75]">
        <p className="font-semibold">Надавач послуг:</p>
        <p>АТ «УНІВЕРСАЛ БАНК» ліцензія НБУ No92 від 20.01.1994, номер у держреєстрі банків No 226.</p>
        <p className="font-semibold">Характеристики продукту:</p>
        <ul className="flex list-none flex-col gap-1.5">
          <li>- Мінімальна сума розстрочки: 2 грн</li>
          <li>- Максимальна сума розстрочки: 400 000 грн</li>
          <li>- Реальна річна процентна ставка: 0,000001%</li>
          <li>- Доступний строк, платежів: 3 - 25</li>
          <li>- Порядок погашення: щомісячні платежі рівними частинами</li>
          <li>- Перший платіж у момент оформлення покупки</li>
          <li>
            - Інформація про істотні характеристики продукту та попередження розміщені на сайті продукту{" "}
            <a
              href="https://chast.monobank.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              chast.monobank.ua
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
