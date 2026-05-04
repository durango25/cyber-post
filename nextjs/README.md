# CyberPost — Next.js Frontend

Frontend for CyberPost built with Next.js 16 App Router, NextAuth v5, Zustand, DaisyUI v5, and Tailwind CSS v4.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
cd nextjs
npm install
cp .env.example .env.local
```

### Configure Environment

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
AUTH_SECRET=your-random-secret-here   # generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

### Start Dev Server

```bash
npm run dev
```

App runs at: http://localhost:3000

## Architecture Notes

- **Auth**: NextAuth v5 with Credentials provider; JWT strategy; token stored in session
- **Route Protection**: `middleware.ts` protects all routes except `/login` and `/register`
- **API Client**: Axios instance in `lib/api.ts` — auto-injects Bearer token from session
- **State**: Zustand `usePostStore` for post list, pagination, and filters
- **Theme**: next-themes with DaisyUI `data-theme`; persisted to localStorage; defaults to `dark`
- **SEO**: Next.js `Metadata` API — static per-page + async `generateMetadata` for post detail
- **UI**: DaisyUI v5 components (table, card, modal, form, pagination), Lucide React icons

## Key Routes

| URL                | Description                        |
| ------------------ | ---------------------------------- |
| `/login`           | Login page                         |
| `/register`        | Register page                      |
| `/`                | Post list with search + pagination |
| `/posts/[id]`      | Post detail                        |
| `/posts/new`       | Create new post                    |
| `/posts/[id]/edit` | Edit post (owner only)             |
