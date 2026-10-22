export type Banner = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  text: string;
  image: string | null;
  image_alt: string;
  cta_label: string;
  cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
};

export type InstagramPost = {
  id: number;
  image: string;
  url: string;
  alt: string;
};

export type HomeContent = {
  hero: Banner | null;
  lookbook: Banner | null;
  instagram: InstagramPost[];
};

export type FaqItem = { question: string; answer: string };

export type ContentPage = {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  lead: string;
  body: string;
  image: string | null;
  image_alt: string;
  faq: FaqItem[];
  updated_at: string;
};

export type ContentPageSummary = Pick<ContentPage, "slug" | "title" | "updated_at">;
