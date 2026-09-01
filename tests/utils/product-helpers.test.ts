import { describe, it, expect } from 'vitest'
import {
  calculatePrice,
  formatPrice,
  getSizeVariants,
  getColorVariants,
} from '@/lib/utils/product-helpers'
import type { Variant } from '@/types/product'

// ─── Fixtures ───────────────────────────────────────────────────────────────

const sizeVariant: Variant = {
  name: 'Tamaño',
  options: [
    { label: 'A4', value: 'a4', price_adjustment: 0 },
    { label: 'A3', value: 'a3', price_adjustment: 5 },
  ],
}

const colorVariant: Variant = {
  name: 'Color',
  options: [
    { label: 'Rojo', value: 'rojo', price_adjustment: 2, color_hex: '#FF0000' },
    { label: 'Azul', value: 'azul', price_adjustment: 0, color_hex: '#0000FF' },
  ],
}

const noAdjustmentVariant: Variant = {
  name: 'Material',
  options: [{ label: 'Estándar', value: 'std', price_adjustment: 0 }],
}

// ─── calculatePrice ──────────────────────────────────────────────────────────

describe('calculatePrice', () => {
  it('returns base price and zero adjustment when no variants selected', () => {
    // ARRANGE
    const basePrice = 20
    const variants: Variant[] = [sizeVariant]

    // ACT
    const result = calculatePrice(basePrice, variants)

    // ASSERT
    expect(result.basePrice).toBe(20)
    expect(result.variantAdjustment).toBe(0)
    expect(result.finalPrice).toBe(20)
  })

  it('returns base price when selectedVariants is an empty object', () => {
    // ARRANGE
    const basePrice = 15
    const variants: Variant[] = [sizeVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, {})

    // ASSERT
    expect(result.finalPrice).toBe(15)
    expect(result.variantAdjustment).toBe(0)
  })

  it('adds size variant price_adjustment when size is selected', () => {
    // ARRANGE
    const basePrice = 10
    const variants: Variant[] = [sizeVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, { size: 'a3' })

    // ASSERT
    expect(result.basePrice).toBe(10)
    expect(result.variantAdjustment).toBe(5)
    expect(result.finalPrice).toBe(15)
  })

  it('adds color variant price_adjustment when color is selected', () => {
    // ARRANGE
    const basePrice = 10
    const variants: Variant[] = [colorVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, { color: 'rojo' })

    // ASSERT
    expect(result.variantAdjustment).toBe(2)
    expect(result.finalPrice).toBe(12)
  })

  it('accumulates adjustments when both size and color are selected', () => {
    // ARRANGE
    const basePrice = 10
    const variants: Variant[] = [sizeVariant, colorVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, {
      size: 'a3',
      color: 'rojo',
    })

    // ASSERT
    expect(result.variantAdjustment).toBe(7) // 5 + 2
    expect(result.finalPrice).toBe(17)
  })

  it('returns zero adjustment when selected value does not match any option', () => {
    // ARRANGE
    const basePrice = 10
    const variants: Variant[] = [sizeVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, { size: 'inexistente' })

    // ASSERT
    expect(result.variantAdjustment).toBe(0)
    expect(result.finalPrice).toBe(10)
  })

  it('ignores unknown variant names (e.g. Material) — only tamaño/color are mapped', () => {
    // ARRANGE
    const basePrice = 10
    const variants: Variant[] = [noAdjustmentVariant]

    // ACT
    const result = calculatePrice(basePrice, variants, { size: 'std' })

    // ASSERT
    expect(result.variantAdjustment).toBe(0)
    expect(result.finalPrice).toBe(10)
  })

  it('handles an empty variants array gracefully', () => {
    // ARRANGE & ACT
    const result = calculatePrice(30, [], { size: 'a4', color: 'rojo' })

    // ASSERT
    expect(result.basePrice).toBe(30)
    expect(result.finalPrice).toBe(30)
  })

  it('handles zero base price', () => {
    // ARRANGE & ACT
    const result = calculatePrice(0, [sizeVariant], { size: 'a3' })

    // ASSERT
    expect(result.basePrice).toBe(0)
    expect(result.variantAdjustment).toBe(5)
    expect(result.finalPrice).toBe(5)
  })

  it('handles string price_adjustment values (coerced to number)', () => {
    // ARRANGE — simula datos JSON de Supabase donde puede venir como string
    const variantWithStringAdj: Variant = {
      name: 'Tamaño',
      options: [{ label: 'A3', value: 'a3', price_adjustment: '5' as unknown as number }],
    }

    // ACT
    const result = calculatePrice(10, [variantWithStringAdj], { size: 'a3' })

    // ASSERT
    expect(result.variantAdjustment).toBe(5)
    expect(result.finalPrice).toBe(15)
  })
})

// ─── formatPrice ─────────────────────────────────────────────────────────────

describe('formatPrice', () => {
  it('formats an integer price with two decimal places', () => {
    expect(formatPrice(10)).toBe('$10.00')
  })

  it('formats a decimal price correctly', () => {
    expect(formatPrice(9.5)).toBe('$9.50')
  })

  it('formats zero as $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('returns consistent toFixed(2) output — 1.005 rounds to $1.00 in V8 (IEEE 754)', () => {
    // NOTE: JavaScript toFixed() usa representación binaria de punto flotante.
    // 1.005 no puede representarse exactamente en binario → toFixed(2) → '1.00'
    // Este test documenta el comportamiento real de la implementación.
    expect(formatPrice(1.005)).toBe('$1.00')
  })

  it('formats a large price correctly', () => {
    expect(formatPrice(1250)).toBe('$1250.00')
  })
})

// ─── getSizeVariants ──────────────────────────────────────────────────────────

describe('getSizeVariants', () => {
  it('returns the variant named "tamaño" (case-insensitive)', () => {
    // ARRANGE
    const variants: Variant[] = [sizeVariant, colorVariant]

    // ACT
    const result = getSizeVariants(variants)

    // ASSERT
    expect(result).toBe(sizeVariant)
  })

  it('returns the variant named "size" (english alias)', () => {
    // ARRANGE
    const sizeEnVariant: Variant = { name: 'Size', options: [] }
    const variants: Variant[] = [colorVariant, sizeEnVariant]

    // ACT
    const result = getSizeVariants(variants)

    // ASSERT
    expect(result).toBe(sizeEnVariant)
  })

  it('returns undefined when no size variant exists', () => {
    // ARRANGE
    const variants: Variant[] = [colorVariant, noAdjustmentVariant]

    // ACT
    const result = getSizeVariants(variants)

    // ASSERT
    expect(result).toBeUndefined()
  })

  it('returns undefined for empty variants array', () => {
    expect(getSizeVariants([])).toBeUndefined()
  })
})

// ─── getColorVariants ─────────────────────────────────────────────────────────

describe('getColorVariants', () => {
  it('returns the variant named "color" (case-insensitive)', () => {
    // ARRANGE
    const variants: Variant[] = [sizeVariant, colorVariant]

    // ACT
    const result = getColorVariants(variants)

    // ASSERT
    expect(result).toBe(colorVariant)
  })

  it('returns undefined when no color variant exists', () => {
    // ARRANGE
    const variants: Variant[] = [sizeVariant, noAdjustmentVariant]

    // ACT
    const result = getColorVariants(variants)

    // ASSERT
    expect(result).toBeUndefined()
  })

  it('returns undefined for empty variants array', () => {
    expect(getColorVariants([])).toBeUndefined()
  })
})
