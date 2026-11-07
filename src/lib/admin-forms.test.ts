// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  parseCategoryForm,
  parsePriceCents,
  parseProductForm,
  parseStockForm,
} from './admin-forms'

const img =
  'https://images.unsplash.com/photo-1600974712780-9dc8659e89f7?w=2400'
const form = (fields: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe('parsePriceCents', () => {
  // Accepts valid inputs
  it.each([
    { rule: 'whole dollars', input: '18', expected: 1800 },
    {
      rule: 'surrounding whitespace is trimmed',
      input: '  18.5 ',
      expected: 1850,
    },
    { rule: "a leading '$' is stripped", input: '$18.05', expected: 1805 },
    {
      rule: 'one decimal digit means tenths (the padEnd rule)',
      input: '0.7',
      expected: 70,
    },
    { rule: 'two decimals keep a leading zero', input: '0.07', expected: 7 },
    { rule: 'two decimal digits', input: '3.07', expected: 307 },
    {
      rule: 'the 6-digit maximum is accepted',
      input: '305455',
      expected: 30545500,
    },
  ])('accepts $input ($rule)', ({ input, expected }) => {
    expect(parsePriceCents(input)).toBe(expected)
  })
  // Rejects invalid inputs
  it.each([
    { rule: 'three decimals', input: '18.505' },
    { rule: 'negative', input: '-1' },
    { rule: 'exponent notation', input: '1e3' },
    { rule: 'empty string', input: '' },
    { rule: 'trailing dot', input: '12.' },
    { rule: 'missing whole part', input: '.12' },
    { rule: '7 digits (one over the limit)', input: '1234567' },
    { rule: '"$" in the wrong place or doubled', input: '2$' },
    { rule: 'thousands separator', input: '1,345.2' },
  ])('rejects $input ($rule)', ({ input }) => {
    expect(parsePriceCents(input)).toBe(undefined)
  })
})

describe('parseProductForm', () => {
  const product = {
    slug: 'da-hong-pao',
    name: 'Da Hong Pao',
    categoryId: '2',
    origin: 'Wuyi, Fujian',
    description: 'Roasted rock oolong.',
    price: '32.00',
    unit: '50 g',
    badge: '',
    notes: 'Roasted, Stone fruit ,, Mineral',
    details: 'Harvest: Spring 2024\n\nRoast: Medium: charcoal',
    'brew-leaf': '',
    'brew-water': '',
    'brew-time': '',
    'brew-infusions': '',
    imageUrl: img,
    imageAlt: 'Dark oolong leaves',
    gallery: `${img} | Tea | poured`,
    stock: '12',
  }
  const parse = (overrides: Record<string, string> = {}, create = true) =>
    parseProductForm(form({ ...product, ...overrides }), { create })

  it('parses a valid product on create', () => {
    expect(parse()).toMatchObject({
      ok: true,
      data: {
        slug: 'da-hong-pao',
        stock: 12,
        values: { priceCents: 3200, badge: null, nameZh: null, brew: null },
      },
    })
  })

  it('drops empty notes and trims the rest', () => {
    expect(parse()).toMatchObject({
      data: { values: { notes: ['Roasted', 'Stone fruit', 'Mineral'] } },
    })
  })

  it('splits details on the first colon and skips blank lines', () => {
    expect(parse()).toMatchObject({
      data: {
        values: {
          details: [
            { term: 'Harvest', detail: 'Spring 2024' },
            { term: 'Roast', detail: 'Medium: charcoal' },
          ],
        },
      },
    })
  })

  it('splits gallery on the first pipe, keeping later pipes in the alt', () => {
    expect(parse()).toMatchObject({
      data: { values: { gallery: [{ src: img, alt: 'Tea | poured' }] } },
    })
  })

  it('ignores slug and stock when editing', () => {
    const edited = parse({ slug: 'BAD SLUG', stock: '-4' }, false)
    expect(edited.ok).toBe(true)
    if (!edited.ok) return
    expect(edited.data.slug).toBeUndefined()
    expect(edited.data.stock).toBeUndefined()
  })

  it('keeps brew when all four fields are filled', () => {
    const brewed = parse({
      'brew-leaf': '7 g',
      'brew-water': '100 °C',
      'brew-time': '5 s',
      'brew-infusions': '8+',
    })
    expect(brewed).toMatchObject({
      ok: true,
      data: {
        values: {
          brew: { leaf: '7 g', water: '100 °C', time: '5 s', infusions: '8+' },
        },
      },
    })
  })

  it.each<{ error: string; overrides: Record<string, string> }>([
    { error: 'slug', overrides: { slug: 'Da Hong Pao' } },
    { error: 'name', overrides: { name: '' } },
    { error: 'categoryId', overrides: { categoryId: 'abc' } },
    { error: 'price', overrides: { price: '12.345' } },
    { error: 'badge', overrides: { badge: 'Sale' } },
    { error: 'details', overrides: { details: 'no colon here' } },
    { error: 'brew', overrides: { 'brew-leaf': '7 g' } },
    {
      error: 'imageUrl',
      overrides: { imageUrl: 'https://evil.example.com/photo-1.jpg' },
    },
    {
      error: 'gallery',
      overrides: { gallery: 'https://images.unsplash.com/photo-1' },
    },
    { error: 'stock', overrides: { stock: '1.5' } },
  ])('rejects an invalid $error, and only that', ({ error, overrides }) => {
    const result = parse(overrides)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors)).toEqual([error])
  })

  it('collects every error instead of stopping at the first', () => {
    const result = parse({ name: '', price: 'x' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors).sort()).toEqual(['name', 'price'])
  })
})

describe('parseCategoryForm', () => {
  const category = {
    slug: 'white-tea',
    name: 'White tea',
    nameZh: '白茶',
    blurb: 'Gentle, sun-withered leaves.',
    imageUrl: img,
    imageAlt: 'Silvery white tea buds',
    sortOrder: '3',
  }

  it('parses a valid category and turns sortOrder into a number', () => {
    expect(parseCategoryForm(form(category), { create: true })).toMatchObject({
      ok: true,
      data: { slug: 'white-tea', values: { sortOrder: 3 } },
    })
  })

  it('rejects a negative sortOrder', () => {
    const result = parseCategoryForm(form({ ...category, sortOrder: '-1' }), {
      create: false,
    })
    expect(result).toMatchObject({
      ok: false,
      errors: { sortOrder: expect.any(String) },
    })
  })
})

describe('parseStockForm', () => {
  it('turns empty expectedQuantity and restockNote into null', () => {
    const result = parseStockForm(
      form({
        productId: '4',
        quantity: '0',
        expectedQuantity: '',
        restockNote: '',
      }),
    )
    expect(result).toEqual({
      ok: true,
      data: {
        productId: 4,
        quantity: 0,
        expectedQuantity: null,
        restockNote: null,
      },
    })
  })

  it.each([
    { rule: 'negative quantity', quantity: '-1', expectedQuantity: '3' },
    {
      rule: 'non-numeric expectedQuantity',
      quantity: '2',
      expectedQuantity: 'x',
    },
  ])('rejects $rule', ({ quantity, expectedQuantity }) => {
    const result = parseStockForm(
      form({ productId: '4', quantity, expectedQuantity }),
    )
    expect(result).toMatchObject({
      ok: false,
      errors: { quantity: expect.any(String) },
    })
  })
})
