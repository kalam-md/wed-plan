import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useData } from '../hooks/useData'
import { ErrorBox, Loading } from '../components/ui/State'
import { validateCategoryName } from '../services/spreadsheet'

const input = 'rounded-2xl border border-beige bg-white px-4 py-2.5 text-sm outline-none focus:border-dusty'

export function SettingsPage() {
  const { cats, loading, error, addCategory, renameCategory, deleteCategory } = useData()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />
  const names = cats.map((c) => c.name)

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Pengaturan</h1>
      <section className="space-y-3">
        <h2 className="font-bold">Tambah kategori</h2>
        <p className="text-sm text-muted">Setiap kategori menjadi satu sheet baru di Google Spreadsheet.</p>
        <form className="flex gap-2" onSubmit={(e) => {
          e.preventDefault()
          const v = validateCategoryName(name, names)
          setErr(v)
          if (!v) { addCategory(name.trim()); setName('') }
        }}>
          <input className={`${input} min-w-0 flex-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Vendor, Skincare, Mahar" aria-label="Nama kategori" />
          <button className="flex items-center gap-1.5 rounded-2xl bg-dusty px-5 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Tambah</button>
        </form>
        {err && <p className="text-sm text-dusty-dark">{err}</p>}
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Daftar kategori</h2>
        {cats.length === 0 && <p className="text-sm text-muted">Belum ada kategori.</p>}
        <ul className="space-y-2">
          {cats.map((c) => (
            <li key={c.name} className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm shadow-beige/50">
              {editing === c.name ? (
                <>
                  <input className={`${input} min-w-0 flex-1`} value={newName} onChange={(e) => setNewName(e.target.value)} aria-label="Nama baru" />
                  <button aria-label="Simpan" className="rounded-full bg-dusty p-2 text-white" onClick={() => {
                    const v = newName.trim() === c.name ? null : validateCategoryName(newName, names)
                    if (v) return setErr(v)
                    setErr(null)
                    if (newName.trim() !== c.name) renameCategory(c.name, newName.trim())
                    setEditing(null)
                  }}><Check size={16} /></button>
                  <button aria-label="Batal" className="rounded-full p-2 text-muted" onClick={() => setEditing(null)}><X size={16} /></button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate px-1 font-semibold">{c.name} <span className="text-sm font-normal text-muted">({c.items.length} item)</span></span>
                  <button aria-label="Ubah nama" className="rounded-full p-2 text-muted hover:bg-cream" onClick={() => { setEditing(c.name); setNewName(c.name) }}><Pencil size={15} /></button>
                  <button aria-label="Hapus kategori" className="rounded-full p-2 text-muted hover:bg-blush" onClick={() => {
                    if (confirm(`Hapus kategori "${c.name}" beserta ${c.items.length} item di dalamnya? Sheet-nya juga ikut terhapus.`)) { deleteCategory(c.name); navigate({ to: '/' }) }
                  }}><Trash2 size={15} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
