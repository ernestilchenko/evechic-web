export type CatalogSort = "newest" | "price_asc" | "price_desc" | "popular";

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
  sort?: CatalogSort;
  page?: number;
  page_size?: number;
};

export type ListingSearchParams = Record<string, string | string[] | undefined>;

export type ListingState = {
  categories: string[];
  sizes: string[];
  colors: number[];
  priceMin: number | null;
  priceMax: number | null;
  inStock: boolean;
  sort: CatalogSort;
  page: number;
  q: string;
};

export type CategoryFilterMode = "link" | "param";
