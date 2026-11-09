// Aturan nama kategori = aturan nama sheet Google Spreadsheet.
export function validateCategoryName(name: string, existing: string[]): string | null {
  const n = name.trim()
  if (!n) return 'Nama kategori wajib diisi'
  if (n.length > 50) return 'Maksimal 50 karakter'
  if (/[\[\]:*?\/\\]/.test(n)) return 'Tidak boleh memakai karakter [ ] : * ? / \\'
  if (n.toLowerCase() === 'categories') return 'Nama ini dipakai sistem'
  if (existing.some((e) => e.toLowerCase() === n.toLowerCase())) return 'Kategori sudah ada'
  return null
}
