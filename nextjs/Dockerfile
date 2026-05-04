FROM node:20-alpine

WORKDIR /app

# Install dependencies dasar untuk alpine
RUN apk add --no-cache libc6-compat

COPY package*.json ./

# Kita tetap jalankan npm install di sini untuk caching image
RUN npm install

COPY . .

# Biarkan CMD menjalankan install lagi untuk sinkronisasi ke host lokal
CMD ["sh", "-c", "npm install && npm run dev"]