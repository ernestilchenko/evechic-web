export type HtmlSection = { title: string; html: string };

export type HtmlStat = { value: string; label: string };

const entities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

export function htmlToText(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => entities[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

export function splitByHeading(html: string, tag: "h2" | "h3") {
  const parts = html.split(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  const sections: HtmlSection[] = [];
  for (let index = 1; index < parts.length; index += 2) {
    sections.push({ title: htmlToText(parts[index]), html: (parts[index + 1] ?? "").trim() });
  }
  return { intro: parts[0].trim(), sections };
}

export function extractStats(html: string): { html: string; stats: HtmlStat[] } {
  const list = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!list) return { html, stats: [] };
  const items = [...list[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((item) =>
    item[1].trim().match(/^<strong>([\s\S]*?)<\/strong>([\s\S]*)$/i),
  );
  if (items.length < 2 || items.some((item) => !item)) return { html, stats: [] };
  const stats = items.map((item) => ({ value: htmlToText(item![1]), label: htmlToText(item![2]) }));
  return { html: html.replace(list[0], "").trim(), stats };
}
