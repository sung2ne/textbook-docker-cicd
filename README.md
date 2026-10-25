# PART 02 04장 Compose로 멀티 컨테이너 운영 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `01-compose-basics/my-first-compose/` | 01절 "첫 번째 Compose 파일 작성" | `docker-compose.yml`, `html/index.html`(본문의 `echo` 명령으로 만든 것) |
| `02-spring-mysql/spring-mysql-compose/` | 02절 Spring Boot + MySQL | `docker-compose.yml`, `.env.example`, `.gitignore`, `init-db/init.sql`, `app/`(Dockerfile, `application.yml`, 02장 03절의 Gradle 파일과 `DemoApplication.java`) |
| `03-node-mongo/node-mongo-compose/` | 03절 Node.js + MongoDB | `docker-compose.yml`, `.env.example`, `app/`(`package.json`, `package-lock.json`, `src/index.js`, Dockerfile, `.dockerignore`), `mongo-init/init.js` |
| `04-secrets/` | 04절 "Compose secrets로 비밀번호를 파일로 전달하기" | `docker-compose.yml`, `secrets/db_root_password.txt.example` |

`.env`와 `secrets/*.txt`는 커밋하지 않았습니다. 각 폴더에서 `.example` 파일을 복사해 값을 넣어 씁니다. `app/package-lock.json`은 03절의 명령(`docker run --rm -v "$PWD/app":/app -w /app node:24-alpine npm install --package-lock-only`)으로 만들어 커밋해 두었습니다.

## 01절 Nginx + MySQL

```bash
cd 01-compose-basics/my-first-compose

docker compose up -d
docker compose ps
curl http://localhost:8080
# <h1>Hello from Docker Compose!</h1>

docker compose logs web

# 컨테이너·네트워크·볼륨 정리
docker compose down -v
cd ../..
```

## 02절 Spring Boot + MySQL

```bash
cd 02-spring-mysql/spring-mysql-compose
cp .env.example .env   # 비밀번호 값을 바꿔 쓴다

# 이미지 빌드 후 서비스 시작
docker compose up -d --build
docker compose ps

# 헬스 체크
curl http://localhost:8080/actuator/health

# 컨테이너에 전달된 환경 변수 확인
docker compose exec app env | grep DB_

# 정리
docker compose down -v
cd ../..
```

## 03절 Node.js + MongoDB

```bash
cd 03-node-mongo/node-mongo-compose
cp .env.example .env   # 비밀번호 값을 바꿔 쓴다

docker compose up -d --build
docker compose ps

# 헬스 체크
curl http://localhost:3000/health

# 할 일 목록 조회
curl http://localhost:3000/api/todos

# 새 할 일 추가
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Kubernetes 입문하기"}'

# 정리
docker compose down -v
cd ../..
```

Mongo Express는 `http://localhost:8081`에서 열립니다.

## 04절 Compose secrets

```bash
cd 04-secrets
cp secrets/db_root_password.txt.example secrets/db_root_password.txt   # 값을 바꿔 쓴다

docker compose up -d

# 컨테이너 안에서는 /run/secrets/db_root_password로 보인다
docker compose exec db cat /run/secrets/db_root_password

# MySQL이 준비되면 그 파일의 값으로 root 접속이 된다
until docker compose logs db 2>&1 | grep -q 'port: 3306'; do sleep 2; done
docker compose exec db mysql -uroot -p"$(cat secrets/db_root_password.txt)" -e "SELECT 1"

# 정리
docker compose down -v
cd ..
```

비밀번호 파일에는 값 한 줄만 둡니다. MySQL 이미지는 `_FILE`이 가리키는 파일 내용을 통째로 비밀번호로 읽습니다.
