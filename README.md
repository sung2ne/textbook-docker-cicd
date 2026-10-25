# PART 03 07장 실전 CI/CD 파이프라인 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `01-test-pipeline/my-first-cicd/` | 01절 Node.js 테스트 파이프라인 | 06장 03절 프로젝트 + `eslint.config.js`, `lint` 스크립트, `.github/workflows/ci.yml` |
| `01-test-pipeline/spring-ci-example/` | 01절 Spring Boot 테스트 파이프라인 | `.github/workflows/ci.yml` |
| `02-docker-build-push/` | 02절 Docker 이미지 빌드와 푸시 | `.github/workflows/docker.yml`(기본 빌드), `.github/workflows/ci-cd.yml`(완성된 워크플로) |
| `03-staging-deploy/` | 03절 스테이징 자동 배포 | `.github/workflows/deploy-staging.yml`, `server/docker-compose.yml`, `server/.env.example` |
| `04-production-deploy/` | 04절 프로덕션 배포와 롤백 | `.github/workflows/deploy-production.yml` |

`my-first-cicd`의 `package.json`·`package-lock.json`은 06장 프로젝트에 본문의 명령(`npm install --save-dev eslint @eslint/js globals`, `npm pkg set scripts.lint="eslint src"`)을 실행한 결과입니다.

워크플로는 각 폴더 안의 `.github/workflows/`에 있습니다. 쓰려는 것만 자기 저장소 맨 위의 `.github/workflows/`로 옮깁니다. `docker.yml`과 `ci-cd.yml`은 같은 푸시에 둘 다 돌므로 하나만 둡니다.

- Java 워크플로(`spring-ci-example`, `02`~`04`)는 Dockerfile과 `gradlew`가 맨 위에 있는 Spring Boot 프로젝트용입니다. 책에서 그런 프로젝트는 08장 브랜치(`part04/chapter-08`)의 `my-spring-app`입니다.
- `spring-ci-example/…/ci.yml`과 `02-docker-build-push/…/ci-cd.yml`의 테스트 잡은 JDK 17을 씁니다. 08장 프로젝트는 JDK 21이라 그대로 두면 `./gradlew test`가 `invalid source release: 21`로 실패합니다(08장 03절의 워크플로는 JDK 21). 이미지만 빌드하는 `docker.yml`, `deploy-staging.yml`, `deploy-production.yml`은 JDK를 쓰지 않습니다.
- 03·04절 워크플로가 쓰는 시크릿(`STAGING_HOST`·`STAGING_USER`·`STAGING_SSH_KEY`, `PROD_HOST`·`PROD_USER`·`PROD_SSH_KEY`, `SLACK_WEBHOOK_URL`)과 `production` Environment는 본문대로 등록합니다.
- `server/`는 스테이징 서버의 `/opt/app`에 둘 파일입니다. 서버 준비(GHCR 로그인, `.env`)는 03절을 따릅니다. 이 compose는 `staging` 프로필을 쓰므로 앱에 `application-staging.yml`이 있어야 합니다(03절 끝 문단). 08장 브랜치의 `my-spring-app`에 들어 있습니다.
- 프로덕션 서버도 `/opt/app`에 같은 구성을 둡니다(04절). 수동 롤백 명령도 04절에 있습니다.

## 01절 로컬에서 린트와 테스트

```bash
cd 01-test-pipeline/my-first-cicd
npm ci
npm run lint
npm test -- --coverage --ci
cd ../..
```
