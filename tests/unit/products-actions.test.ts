import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks ANTES de los imports que los consumen
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import {
  getProducts,
  getProductBySlug,
  getProductCategories,
  calculateProductPrice,
} from '@/lib/actions/products'
import { createClient } from '@/lib/supabase/server'

// ─── Helpers para construir mocks de Supabase query builder ──────────────────

function buildQueryMock(resolvedValue: { data: unknown; error: unknown; count?: number }) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolvedValue),
  }
  // Para queries que no usan .single(), el builder resuelve en el .range()
  builder.range.mockResolvedValue(resolvedValue)
  return builder
}

// ─── Fixture de producto de Supabase ─────────────────────────────────────────

const mockRawProduct = {
  id: 'prod-1',
  name: 'Sticker Pack',
  description: 'Pack de stickers',
  price: 10,
  images: ['/img/sticker.png'],
  category_id: 'cat-1',
  brand: 'kc' as const,
  variants: [
    { name: 'Color', options: [{ label: 'Rojo', value: 'rojo', price_adjustment: 2 }] },
  ],
  customization_options: [
    { type: 'text', label: 'Texto personalizado', max_length: 30, placeholder: 'Escribe aquí' },
  ],
  is_active: true,
  created_by: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockCategory = {
  id: 'cat-1',
  name: 'Stickers',
  slug: 'stickers',
  brand: 'kc' as const,
  description: null,
  image_url: null,
  sort_order: 1,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
}

// ─── getProducts ─────────────────────────────────────────────────────────────

describe('getProducts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns success with products list when Supabase responds without error', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({
      data: [mockRawProduct],
      error: null,
      count: 1,
    })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data?.products).toHaveLength(1)
    expect(result.data?.products[0].id).toBe('prod-1')
    expect(result.data?.total).toBe(1)
  })

  it('returns success with empty products list when no products exist', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({ data: [], error: null, count: 0 })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data?.products).toHaveLength(0)
    expect(result.data?.total).toBe(0)
    expect(result.data?.totalPages).toBe(0)
  })

  it('returns failure with error message when Supabase returns an error', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({
      data: null,
      error: { message: 'DB error' },
      count: null,
    })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('parses variants correctly from raw JSON data', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({
      data: [mockRawProduct],
      error: null,
      count: 1,
    })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.data?.products[0].variants).toHaveLength(1)
    expect(result.data?.products[0].variants[0].name).toBe('Color')
  })

  it('parses customization_options correctly from raw JSON data', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({
      data: [mockRawProduct],
      error: null,
      count: 1,
    })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.data?.products[0].customization_options).toHaveLength(1)
    expect(result.data?.products[0].customization_options[0].type).toBe('text')
  })

  it('returns empty arrays for null variants/customization_options in raw data', async () => {
    // ARRANGE
    const productWithNulls = { ...mockRawProduct, variants: null, customization_options: null }
    const queryBuilder = buildQueryMock({
      data: [productWithNulls],
      error: null,
      count: 1,
    })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.data?.products[0].variants).toEqual([])
    expect(result.data?.products[0].customization_options).toEqual([])
  })

  it('calculates totalPages correctly with pageSize', async () => {
    // ARRANGE
    const queryBuilder = buildQueryMock({ data: [], error: null, count: 50 })
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(queryBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProducts({ pageSize: 24 })

    // ASSERT
    expect(result.data?.totalPages).toBe(3) // ceil(50/24) = 3
  })

  it('returns failure gracefully when createClient throws', async () => {
    // ARRANGE
    vi.mocked(createClient).mockRejectedValue(new Error('connection failed'))

    // ACT
    const result = await getProducts({})

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

// ─── getProductBySlug ─────────────────────────────────────────────────────────

describe('getProductBySlug', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns success with product data when found', async () => {
    // ARRANGE
    const singleBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { ...mockRawProduct, category: mockCategory },
        error: null,
      }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(singleBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProductBySlug('prod-1')

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data?.id).toBe('prod-1')
    expect(result.data?.name).toBe('Sticker Pack')
  })

  it('returns success with null data when product is not found', async () => {
    // ARRANGE
    const singleBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(singleBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProductBySlug('no-existe')

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data).toBeNull()
  })

  it('returns failure when createClient throws', async () => {
    // ARRANGE
    vi.mocked(createClient).mockRejectedValue(new Error('network error'))

    // ACT
    const result = await getProductBySlug('any-id')

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

// ─── getProductCategories ─────────────────────────────────────────────────────

describe('getProductCategories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns categories with correct product counts', async () => {
    // ARRANGE
    // catBuilder: .select().eq().eq().order() — order resuelve
    const catBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockCategory], error: null }),
    }

    // prodBuilder: .select().eq().eq() — la action awaita el builder directamente.
    // Lo convertimos en un thenable con .then() para que `await prodBuilder` resuelva.
    const prodResolvedValue = {
      data: [{ category_id: 'cat-1' }, { category_id: 'cat-1' }],
      error: null,
    }
    const prodBuilder: Record<string, unknown> = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }
    // Hace que `await prodBuilder` resuelva con prodResolvedValue
    prodBuilder.then = (resolve: (value: unknown) => void) => resolve(prodResolvedValue)

    const fromMock = vi.fn()
      .mockReturnValueOnce(catBuilder)  // primera llamada: categories
      .mockReturnValueOnce(prodBuilder) // segunda llamada: products

    vi.mocked(createClient).mockResolvedValue({
      from: fromMock,
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProductCategories()

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data![0].name).toBe('Stickers')
    expect(result.data![0].productCount).toBe(2)
  })

  it('returns failure when categories query fails', async () => {
    // ARRANGE
    const catBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(catBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await getProductCategories()

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

// ─── calculateProductPrice ────────────────────────────────────────────────────

describe('calculateProductPrice', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns base price and zero adjustment when no variants selected', async () => {
    // ARRANGE
    const singleBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { price: 20, variants: [] },
        error: null,
      }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(singleBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await calculateProductPrice({ productId: 'prod-1' })

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data?.basePrice).toBe(20)
    expect(result.data?.variantAdjustment).toBe(0)
    expect(result.data?.finalPrice).toBe(20)
  })

  it('adds variant adjustment when size is selected', async () => {
    // ARRANGE
    const variantsRaw = [
      { name: 'Tamaño', options: [{ label: 'A3', value: 'a3', price_adjustment: 5 }] },
    ]
    const singleBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { price: 10, variants: variantsRaw },
        error: null,
      }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(singleBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await calculateProductPrice({
      productId: 'prod-1',
      selectedVariants: { size: 'a3' },
    })

    // ASSERT
    expect(result.success).toBe(true)
    expect(result.data?.variantAdjustment).toBe(5)
    expect(result.data?.finalPrice).toBe(15)
  })

  it('returns failure when product is not found', async () => {
    // ARRANGE
    const singleBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    }
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue(singleBuilder),
    } as unknown as ReturnType<typeof createClient>)

    // ACT
    const result = await calculateProductPrice({ productId: 'no-existe' })

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toContain('no encontrado')
  })

  it('returns failure gracefully when createClient throws', async () => {
    // ARRANGE
    vi.mocked(createClient).mockRejectedValue(new Error('network error'))

    // ACT
    const result = await calculateProductPrice({ productId: 'prod-1' })

    // ASSERT
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
