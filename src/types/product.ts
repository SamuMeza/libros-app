export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  category_id: string | null;
  brand: 'kc';
  variants: Variant[];
  customization_options: CustomizationOption[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  brand: 'hl' | 'kc';
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Variant {
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  label: string;
  price_adjustment: number;
  value: string;
  color_hex?: string;
}

export interface CustomizationOption {
  type: 'text';
  label: string;
  max_length: number;
  placeholder: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface GetProductsFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha';
  page?: number;
  pageSize?: number;
}

export interface GetProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}

export interface GetProductBySlugResponse {
  success: boolean;
  data?: ProductWithCategory | null;
  error?: string;
}

export interface GetProductCategoriesResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
  error?: string;
}

export interface CalculatePriceInput {
  productId: string;
  selectedVariants?: {
    size?: string;
    color?: string;
  };
}

export interface CalculatePriceResponse {
  success: boolean;
  data?: {
    basePrice: number;
    variantAdjustment: number;
    finalPrice: number;
  };
  error?: string;
}
