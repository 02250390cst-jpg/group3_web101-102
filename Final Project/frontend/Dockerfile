# Stage 1: deps 
FROM node:20-alpine AS deps
WORKDIR /app
 
COPY package.json package-lock.json ./
RUN npm ci
 
# Stage 2: builder 
FROM node:20-alpine AS builder
WORKDIR /app
 
COPY --from=deps /app/node_modules ./node_modules
COPY . .
 
# Set the public backend URL at build time (override via --build-arg or Render env)
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
 
RUN npm run build
 
# Stage 3: runner
FROM node:20-alpine AS runner
WORKDIR /app
 
ENV NODE_ENV=production
 
# Next.js standalone output (enabled below) bundles only what it needs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
 
EXPOSE 3000
 
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
 
CMD ["node", "server.js"]
