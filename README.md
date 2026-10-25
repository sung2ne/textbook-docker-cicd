# PART 02 05장 실전 Compose 패턴 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `01-healthcheck/myproject/` | 01절 "실전 예제 - 3계층 아키텍처" | `docker-compose.yml`, `.env.example`, `app/` |
| `02-dev-prod/project/` | 02절 개발 환경 vs 프로덕션 환경 | `docker-compose.yml`, `docker-compose.override.yml`, `docker-compose.prod.yml`, `Makefile`, `.env.example`, `app/` |

두 폴더의 `app/`은 책에 따로 실리지 않았습니다. 환경 변수 이름(`DB_HOST`·`DB_NAME`·`DB_USER`·`DB_PASSWORD`)이 맞는 04장 02절의 `app/`을 그대로 복사해 두었습니다. 01절 폴더 이름 `myproject`는 본문의 `docker compose ps` 출력 예시에 맞춘 것입니다.

두 예제의 `.env` 변수 이름이 다릅니다. 01절은 `DB_ROOT_PASSWORD`·`DB_PASSWORD`·`REDIS_PASSWORD`, 02절은 04장 02절과 같은 `MYSQL_ROOT_PASSWORD`·`DB_PASSWORD`입니다.

## 01절 3계층 구성과 헬스체크

```bash
cd 01-healthcheck/myproject
cp .env.example .env   # 비밀번호 값을 바꿔 쓴다

docker compose up -d --build

# 서비스 상태 확인 (STATUS 열에 healthy/unhealthy 표시)
docker compose ps

# 헬스체크 이력
docker inspect --format='{{json .State.Health}}' $(docker compose ps -q db) | python3 -m json.tool

# 앱 헬스 체크
curl http://localhost:8080/actuator/health

# 정리
docker compose down -v
cd ../..
```

## 02절 개발 환경 vs 프로덕션 환경

```bash
cd 02-dev-prod/project
cp .env.example .env   # 비밀번호 값을 바꿔 쓴다

# 개발 환경 (override가 자동 적용됨, 처음에는 이미지를 빌드한다)
docker compose up -d
docker compose ps
curl http://localhost:8080/actuator/health
docker compose down

# 프로덕션 병합 결과 확인
docker compose -f docker-compose.yml -f docker-compose.prod.yml config

# Makefile
make dev    # 개발 환경 실행
make down   # 서비스 중지
make clean  # 서비스 중지 + 볼륨 삭제
cd ../..
```

프로덕션 실행(`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`, `make prod`)은 CI가 레지스트리에 올린 이미지(`${DOCKER_REGISTRY}/myapp:${APP_VERSION}`)를 받아 띄우므로, `.env`에 `DOCKER_REGISTRY`를 넣고 그 이미지가 있어야 합니다. 본문의 `docker-compose.test.yml`은 내용이 실려 있지 않아 넣지 않았습니다.

03절(트러블슈팅)은 위 폴더에서 본문의 진단 명령을 따라 칩니다. 본문 5단계의 `docker system prune -a --volumes`는 이 컴퓨터의 다른 프로젝트 이미지·볼륨까지 지우므로 공용 PC에서는 치지 않습니다.
