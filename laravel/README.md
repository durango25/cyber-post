# CyberPost — Laravel Backend

Backend REST API yang dibangun dengan Laravel 13 dan Sanctum untuk autentikasi berbasis token.

## Kebutuhan

- PHP 8.2+
- Composer
- MySQL 8+

## Instalasi

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
```

### Konfigurasi Database

Edit `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cyberpost
DB_USERNAME=root
DB_PASSWORD=
```

Atur juga URL frontend yang diizinkan (untuk CORS):

```
FRONTEND_URL=http://localhost:3000
```

### Pengaturan Docker

Saat menggunakan Docker Compose, aplikasi tetap menggunakan file `.env` yang sama, namun beberapa nilai di-override melalui `docker-compose.yml`.

- DB_HOST=mysql
- DB_DATABASE=cyberpost
- DB_USERNAME=root
- DB_PASSWORD=root

### Jalankan Migrasi

```bash
php artisan migrate
```

atau (sekalian seeder dummy)

```bash
php artisan migrate:fresh --seed
```

### Jalankan Server

```bash
php artisan serve
```

API berjalan di: http://localhost:8000

## Catatan Arsitektur

- **Auth**: Laravel Sanctum — autentikasi berbasis token tanpa state (stateless)
- **CORS**: Dikonfigurasi via `config/cors.php` untuk mengizinkan `FRONTEND_URL`
- **Otorisasi**: `PostPolicy` memastikan hanya pemilik post yang bisa mengubah/menghapus
- **Penanganan Error**: Error JSON kustom di `bootstrap/app.php` (401, 404, 422)
- **Pagination**: Server side, 10 item/halaman
- **Filter**: Global `search` (judul + konten)
