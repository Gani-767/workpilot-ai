# Use Node.js LTS
FROM node:20-slim

# Install dependencies for Prisma and BullMQ
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Start the worker process
CMD ["node", "worker/index.ts"]
