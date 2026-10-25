# app/Dockerfile
FROM node:24-alpine

WORKDIR /app

# 의존성 파일만 먼저 복사하여 캐시 활용
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 소스 코드 복사
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
