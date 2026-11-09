import { Link, Outlet } from '@tanstack/react-router'
import { Heart, LayoutDashboard, Settings } from 'lucide-react'
import { useData } from '../../hooks/useData'

const link = 'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-cream'
const active = { className: 'bg-blush !text-dusty-dark' }

export function Layout() {
  const { cats, toasts } = useData()
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r border-beige/60 bg-ivory p-5 md:sticky md:top-0 md:flex md:h-screen md:overflow-y-auto">
        <div className="mb-6 flex items-center gap-2 px-2 font-serif text-xl"><Heart size={20} className="text-dusty" /> Persiapan Nikah</div>
        <Link to="/" activeOptions={{ exact: true }} activeProps={active} className={link}><LayoutDashboard size={17} /> Dashboard</Link>
        <p className="mt-4 px-4 pb-1 text-xs font-semibold text-muted/70">Kategori</p>
        {cats.map((c) => (
          <Link key={c.name} to="/kategori/$name" params={{ name: c.name }} activeProps={active} className={link}>
            <span className="truncate">{c.name}</span>
          </Link>
        ))}
        <Link to="/settings" activeProps={active} className={`${link} mt-auto`}><Settings size={17} /> Pengaturan</Link>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 md:px-10 md:pb-10 md:pt-8">
        <nav className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:hidden">
          {cats.map((c) => (
            <Link key={c.name} to="/kategori/$name" params={{ name: c.name }} className="shrink-0 rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-muted" activeProps={{ className: '!bg-dusty !text-white' }}>
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="mx-auto max-w-3xl"><Outlet /></div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-beige/60 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: '!text-dusty-dark' }} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-semibold text-muted"><LayoutDashboard size={20} />Dashboard</Link>
        <Link to="/settings" activeProps={{ className: '!text-dusty-dark' }} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-semibold text-muted"><Settings size={20} />Pengaturan</Link>
      </nav>

      <div className="fixed inset-x-0 bottom-20 z-30 flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-full px-5 py-2 text-sm font-semibold shadow-lg ${t.error ? 'bg-dusty-dark text-white' : 'bg-ink text-ivory'}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  )
}
