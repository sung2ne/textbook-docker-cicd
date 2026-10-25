# PART 04 08장 Spring Boot 앱 배포하기 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더·파일 | 책 | 내용 |
|---|---|---|
| `my-spring-app/` | 01절 "실습용 Spring Boot 프로젝트 준비" | `settings.gradle.kts`, `build.gradle.kts`, `src/`(`DemoApplication`, `HelloController`, `application.yml`, `DemoApplicationTests`), Gradle 래퍼(`gradlew`, `gradlew.bat`, `gradle/wrapper/`) |
| `my-spring-app/Dockerfile`, `.dockerignore` | 01절 | 멀티스테이지 Dockerfile(`eclipse-temurin:21-jdk` → `21-jre`) |
| `my-spring-app/docker-compose.yml` | 02절 | 로컬 전체 스택(app + PostgreSQL + Redis) |
| `my-spring-app/src/main/resources/application-docker.yml`, `application-production.yml` | 02절 | `docker`·`production` 프로필 |
| `my-spring-app/src/main/resources/application-staging.yml` | 07장 03절 끝 문단 | `production` 프로필과 같은 내용(07장 스테이징 서버용) |
| `my-spring-app/.github/workflows/deploy.yml` | 03절 | 테스트 → 이미지 푸시 → 스테이징 → 운영 배포 |
| `server/docker-compose.yml`, `server/.env.example` | 03절 "배포 서버의 docker-compose.yml" | 배포 서버의 `/opt/myapp`에 둘 파일 |
| `scripts/healthcheck.sh` | 04절 "헬스체크 스크립트" | 서버의 `/opt/scripts/healthcheck.sh`에 둘 파일 |

Spring Boot는 3.5.16, JDK는 21입니다. Gradle 래퍼는 01절의 명령(`docker run --rm -v "$PWD":/app -w /app gradle:8.5-jdk21 gradle wrapper`)으로 만든 Gradle 8.5 래퍼입니다.

## 01절 테스트·이미지 빌드·실행

```bash
cd my-spring-app

# 테스트 (JDK 21이 있으면 ./gradlew test, 없으면 컨테이너에서)
docker run --rm -v "$PWD":/app -w /app eclipse-temurin:21-jdk ./gradlew test --no-daemon

# 이미지 빌드
docker build -t my-spring-app .
docker images my-spring-app

# 실행과 확인
docker run -d --name my-app -p 8080:8080 my-spring-app
curl localhost:8080/actuator/health/liveness
# {"status":"UP"}
curl localhost:8080/api/hello
# {"message":"Hello from Spring Boot"}
docker logs my-app

# 02절에서 같은 8080 포트를 쓰므로 정리
docker rm -f my-app
cd ..
```

혼자 띄운 컨테이너에는 Redis가 없어 `/actuator/health`는 DOWN(503)이 정상입니다(01절).

## 02절 Compose로 로컬 환경 구성

```bash
cd my-spring-app

docker compose up -d
docker compose ps

# 헬스체크 (db·redis가 UP)
curl localhost:8080/actuator/health

# DB와 Redis 직접 확인
docker compose exec db psql -U myuser -d myapp -c "SELECT 1"
docker compose exec redis redis-cli ping

docker compose logs --tail 50

# 정리 (볼륨까지)
docker compose down -v
cd ..
```

## 03절 자동 배포 · 04절 모니터링

- `my-spring-app/.github/workflows/deploy.yml`은 `my-spring-app`을 자기 저장소로 올렸을 때 맨 위의 `.github/workflows/`에서 돕니다. 시크릿(`STAGING_*`, `PROD_*`)과 `staging`·`production` Environment는 03절대로 등록합니다.
- 배포 서버 준비(GHCR 로그인, `/opt/myapp`, `.env`)는 03절을 따릅니다. `server/.env.example`은 본문의 `printf`가 만드는 `.env`와 같은 내용입니다. `server/docker-compose.yml`의 이미지 이름 `ghcr.io/사용자명/저장소명`은 자기 저장소 이름(소문자)으로 바꿉니다.
- `scripts/healthcheck.sh`의 설치(`chmod`, `crontab`)와 로그 확인 명령은 04절을 따릅니다. 스크립트의 Slack 주소는 자기 Webhook URL로 바꿉니다.
