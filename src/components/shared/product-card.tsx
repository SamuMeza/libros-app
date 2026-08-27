import React from 'react';

type Brand = 'hl' | 'kc';

interface Product {
  id: string;
  name: string;
  author?: string;
  category?: string;
  price: number;
  image: string;
  stockStatus: 'in_stock' | 'pre_order' | 'customizable';
}

interface ProductCardProps {
  product: Product;
  brand: Brand;
  onAddToCart: (productId: string) => void;
}

const STOCK_LABELS: Record<Product['stockStatus'], string> = {
  in_stock: 'EN STOCK',
  pre_order: 'POR ENCARGO',
  customizable: 'PERSONALIZABLE',
};

const STOCK_COLORS: Record<Product['stockStatus'], string> = {
  in_stock: 'bg-green-500',
  pre_order: 'bg-amber-500',
  customizable: 'bg-purple-500',
};

export default function ProductCard({ product, brand, onAddToCart }: ProductCardProps) {
  const aspectRatio = brand === 'hl' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <div className="group relative rounded-lg overflow-hidden bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className={`relative ${aspectRatio} overflow-hidden bg-muted`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Stock Badge */}
        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded ${STOCK_COLORS[product.stockStatus]}`}>
          {STOCK_LABELS[product.stockStatus]}
        </span>

        {/* Brand Badge */}
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded ${brand === 'hl' ? 'bg-hl-primary' : 'bg-kc-primary'}`}>
          {brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
        </span>

        {/* Floating Add to Cart */}
        <button
          onClick={() => onAddToCart(product.id)}
          className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <p className={`text-xs font-medium ${brand === 'hl' ? 'text-hl-primary' : 'text-kc-primary'}`}>
          {brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
        </p>
        <h3 className="text-sm font-semibold mt-1 line-clamp-2">{product.name}</h3>
        {(product.author || product.category) && (
          <p className="text-xs text-muted-foreground mt-1">
            {product.author || product.category}
          </p>
        )}
        <p className="text-lg font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}
