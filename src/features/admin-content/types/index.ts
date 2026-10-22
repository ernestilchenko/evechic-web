export type BannerPlacement = "hero" | "lookbook";

export type AdminBanner = {
  id: number;
  placement: BannerPlacement;
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
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminInstagramPost = {
  id: number;
  image: string | null;
  url: string;
  alt: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminFaq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminPageRow = {
  id: number;
  slug: string;
  title: string;
  is_published: boolean;
  faq_count: number;
  updated_at: string;
};

export type AdminPage = {
  id: number;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  lead: string;
  body: string;
  image: string | null;
  image_alt: string;
  is_published: boolean;
  faq: AdminFaq[];
  created_at: string;
  updated_at: string;
};

export type FormValue = string | number | boolean | File | null | undefined;
export type ContentTab = "banners" | "instagram" | "pages";
