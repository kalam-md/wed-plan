# Persiapan Pernikahan

Tracker sederhana: kategori (Vendor, Skincare, Haircare, Mahar, dst.) berisi item yang bisa dicentang + harga.
Data disimpan di Google Spreadsheet (satu sheet per kategori). TanStack Router + Vite + Tailwind.

## 1. Setup Spreadsheet & Apps Script
1. Buat Google Spreadsheet baru (kosong).
2. Menu **Extensions > Apps Script**, hapus isi file, tempel isi `apps-script/Code.gs`, lalu **Save**.
3. **Deploy > New deployment > tipe Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**, izinkan akses, lalu salin **Web app URL** (berakhiran `/exec`).
5. Setiap kali Code.gs diubah: **Deploy > Manage deployments > Edit > Version: New version**.

Sheet `Categories` dibuat otomatis saat pertama dipakai. Setiap kategori baru dari website otomatis membuat sheet baru
dengan kolom `id | item | terpenuhi | harga`.

## 2. Jalankan lokal
```
npm install
# isi .env.local: VITE_API_URL=<Web app URL>
npm run dev
```

## 3. Deploy ke Vercel
1. Push ke GitHub, import project di Vercel (framework: Vite).
2. Environment Variables: `VITE_API_URL` = Web app URL.
3. Build command `npm run build`, output `dist` (sudah di `vercel.json`, termasuk rewrite agar refresh halaman tidak 404).

## Catatan
- Siapa pun yang punya URL Web app bisa membaca/mengubah data. Jangan bagikan URL-nya.
- Jangan ubah header/kolom di sheet secara manual. Edit isi item boleh, tetapi kolom `id` jangan dihapus.
- Nama kategori tidak boleh memuat `[ ] : * ? / \`.
