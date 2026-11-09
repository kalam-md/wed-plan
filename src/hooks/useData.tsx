import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import type { Category, Item } from '../types'

interface Toast { id: number; msg: string; error?: boolean }
interface Ctx {
  cats: Category[]
  loading: boolean
  error: string | null
  toasts: Toast[]
  reload: () => Promise<void>
  addCategory: (name: string) => Promise<void>
  renameCategory: (name: string, newName: string) => Promise<void>
  deleteCategory: (name: string) => Promise<void>
  addItem: (cat: string, item: string, harga: number) => Promise<void>
  updateItem: (cat: string, id: string, patch: Partial<Omit<Item, 'id'>>) => Promise<void>
  deleteItem: (cat: string, id: string) => Promise<void>
}

const DataCtx = createContext<Ctx>(null!)
export const useData = () => useContext(DataCtx)

export function DataProvider({ children }: { children: ReactNode }) {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (msg: string, isError = false) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, error: isError }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  const reload = useCallback(async () => {
    try {
      setError(null)
      setCats(await api.getAll())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  // Update tampilan dulu, simpan ke spreadsheet di belakang; jika gagal, muat ulang dari spreadsheet.
  async function run(optimistic: (c: Category[]) => Category[], call: () => Promise<unknown>, ok?: string) {
    setCats(optimistic)
    try {
      await call()
      if (ok) toast(ok)
    } catch (e) {
      toast((e as Error).message, true)
      await reload()
    }
  }
  const mapCat = (name: string, fn: (c: Category) => Category) => (cs: Category[]) => cs.map((c) => (c.name === name ? fn(c) : c))

  const value: Ctx = {
    cats, loading, error, toasts, reload,
    addCategory: (name) => run((cs) => [...cs, { name, items: [] }], () => api.addCategory(name), 'Kategori ditambahkan'),
    renameCategory: (name, newName) => run(mapCat(name, (c) => ({ ...c, name: newName })), () => api.renameCategory(name, newName), 'Kategori diubah'),
    deleteCategory: (name) => run((cs) => cs.filter((c) => c.name !== name), () => api.deleteCategory(name), 'Kategori dihapus'),
    addItem: (cat, item, harga) => {
      const id = crypto.randomUUID()
      return run(mapCat(cat, (c) => ({ ...c, items: [...c.items, { id, item, harga, terpenuhi: false }] })), () => api.addItem(cat, { id, item, harga }), 'Item ditambahkan')
    },
    updateItem: (cat, id, patch) =>
      run(mapCat(cat, (c) => ({ ...c, items: c.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })), () => api.updateItem(cat, { id, ...patch })),
    deleteItem: (cat, id) => run(mapCat(cat, (c) => ({ ...c, items: c.items.filter((i) => i.id !== id) })), () => api.deleteItem(cat, id), 'Item dihapus'),
  }

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}
