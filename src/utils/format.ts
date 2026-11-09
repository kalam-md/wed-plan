import type { Category } from '../types'

export const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

export function stats(c: Category) {
  const total = c.items.length
  const done = c.items.filter((i) => i.terpenuhi).length
  const harga = c.items.reduce((s, i) => s + (i.harga || 0), 0)
  const hargaDone = c.items.filter((i) => i.terpenuhi).reduce((s, i) => s + (i.harga || 0), 0)
  return { total, done, harga, hargaDone, pct: total ? Math.round((done / total) * 100) : 0 }
}
