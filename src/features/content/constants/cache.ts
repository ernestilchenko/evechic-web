export const contentCacheTags = {
  home: "content:home",
  pages: "content:pages",
  page: (slug: string) => `content:page:${slug}`,
} as const;
