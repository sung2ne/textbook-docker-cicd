# ========== 1단계: 빌드 스테이지 ==========
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Gradle 래퍼와 설정 파일 먼저 복사 (캐시 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

# 의존성만 먼저 다운로드 (소스 변경 시 캐시 재사용)
RUN chmod +x ./gradlew && ./gradlew dependencies --no-daemon

# 소스 코드 복사 후 빌드
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# ========== 2단계: 실행 스테이지 ==========
FROM eclipse-temurin:21-jre

WORKDIR /app

# 보안: 루트가 아닌 전용 사용자로 실행
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser

# 빌드 결과물만 복사 (복사하면서 소유자 지정)
COPY --from=builder --chown=appuser:appuser /app/build/libs/*.jar app.jar
USER appuser

# 포트 노출
EXPOSE 8080

# JVM 메모리 설정과 함께 실행
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
