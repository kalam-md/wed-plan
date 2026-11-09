import { Loader2, AlertCircle } from 'lucide-react'
import { useData } from '../../hooks/useData'

export function Loading() {
  return <div className="flex items-center justify-center gap-2 py-24 text-muted"><Loader2 className="animate-spin" size={18} /> Memuat data…</div>
}
export function ErrorBox({ message }: { message: string }) {
  const { reload } = useData()
  return (
    <div className="mx-auto mt-16 max-w-md rounded-3xl bg-blush/60 p-6 text-center">
      <AlertCircle className="mx-auto mb-2 text-dusty-dark" />
      <p className="font-semibold">Data tidak bisa dimuat</p>
      <p className="mt-1 text-sm text-muted">{message}. Cek VITE_API_URL dan deploy Apps Script.</p>
      <button onClick={reload} className="mt-4 rounded-full bg-dusty px-5 py-2 text-sm font-semibold text-white">Coba lagi</button>
    </div>
  )
}
