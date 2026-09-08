'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  GetProductsFilters,
  GetProductsResponse,
  GetProductBySlugResponse,
  GetProductCategoriesResponse,
  CalculatePriceInput,
  CalculatePriceResponse,
  Product,
  Variant,
  CustomizationOption,
} from '@/types/product';

function parseVariants(raw: unknown): Variant[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (v): v is Variant =>
      typeof v === 'object' &&
      v !== null &&
      'name' in v &&
      'options' in v &&
      Array.isArray((v as Variant).options)
  );
}

function parseCustomizationOptions(raw: unknown): CustomizationOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (o): o is CustomizationOption =>
      typeof o === 'object' &&
      o !== null &&
      'type' in o &&
      'label' in o &&
      'max_length' in o &&
      (o as CustomizationOption).type === 'text'
  );
}

export async function getProducts(
  filters: GetProductsFilters = {}
): Promise<GetProductsResponse> {
  try {
    const supabase = await createClient();
    const {
      categoryIds,
      minPrice,
      maxPrice,
      search,
      sort = 'relevance',
      page = 1,
      pageSize = 24,
    } = filters;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('brand', 'kc')
      .eq('is_active', true);

    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'alpha':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('name', { ascending: true });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: 'Error al consultar productos' };
    }

    const products: Product[] = (data || []).map((p) => ({
      ...p,
      images: p.images || [],
      variants: parseVariants(p.variants),
      customization_options: parseCustomizationOptions(p.customization_options),
    }));

    return {
      success: true,
      data: {
        products,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  } catch {
    return { success: false, error: 'Error al consultar productos' };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<GetProductBySlugResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('brand', 'kc')
      .eq('is_active', true)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return { success: true, data: null };
    }

    const product: Product = {
      ...data,
      images: data.images || [],
      variants: parseVariants(data.variants),
      customization_options: parseCustomizationOptions(data.customization_options),
    };

    return {
      success: true,
      data: {
        ...product,
        category: data.category,
      },
    };
  } catch {
    return { success: false, error: 'Error al consultar el producto' };
  }
}

export async function getProductCategories(): Promise<GetProductCategoriesResponse> {
  try {
    const supabase = await createClient();

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('brand', 'kc')
      .eq('is_active', true)
      .order('sort_order');

    if (catError) {
      return { success: false, error: 'Error al consultar categorías' };
    }

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('category_id')
      .eq('brand', 'kc')
      .eq('is_active', true);

    if (prodError) {
      return { success: false, error: 'Error al consultar productos' };
    }

    const countMap = new Map<string, number>();
    (products || []).forEach((p) => {
      if (p.category_id) {
        countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
      }
    });

    return {
      success: true,
      data: (categories || []).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        productCount: countMap.get(c.id) || 0,
      })),
    };
  } catch {
    return { success: false, error: 'Error al consultar categorías' };
  }
}

export async function calculateProductPrice(
  input: CalculatePriceInput
): Promise<CalculatePriceResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('price, variants')
      .eq('id', input.productId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { success: false, error: 'Producto no encontrado' };
    }

    const basePrice = Number(data.price);
    let variantAdjustment = 0;
    const variants = parseVariants(data.variants);

    if (input.selectedVariants) {
      for (const variant of variants) {
        const selectedValue =
          variant.name.toLowerCase() === 'tamaño'
            ? input.selectedVariants.size
            : variant.name.toLowerCase() === 'color'
              ? input.selectedVariants.color
              : undefined;

        if (selectedValue) {
          const option = variant.options.find((o) => o.value === selectedValue);
          if (option) {
            variantAdjustment += Number(option.price_adjustment);
          }
        }
      }
    }

    return {
      success: true,
      data: {
        basePrice,
        variantAdjustment,
        finalPrice: basePrice + variantAdjustment,
      },
    };
  } catch {
    return { success: false, error: 'Error al calcular el precio' };
  }
}
