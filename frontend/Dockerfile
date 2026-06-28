# ── Stage 1: Build the React/Vite app ──────────────────────────────────────
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy the rest of the source code
COPY . .

# VITE_API_BASE_URL and VITE_STREAM_API_KEY are injected as build args
# so they get baked into the static JS bundle at build time.
ARG VITE_API_BASE_URL
ARG VITE_STREAM_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY

RUN npm run build

# ── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
