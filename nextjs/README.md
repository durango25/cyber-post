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
AUTH_SECRET=your-secret-key  # buat dengan: openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

### Jalankan Dev Server

```bash
npm run dev
```

Aplikasi berjalan di: http://localhost:3000

## Catatan Arsitektur

- **Auth**: NextAuth v5 dengan Credentials provider; strategi JWT; token disimpan di sesi
- **Proteksi Route**: `proxy.ts` melindungi semua route kecuali `/auth/login` dan `/auth/register`
- **API Client**: Instance Axios di `lib/api.ts` — otomatis menyisipkan Bearer token dari sesi
- **State**: Zustand `usePostStore` untuk daftar post, paginasi, dan filter
- **Tema**: next-themes dengan DaisyUI `data-theme`; disimpan di localStorage; default `dark`
- **SEO**: Next.js `Metadata` API — statis per halaman + async `generateMetadata` untuk detail post
- **UI**: Komponen DaisyUI v5 (table, card, modal, form, pagination), ikon Lucide React

## Route Utama

| URL                            | Deskripsi               |
| ------------------------------ | ----------------------- |
| `/`                            | Landing                 |
| `/auth/login`                  | Halaman login           |
| `/auth/register`               | Halaman register        |
| `/dashboard/posts`             | Daftar post             |
| `/dashboard/posts/create`      | Buat post baru          |
| `/dashboard/posts/update/[id]` | Edit post (hanya owner) |
| `/dashboard/posts/detail/[id]` | Detail post             |
