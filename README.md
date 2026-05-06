# CyberPost

A fullstack monorepo CRUD application built with **Laravel** (REST API) and **Next.js** (App Router).

## Features

- Authentication (Register, Login, Logout, Refresh Token) via Laravel Sanctum
- Post Management (Create, Read, Update, Delete)
- Server-side pagination (10 per page) and filtering
- Owner-only edit/delete authorization
- Theme switching (Dark / Light)

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Backend  | Laravel (PHP), Sanctum (token-based auth)   |
| Frontend | Next.js 16 App Router, NextAuth v5, Zustand |
| UI       | DaisyUI v5 + Tailwind CSS v4                |
| Database | MySQL 8                                     |
| Icons    | Lucide React                                |

## Project Structure

```
cyber-post/
├── laravel/          # Backend REST API
├── nextjs/           # Frontend Next.js App
├── docker-compose.yml
└── README.md
```

## Quick Start

### With Docker (Recommended)

**1. Setup Environment:**

Copy environment file:

```bash
cp laravel/.env.example laravel/.env
cp nextjs/.env.example nextjs/.env
```

#### Environment Variables

Laravel:

- DB_DATABASE=cyberpost
- DB_USERNAME=root
- DB_PASSWORD=root

Next.js:

- NEXT_PUBLIC_API_URL=http://localhost:8000/api
- API_URL=http://laravel:8000/api

**2. Start the app:**

```bash
docker-compose up -d --build
```

> Migrations, app key generation, and storage symlink run automatically on first start.

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

### Without Docker

See:

- [Laravel Setup](./laravel/README.md)
- [Next.js Setup](./nextjs/README.md)

## API Endpoints

### Authentication

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| POST   | /api/register      | Register new user             |
| POST   | /api/login         | Login, returns token          |
| POST   | /api/logout        | Logout (auth required)        |
| POST   | /api/refresh-token | Refresh token (auth required) |

### Posts (all require Bearer token)

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | /api/posts      | List (paginated + filterable) |
| GET    | /api/posts/{id} | Get single post               |
| POST   | /api/posts      | Create post                   |
| PUT    | /api/posts/{id} | Update post (owner only)      |
| DELETE | /api/posts/{id} | Delete post (owner only)      |

**Query params for GET /api/posts:** `page`, `per_page`, `search`, `title`, `content`, `image`

## Authentication Flow

- User logs in via NextAuth (Credentials Provider)
- NextAuth calls Laravel `/api/login`
- Laravel returns API token
- Token is stored in JWT session
- All API with auth requests include Bearer token

## Usage

1. Register a new account
2. Login
3. Create a post
4. Edit or delete your own posts
