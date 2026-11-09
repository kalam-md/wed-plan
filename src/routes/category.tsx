import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useData } from '../hooks/useData'
import { Progress } from '../components/ui/Progress'
import { ErrorBox, Loading } from '../components/ui/State'
import { rupiah, stats } from '../utils/format'
import type { Item } from '../types'

const input = 'rounded-2xl border border-beige bg-white px-4 py-2.5 text-sm outline-none focus:border-dusty'

function Row({ cat, item }: { cat: string; item: Item }) {
  const { updateItem, deleteItem } = useData()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(item.item)
  const [harga, setHarga] = useState(String(item.harga || ''))

  if (edit) {
    return (
      <li className="flex flex-wrap items-center gap-2 rounded-2xl bg-cream p-3">
        <input className={`${input} min-w-0 flex-1`} value={name} onChange={(e) => setName(e.target.value)} aria-label="Nama item" />
        <input className={`${input} w-32`} inputMode="numeric" value={harga} onChange={(e) => setHarga(e.target.value.replace(/\D/g, ''))} placeholder="Harga" aria-label="Harga" />
        <button aria-label="Simpan" className="rounded-full bg-dusty p-2 text-white" onClick={() => { if (name.trim()) { updateItem(cat, item.id, { item: name.trim(), harga: Number(harga) || 0 }); setEdit(false) } }}><Check size={16} /></button>
        <button aria-label="Batal" className="rounded-full p-2 text-muted" onClick={() => setEdit(false)}><X size={16} /></button>
      </li>
    )
  }
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white p-3 pr-2 shadow-sm shadow-beige/50">
      <button
        role="checkbox" aria-checked={item.terpenuhi} aria-label={`Tandai ${item.item}`}
        onClick={() => updateItem(cat, item.id, { terpenuhi: !item.terpenuhi })}
        className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${item.terpenuhi ? 'border-dusty bg-dusty text-white' : 'border-beige'}`}
      >{item.terpenuhi && <Check size={14} strokeWidth={3} />}</button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${item.terpenuhi ? 'text-muted line-through' : ''}`}>{item.item}</p>
        <p className="text-sm text-muted">{rupiah(item.harga)}</p>
      </div>
      <button aria-label="Ubah" className="rounded-full p-2 text-muted hover:bg-cream" onClick={() => setEdit(true)}><Pencil size={15} /></button>
      <button aria-label="Hapus" className="rounded-full p-2 text-muted hover:bg-blush" onClick={() => confirm(`Hapus "${item.item}"?`) && deleteItem(cat, item.id)}><Trash2 size={15} /></button>
    </li>
  )
}

export function CategoryPage() {
  const { name } = useParams({ from: '/kategori/$name' })
  const { cats, loading, error, addItem } = useData()
  const [item, setItem] = useState('')
  const [harga, setHarga] = useState('')

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />
  const cat = cats.find((c) => c.name === name)
  if (!cat) return <p className="py-20 text-center text-muted">Kategori tidak ditemukan.</p>
  const s = stats(cat)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item.trim()) return
    addItem(cat.name, item.trim(), Number(harga) || 0)
    setItem(''); setHarga('')
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-blush/70 p-6">
        <h1 className="font-serif text-3xl">{cat.name}</h1>
        <p className="mt-1 text-sm text-ink/70">{s.done} dari {s.total} item terpenuhi · {rupiah(s.harga)}</p>
        <div className="mt-4"><Progress pct={s.pct} /></div>
      </header>

      <form onSubmit={submit} className="flex flex-wrap gap-2">
        <input className={`${input} min-w-0 flex-[2_1_12rem]`} value={item} onChange={(e) => setItem(e.target.value)} placeholder="Nama item" aria-label="Nama item" />
        <input className={`${input} flex-[1_1_8rem]`} inputMode="numeric" value={harga} onChange={(e) => setHarga(e.target.value.replace(/\D/g, ''))} placeholder="Harga (Rp)" aria-label="Harga" />
        <button className="flex items-center gap-1.5 rounded-2xl bg-dusty px-5 py-2.5 text-sm font-bold text-white hover:bg-dusty-dark"><Plus size={16} /> Tambah</button>
      </form>

      {cat.items.length === 0
        ? <p className="rounded-3xl bg-cream p-6 text-center text-sm text-muted">Belum ada item. Tambahkan item pertama di atas.</p>
        : <ul className="space-y-2">{cat.items.map((i) => <Row key={i.id} cat={cat.name} item={i} />)}</ul>}
    </div>
  )
}
