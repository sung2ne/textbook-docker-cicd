# PART 01 02장 Docker 이미지와 컨테이너 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `02-dockerfile/my-flask-app/` | 02절 "실제 프로젝트를 만들어 보겠습니다" | `app.py`, `requirements.txt`, `Dockerfile`, `.dockerignore` |
| `03-multistage/my-spring-app/` | 03절 "실습용 Spring Boot 프로젝트 준비"와 멀티스테이지 Dockerfile, 04절 `.dockerignore` | `settings.gradle`, `build.gradle`, `src/…/DemoApplication.java`, `Dockerfile`(멀티스테이지), `Dockerfile.single`(03절에서 처음 작성한 단일 스테이지), `.dockerignore`(04절) |

03절의 두 Dockerfile은 책에서 같은 이름(`Dockerfile`)입니다. 크기를 비교할 수 있도록 처음 것을 `Dockerfile.single`로 따로 두었습니다. 01절과 04절의 나머지 코드는 설명용 조각입니다.

## 02절 Flask 앱

```bash
cd 02-dockerfile/my-flask-app

# 이미지 빌드 (-t: 이미지 이름 태그 지정)
docker build -t my-flask-app:1.0.0 .

# 컨테이너 실행 (호스트 5002 → 컨테이너 5000)
docker run -d --name flask-server -p 5002:5000 my-flask-app:1.0.0

# 테스트
curl http://localhost:5002
# {"service":"쇼핑몰 API","version":"1.0.0","status":"running"}

curl http://localhost:5002/health
# {"status":"healthy"}

# 이미지 목록과 빌드 히스토리
docker images my-flask-app
docker history my-flask-app:1.0.0

# 정리
docker rm -f flask-server
cd ../..
```

## 03절 멀티스테이지 빌드 · 04절 이미지 최적화

Spring Boot는 3.5.16, 빌드 이미지는 `gradle:8.5-jdk17`입니다(start.spring.io의 4.x는 이 이미지로 빌드되지 않습니다).

```bash
cd 03-multistage/my-spring-app

# 03절에서 처음 작성한 단일 스테이지 Dockerfile
docker build -f Dockerfile.single -t my-spring-app:latest .

# 멀티스테이지 Dockerfile
docker build -t my-spring-app:optimized .

# 두 이미지의 크기 비교
docker image ls my-spring-app

# 04절 레이어별 크기
docker history my-spring-app:optimized
cd ../..
```

`my-spring-app:optimized` 이미지는 03장(`part01/chapter-03`)의 네트워크 실습에서 다시 씁니다.
