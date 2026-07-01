# syntax=docker/dockerfile:1.4
# =============================================================================
# 多階段建構：Node 建構 → Nginx 提供靜態檔案
# =============================================================================

# -----------------------------------------------------------------------------
# 階段一：基礎環境
# -----------------------------------------------------------------------------
FROM node:24.14.0-slim AS base
WORKDIR /app

ARG NODE_ENV
ARG BUILD_MODE=production
ENV NODE_ENV=${NODE_ENV}
ENV BUILD_MODE=${BUILD_MODE}

# -----------------------------------------------------------------------------
# 階段二：依賴安裝層（利用 BuildKit 快取掛載加速）
# -----------------------------------------------------------------------------
FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --frozen-lockfile

# -----------------------------------------------------------------------------
# 階段三：建構層
# -----------------------------------------------------------------------------
FROM deps AS build-stage
COPY . .
RUN echo "🚀 開始建構，使用模式: ${BUILD_MODE}" && \
    npx vite build --mode ${BUILD_MODE} && \
    echo "✅ 建構完成"

# -----------------------------------------------------------------------------
# 階段四：生產環境（Nginx Alpine）
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# 建構指令範例：
#   docker build -t blog-frontend .
#   docker build -t blog-frontend --build-arg BUILD_MODE=development .
#   docker run -d --name blog-frontend -p 8080:80 blog-frontend
# =============================================================================
