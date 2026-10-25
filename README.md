# PART 04 09장 그 다음 단계 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

08장 브랜치(`part04/chapter-08`)의 파일에 09장 01절 보안 설정과 02절 Kubernetes 매니페스트를 더한 브랜치입니다. 01절은 고칠 부분만 조각으로 보이므로, 08장 파일에 그 조각을 넣어 완성본을 만들었습니다.

| 파일 | 08장 파일에서 바뀐 곳 (책 출처) |
|---|---|
| `my-spring-app/Dockerfile` | 실행 스테이지의 사용자 생성 줄을 `useradd -r -g appuser -s /bin/false appuser`로(01절 "루트가 아닌 사용자로 실행") |
| `server/docker-compose.yml` | app에 `read_only`·`tmpfs`(01절 "읽기 전용 파일시스템"), `deploy.resources`(01절 "리소스 제한 설정"), app·db·redis에 `networks`와 맨 끝 `frontend`·`backend(internal)` 네트워크(01절 "네트워크 분리") |
| `my-spring-app/.github/workflows/deploy.yml` | `build-and-push` 잡의 "Docker 이미지 빌드 & 푸시" 앞에 스캔용 이미지 빌드와 Trivy 스캔 스텝(01절 "이미지 취약점 스캐닝") |
| `my-spring-app/deployment.yml`, `my-spring-app/service.yml` | 새 파일(02절) |

나머지 파일은 08장과 같습니다. 각 파일의 설명은 08장 브랜치의 README를 봅니다. 01절의 Distroless Dockerfile은 다른 실행 베이스를 보여 주는 예시라 넣지 않았습니다.

## 01절 non-root 실행 확인

```bash
cd my-spring-app
docker build -t my-spring-app .
docker run -d --name my-app -p 8080:8080 my-spring-app
docker exec my-app whoami
# appuser
curl localhost:8080/actuator/health/liveness
# {"status":"UP"}
docker rm -f my-app
cd ..
```

## 01절 보안 설정을 넣은 서버 compose

`server/docker-compose.yml`은 배포 서버의 `/opt/myapp`에 둡니다. 서버 준비와 배포는 08장 03절과 같습니다. 이미지 이름 `ghcr.io/사용자명/저장소명`은 자기 저장소 이름(소문자)으로 바꿉니다.

## 02절 Kubernetes

`deployment.yml`·`service.yml`은 `my-spring-app` 폴더에 있습니다. 02절의 minikube 설치·이미지 빌드·`kubectl apply` 명령은 이 폴더에서 칩니다. 클러스터에 DB가 없으므로 프로필 없이 기본 설정(H2)으로 뜹니다.
