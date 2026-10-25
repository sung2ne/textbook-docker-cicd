# 소설처럼 읽는 Docker와 CI/CD — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

책에 실린 코드를 장마다 브랜치 하나에 담았습니다. `main`에는 예제 코드가 없으니, 읽고 있는 장의 브랜치로 바꿔서 쓰세요. 파일은 책 본문(v1.1.0, 2026-10-25)의 코드 블록을 그대로 옮겼고, 책에 없는 파일(잠금 파일, Gradle 래퍼 등)은 책이 안내한 명령으로 만들었습니다. 09장은 01절의 조각을 08장 파일에 넣은 완성본입니다. 자세한 것은 각 장 README에 있습니다.

## 브랜치

| 브랜치 | 장 | 담긴 것 |
|---|---|---|
| `part01/chapter-01` | 01장 컨테이너와 Docker | 04절 Python 웹 앱(`app.py`, `Dockerfile`) |
| `part01/chapter-02` | 02장 Docker 이미지와 컨테이너 | 02절 Flask 앱, 03절 Spring Boot 멀티스테이지 빌드, 04절 `.dockerignore` |
| `part01/chapter-03` | 03장 볼륨과 네트워크 | 01·02절 볼륨·네트워크 실습 명령, 03절의 고친 `application.yml` |
| `part02/chapter-04` | 04장 Compose로 멀티 컨테이너 운영 | 01절 Nginx+MySQL, 02절 Spring Boot+MySQL, 03절 Node.js+MongoDB, 04절 Compose secrets |
| `part02/chapter-05` | 05장 실전 Compose 패턴 | 01절 헬스체크를 넣은 3계층 구성, 02절 개발·프로덕션 compose 나누기 |
| `part03/chapter-06` | 06장 CI/CD 개념과 GitHub Actions | 02절 워크플로 예시, 03절 첫 워크플로와 Node.js 프로젝트 |
| `part03/chapter-07` | 07장 실전 CI/CD 파이프라인 | 01절 린트·테스트 파이프라인, 02절 이미지 빌드·푸시, 03절 스테이징 배포, 04절 프로덕션 배포·롤백 |
| `part04/chapter-08` | 08장 Spring Boot 앱 배포하기 | Spring Boot 3.5 프로젝트(Gradle 래퍼 포함), Dockerfile, 로컬·서버 compose, 배포 워크플로, 헬스체크 스크립트 |
| `part04/chapter-09` | 09장 그 다음 단계 | 08장 프로젝트에 01절 보안 설정을 더한 것, 02절 Kubernetes 매니페스트 |

각 장 브랜치의 `README.md`에 폴더마다 책의 어느 절인지와 실행 명령을 적어 두었습니다.

## 받는 방법

저장소를 받고 장 브랜치로 바꿉니다.

```bash
git clone https://github.com/sung2ne/textbook-docker-cicd.git
cd textbook-docker-cicd
git checkout part02/chapter-04
```

한 장만 받으려면 브랜치를 지정합니다.

```bash
git clone -b part02/chapter-04 --single-branch https://github.com/sung2ne/textbook-docker-cicd.git textbook-docker-cicd-ch04
```

## 비밀 정보

실제 비밀번호가 든 `.env`와 `secrets/*.txt`는 커밋하지 않습니다(책 04장 04절). 저장소에는 `.env.example`과 `*.example`만 있으니, 같은 폴더에 복사해 값을 넣어 씁니다(예: `cp .env.example .env`).
