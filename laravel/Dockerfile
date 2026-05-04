FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    default-mysql-client \
    curl \
    git \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/laravel

COPY . .

RUN mkdir -p bootstrap/cache storage/logs storage/app/public \
    && chmod -R 775 bootstrap/cache storage

RUN composer install --no-interaction --no-progress

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]