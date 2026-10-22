export type ProductListQuery = {
  category?: string;
  size?: string[];
  color?: number[];
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  sale?: boolean;
  new?: boolean;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  page_size?: number;
};
