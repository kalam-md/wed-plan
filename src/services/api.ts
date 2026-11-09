import type { Category } from '../types'

const URL_API = import.meta.env.VITE_API_URL as string | undefined

async function request<T>(init: RequestInit): Promise<T> {
  if (!URL_API) throw new Error('VITE_API_URL belum diatur')
  const res = await fetch(URL_API, init)
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'Terjadi kesalahan')
  return json.data as T
}

// Apps Script web app hanya menerima GET/POST. Aksi (add/update/delete) dikirim lewat POST.
// Content-Type text/plain dipakai agar tidak memicu CORS preflight.
const post = <T = unknown>(action: string, payload: object = {}) =>
  request<T>({ method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...payload }) })

export const api = {
  getAll: () => request<Category[]>({ method: 'GET' }),
  addCategory: (name: string) => post('addCategory', { name }),
  renameCategory: (name: string, newName: string) => post('renameCategory', { name, newName }),
  deleteCategory: (name: string) => post('deleteCategory', { name }),
  addItem: (category: string, item: { id: string; item: string; harga: number }) => post('addItem', { category, ...item }),
  updateItem: (category: string, item: { id: string; item?: string; harga?: number; terpenuhi?: boolean }) => post('updateItem', { category, ...item }),
  deleteItem: (category: string, id: string) => post('deleteItem', { category, id }),
}
