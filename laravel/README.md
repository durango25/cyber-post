# CyberPost — Laravel Backend

REST API backend built with Laravel 11 and Sanctum for token-based authentication.

## Requirements

- PHP 8.2+
- Composer
- MySQL 8+

## Setup

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
```

### Configure Database

Edit `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cyberpost
DB_USERNAME=root
DB_PASSWORD=
```

Also set the allowed frontend URL (for CORS):

```
FRONTEND_URL=http://localhost:3000
```

### Docker Setup

When using Docker Compose, the application still uses the same `.env` file, but certain values are overridden via `docker-compose.yml`.

- DB_HOST=mysql
- DB_DATABASE=cyberpost
- DB_USERNAME=root
- DB_PASSWORD=root

### Run Migrations

```bash
php artisan migrate
```

### Start Server

```bash
php artisan serve
```

API runs at: http://localhost:8000

## Architecture Notes

- **Auth**: Laravel Sanctum — stateless token-based authentication
- **CORS**: Configured via `config/cors.php` to allow `FRONTEND_URL`
- **Authorization**: `PostPolicy` ensures only the post owner can update/delete
- **Error Handling**: Custom JSON errors in `bootstrap/app.php` (401, 404, 422)
- **Pagination**: Server-side, 10 items/page, configurable via `per_page` query param
- **Filtering**: Global `search` (title + content), or column-specific `title` / `content` params
