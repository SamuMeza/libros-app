export type Brand = 'hl' | 'kc';

export interface Product {
  id: string;
  name: string;
  author?: string;
  category?: string;
  price: number;
  image: string;
  stockStatus: 'in_stock' | 'pre_order' | 'customizable';
}

export interface ProductCardProps {
  product: Product;
  brand: Brand;
  onAddToCart: (productId: string) => void;
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  duration?: number;
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export interface SkeletonProps {
  className?: string;
}

export interface ProductCardSkeletonProps {
  aspectRatio?: '3/4' | '1/1';
}

export interface HeaderProps {
  cartCount?: number;
}

export * from './cart';
export * from './order';
export * from './payment';
