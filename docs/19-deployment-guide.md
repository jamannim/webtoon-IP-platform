# 19. 배포 및 인프라 운영 가이드 (Deployment Guide)

## 1. 배포 환경 아키텍처
TOON CANVAS 플랫폼은 Vercel, AWS ECS, Google Cloud Run 또는 독립 온프레미스 Docker 컨테이너 등 다양한 환경에 즉시 배포할 수 있도록 구성되어 있습니다.

---

## 2. 환경변수 구성 (`.env.production`)

```env
# Node 환경
NODE_ENV=production
PORT=3000

# 서비스 공개 URL
NEXT_PUBLIC_SITE_URL=https://tooncanvas.com
NEXT_PUBLIC_KIOSK_EXPIRE_HOURS=72

# PG사 연동 설정 (테스트 -> 상용 전환 시 입력)
TOSS_PAYMENTS_CLIENT_KEY=live_ck_...
TOSS_PAYMENTS_SECRET_KEY=live_sk_...

# 무인 키오스크 중앙 서버 통신 Secret
KIOSK_API_SECRET_KEY=kiosk_sec_...

# 객체 스토리지 (S3 / Cloudflare R2)
S3_BUCKET_NAME=toon-canvas-assets
S3_REGION=ap-northeast-2
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

---

## 3. 프로덕션 빌드 및 배포 절차

### 3.1 Docker 배포 (권장)
```dockerfile
# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### 3.2 롤백(Rollback) 절차
- 배포 직후 헬스체크(`/api/admin/settlement`) 실패 또는 치명적 에러 발생 시, 이전 버전의 도커 이미지 태그 또는 Git 커밋 태그로 트래픽 즉각 전환(Blue/Green 무중단 롤백).
