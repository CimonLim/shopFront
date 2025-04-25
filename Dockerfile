# 빌드 단계
FROM node:22.14.0-alpine AS builder

# 필요한 패키지 설치
RUN apk add --no-cache libc6-compat git

# pnpm 설치
RUN npm install -g pnpm@9.9.0

# turbo 설치
RUN npm install -g turbo@2.1.1

# 작업 디렉토리 설정
WORKDIR /app

# 먼저 package.json 파일들만 복사하여 의존성 설치 준비
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* turbo.json* ./
COPY apps/isomorphic/package.json ./apps/isomorphic/
# 다른 워크스페이스 패키지가 있다면 추가

# 의존성 설치
RUN pnpm install

# 소스 코드 복사
COPY . .

# Next.js의 standalone 모드로 빌드
RUN turbo build --filter=isomorphic

# 프로덕션 단계
FROM node:22.14.0-alpine AS runner
WORKDIR /app

# 필요한 패키지 설치
RUN apk add --no-cache libc6-compat

# pnpm 설치 (프로덕션 의존성 설치에 필요)
RUN npm install -g pnpm@9.9.0

# 환경 변수 설정
ENV NODE_ENV production

# 사용자 추가
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사 - Next.js standalone 모드 확인
COPY --from=builder --chown=nextjs:nodejs /app/apps/isomorphic/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/isomorphic/.next/static ./apps/isomorphic/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/isomorphic/public ./apps/isomorphic/public

# 환경 변수 파일 복사 (있는 경우)
COPY --from=builder --chown=nextjs:nodejs /app/apps/isomorphic/.env.local ./apps/isomorphic/.env.local

# 사용자 변경
USER nextjs

# 포트 노출
EXPOSE 3000

# 서버 실행 환경 설정
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Next.js standalone 모드에서 생성된 서버 실행
CMD ["node", "apps/isomorphic/server.js"]
