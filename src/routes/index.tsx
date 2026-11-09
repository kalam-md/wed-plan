import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useData } from '../hooks/useData'
import { Progress } from '../components/ui/Progress'
import { ErrorBox, Loading } from '../components/ui/State'
import { rupiah, stats } from '../utils/format'

export function Dashboard() {
  const { cats, loading, error } = useData()
  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />

  const all = cats.map(stats)
  const total = all.reduce((s, x) => s + x.total, 0)
  const done = all.reduce((s, x) => s + x.done, 0)
  const harga = all.reduce((s, x) => s + x.harga, 0)
  const hargaDone = all.reduce((s, x) => s + x.hargaDone, 0)
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-blush/70 p-6 md:p-8">
        <p className="font-serif text-5xl text-dusty-dark">{pct}%</p>
        <p className="mt-1 text-sm text-ink/70">{done} dari {total} item sudah terpenuhi</p>
        <div className="mt-5"><Progress pct={pct} /></div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted">Total harga</dt><dd className="text-lg font-bold">{rupiah(harga)}</dd></div>
          <div><dt className="text-muted">Sudah terpenuhi</dt><dd className="text-lg font-bold">{rupiah(hargaDone)}</dd></div>
        </dl>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl">Kategori</h2>
        {cats.length === 0 ? (
          <p className="rounded-3xl bg-cream p-6 text-sm text-muted">Belum ada kategori. Tambahkan yang pertama di <Link to="/settings" className="font-semibold text-dusty-dark underline">Pengaturan</Link>, misalnya Vendor, Skincare, atau Mahar.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {cats.map((c, i) => (
              <li key={c.name}>
                <Link to="/kategori/$name" params={{ name: c.name }} className="block rounded-3xl bg-white p-5 shadow-sm shadow-beige/60 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{c.name}</span><ChevronRight size={16} className="text-muted" />
                  </div>
                  <p className="mt-1 text-sm text-muted">{all[i].done}/{all[i].total} item · {rupiah(all[i].harga)}</p>
                  <div className="mt-3"><Progress pct={all[i].pct} /></div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
