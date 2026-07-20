# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build the Vite/React static bundle
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# VITE_API_URL is baked in at build time (Vite inlines env vars).
# Empty => the frontend calls the API with RELATIVE paths (/api/...), which
# nginx proxies to the backend. This makes the app work on ANY host/URL the
# frontend is served from (localhost, a LAN IP, or a real domain).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — serve the static bundle with nginx
# ---------------------------------------------------------------------------
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
