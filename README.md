# PART 03 06장 CI/CD 개념과 GitHub Actions — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `02-workflow-structure/` | 02절 "김개발이 처음 작성한 워크플로우" | `.github/workflows/ci.yml` |
| `03-first-workflow/my-first-cicd/` | 03절 "첫 번째 워크플로우 만들기" | `package.json`, `package-lock.json`, `.gitignore`, `src/calculator.js`, `src/calculator.test.js`, `.github/workflows/ci.yml` |
| `03-first-workflow/java-ci-example/` | 03절 "Java 프로젝트라면" | `.github/workflows/ci.yml` |

`package.json`·`package-lock.json`·`.gitignore`는 본문의 명령(`npm init -y`, `printf "node_modules/\ncoverage/\n" > .gitignore`, `npm install --save-dev jest`)으로 만들고 `scripts.test`를 `jest`로 바꾼 것입니다. 02절의 트리거·매트릭스·`needs` 예시와 04절의 시크릿 예시는 워크플로 일부만 보인 조각이라 파일로 두지 않았습니다.

워크플로는 각 폴더 안의 `.github/workflows/`에 있습니다. GitHub는 저장소 맨 위의 `.github/workflows/`만 읽으므로, 폴더를 자기 저장소(본문의 `my-first-cicd`)로 옮겨 푸시해야 돕니다. 저장소 만들기와 푸시는 03절을 따릅니다.

`java-ci-example`의 워크플로는 `gradlew`가 있는 Gradle 프로젝트 맨 위에 두는 예시이고 JDK 17을 씁니다. 책에서 `gradlew`가 있는 프로젝트는 08장의 `my-spring-app`(JDK 21)뿐이라, 거기에 그대로 두면 `./gradlew test`가 `invalid source release: 21`로 실패합니다. 08장 03절의 워크플로는 JDK 21을 씁니다.

## 03절 로컬 테스트

```bash
cd 03-first-workflow/my-first-cicd
npm ci
npm test
cd ../..
```
