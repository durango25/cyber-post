# CyberPost — Next.js Frontend

Frontend untuk CyberPost yang dibangun dengan Next.js 16 App Router, NextAuth v5, Zustand, DaisyUI v5, dan Tailwind CSS v4.

## Kebutuhan

- Node.js 20+
- npm

## Instalasi

```bash
cd nextjs
npm install
cp .env.example .env.local
```

### Konfigurasi Environment

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
AUTH_SECRET=rahasia-acak-anda   # buat dengan: openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

### Jalankan Dev Server

```bash
npm run dev
```

Aplikasi berjalan di: http://localhost:3000

## Catatan Arsitektur

- **Auth**: NextAuth v5 dengan Credentials provider; strategi JWT; token disimpan di sesi
- **Proteksi Rute**: `proxy.ts` melindungi semua rute kecuali `/login` dan `/register`
- **API Client**: Instance Axios di `lib/api.ts` — otomatis menyisipkan Bearer token dari sesi
- **State**: Zustand `usePostStore` untuk daftar post, paginasi, dan filter
- **Tema**: next-themes dengan DaisyUI `data-theme`; disimpan di localStorage; default `dark`
- **SEO**: Next.js `Metadata` API — statis per halaman + async `generateMetadata` untuk detail post
- **UI**: Komponen DaisyUI v5 (table, card, modal, form, pagination), ikon Lucide React

## Rute Utama

| URL                | Deskripsi                               |
| ------------------ | --------------------------------------- |
| `/login`           | Halaman login                           |
| `/register`        | Halaman registrasi                      |
| `/`                | Daftar post dengan pencarian + paginasi |
| `/posts/[id]`      | Detail post                             |
| `/posts/new`       | Buat post baru                          |
| `/posts/[id]/edit` | Edit post (hanya pemilik)               |
