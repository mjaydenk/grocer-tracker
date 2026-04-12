import type { KeyboardEvent } from 'react'

export type GroceryPriceFieldParse =
  | { kind: 'empty' }
  | { kind: 'valid'; value: number }
  | { kind: 'invalid'; message: string }

/**
 * Parses a single price field. Empty input is allowed (no price for that store).
 * Rejects invalid numbers and values strictly less than 0.
 */
export function parseGroceryPriceField(raw: string): GroceryPriceFieldParse {
  const trimmed = raw.trim()
  if (!trimmed) return { kind: 'empty' }
  const n = Number.parseFloat(trimmed.replace(',', '.'))
  if (Number.isNaN(n)) {
    return { kind: 'invalid', message: 'Enter a valid number.' }
  }
  if (n < 0) {
    return { kind: 'invalid', message: 'Price cannot be less than 0.' }
  }
  return { kind: 'valid', value: n }
}

/**
 * Parses a price from form input for cases where invalid input should be treated as absent.
 * Prefer {@link parseGroceryPriceField} when you need to show validation errors.
 */
export function parseGroceryPriceInput(raw: string): number | null {
  const r = parseGroceryPriceField(raw)
  return r.kind === 'valid' ? r.value : null
}

/** Blocks typing a minus so negative values are not entered as a first character. */
export function blockNegativePriceKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
): void {
  if (e.key === '-' || e.key === 'Subtract') {
    e.preventDefault()
  }
}
