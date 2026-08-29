export type BookStatus = 'available' | 'pre_order' | 'out_of_stock';
export type StockStatus = 'in_stock' | 'on_demand';
export type BookSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha';
export type AvailabilityFilter = 'in_stock' | 'on_demand' | 'all';
export type ContactRequestStatus = 'pending' | 'contacted' | 'resolved';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  images: string[];
  slug: string;
  category_id: string;
  status: BookStatus;
  stock_status: StockStatus;
  delivery_days: number;
  editorial: string | null;
  pages: number | null;
  language: string | null;
  binding: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookWithCategory extends Book {
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface BookExtra {
  id: string;
  book_id: string;
  product_id: string;
  is_default: boolean;
  sort_order: number;
}

export interface BookExtraWithProduct extends BookExtra {
  products: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface BookFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityFilter;
  search?: string;
  sort?: BookSort;
  page?: number;
  pageSize?: number;
}

export interface BookListResult {
  books: BookWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ContactRequest {
  id: string;
  user_id: string | null;
  book_title: string;
  book_author: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  status: ContactRequestStatus;
  created_at: string;
}

export interface ContactRequestCreate {
  book_title: string;
  book_author?: string;
  email: string;
  phone?: string;
  message?: string;
  user_id?: string;
}
