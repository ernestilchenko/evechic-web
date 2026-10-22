import { routes } from "@/data/routes";

export const contentPagePaths = {
  about: routes.about,
  delivery: routes.delivery,
  returns: routes.returns,
  "size-guide": routes.sizeGuide,
  care: routes.care,
  faq: routes.faq,
  offer: routes.offer,
  privacy: routes.privacy,
} as const;

export type ContentPageSlug = keyof typeof contentPagePaths;

export const contentPageGroups: Record<ContentPageSlug, "about" | "help" | "legal"> = {
  about: "about",
  delivery: "help",
  returns: "help",
  "size-guide": "help",
  care: "help",
  faq: "help",
  offer: "legal",
  privacy: "legal",
};
