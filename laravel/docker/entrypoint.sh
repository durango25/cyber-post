#!/bin/sh
set -e

# 1. Pastikan folder vendor ada (sinkronisasi ke lokal jika terhapus)
if [ ! -d "vendor" ]; then
    echo "Folder vendor tidak ditemukan, menginstal..."
    composer install --no-interaction --optimize-autoloader
fi

# 2. Pastikan file .env ada
if [ ! -f ".env" ]; then
    echo "File .env tidak ditemukan, mengcopy dari .env.example..."
    cp .env.example .env
fi

# 3. Jalankan Artisan commands
php artisan key:generate --force
php artisan config:clear

# Tunggu DB benar-benar bisa menerima koneksi
echo "Menunggu database siap..."
until php artisan db:show --json > /dev/null 2>&1; do
  echo "  DB belum siap, retry dalam 2s..."
  sleep 2
done
echo "Database siap!"

# Tambahan: Tunggu database siap (opsional tapi disarankan)
echo "Menjalankan migrasi..."
php artisan migrate --force

# 4. Link storage (tetap gunakan || true agar tidak stop jika sudah ada)
php artisan storage:link || true

# 5. Jalankan perintah utama
echo "Memulai server..."
exec php artisan serve --host=0.0.0.0 --port=8000