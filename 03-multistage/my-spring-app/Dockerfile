# ========== Stage 1: 빌드 스테이지 ==========
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# 의존성 캐싱을 위해 빌드 파일만 먼저 복사
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

# 소스코드 복사 후 빌드
COPY src ./src
RUN gradle bootJar --no-daemon

# ========== Stage 2: 실행 스테이지 ==========
FROM eclipse-temurin:17-jre

WORKDIR /app

# 빌드 스테이지에서 JAR 파일만 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 보안을 위해 루트가 아닌 사용자로 실행 (Ubuntu 기반이므로 groupadd/useradd)
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
