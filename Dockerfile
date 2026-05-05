FROM node:20-alpine

# 🔥 ÉTAPE AJOUTÉE : Installer OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4999

# Run migrations and seed, then start server
CMD sh -c "npx prisma db push && node prisma/seed.js && node src/server.js"
