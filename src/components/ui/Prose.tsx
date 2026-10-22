import { cn } from "@/lib/cn";

type ProseProps = {
  html: string;
  tone?: "light" | "dark";
  className?: string;
};

const structure = [
  "text-[15px] leading-[1.75]",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_p]:my-4",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-[30px] [&_h2]:leading-[1.15] [&_h2]:font-light sm:[&_h2]:text-[36px]",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-[24px] [&_h3]:leading-[1.2] [&_h3]:font-light",
  "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-[11px] [&_h4]:font-semibold [&_h4]:tracking-[0.16em] [&_h4]:uppercase",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:my-1.5 [&_li]:pl-1",
  "[&_strong]:font-semibold [&_em]:italic",
  "[&_a]:underline [&_a]:decoration-gold [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:transition-colors",
  "[&_blockquote]:border-gold [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-[22px] [&_blockquote]:italic",
  "[&_hr]:my-10",
  "[&_.prose-table]:my-6 [&_.prose-table]:overflow-x-auto [&_.prose-table]:border [&_.prose-table]:[-webkit-overflow-scrolling:touch]",
  "[&_table]:w-full [&_table]:min-w-[520px] [&_table]:border-collapse [&_table]:text-[13.5px]",
  "[&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:tracking-[0.12em] [&_th]:uppercase",
  "[&_td]:border-t [&_td]:px-4 [&_td]:py-3 [&_td]:whitespace-nowrap [&_td:first-child]:font-medium",
].join(" ");

const tones = {
  light: [
    "text-muted",
    "[&_h2]:text-ink [&_h3]:text-ink [&_h4]:text-ink [&_strong]:text-ink",
    "[&_li]:marker:text-gold",
    "[&_a]:text-ink hover:[&_a]:text-gold",
    "[&_blockquote]:text-ink [&_hr]:border-line",
    "[&_.prose-table]:border-line [&_th]:bg-sand [&_th]:text-ink [&_td]:border-line [&_td:first-child]:text-ink",
  ].join(" "),
  dark: [
    "text-footer-text",
    "[&_h2]:text-cream [&_h3]:text-cream [&_h4]:text-gold [&_strong]:text-cream",
    "[&_li]:marker:text-gold",
    "[&_a]:text-cream hover:[&_a]:text-gold",
    "[&_blockquote]:text-cream [&_hr]:border-footer-line",
    "[&_.prose-table]:border-footer-line [&_th]:bg-footer-line [&_th]:text-cream [&_td]:border-footer-line [&_td:first-child]:text-cream",
  ].join(" "),
} as const;

function wrapTables(html: string) {
  return html
    .replace(/<table/g, '<div class="prose-table" tabindex="0"><table')
    .replace(/<\/table>/g, "</table></div>");
}

export function Prose({ html, tone = "light", className }: ProseProps) {
  return (
    <div
      className={cn(structure, tones[tone], className)}
      dangerouslySetInnerHTML={{ __html: wrapTables(html) }}
    />
  );
}
