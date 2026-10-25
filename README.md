# PART 01 01장 컨테이너와 Docker — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

| 폴더 | 책 | 파일 |
|---|---|---|
| `04-first-container/my-python-app/` | 04절 "실습 - Python 웹 애플리케이션 실행" | `app.py`, `Dockerfile` |

01절의 Dockerfile(`shopping-app`)은 설명용이라 넣지 않았습니다. 02·03절과 04절 앞부분(nginx)은 명령만 있으므로 본문을 따라 칩니다.

## 04절 Python 웹 앱

```bash
cd 04-first-container/my-python-app

# 이미지 빌드
docker build -t my-python-app .

# 컨테이너 실행 (호스트 5001 → 컨테이너 5000)
docker run -d --name python-server -p 5001:5000 my-python-app

# 테스트
curl http://localhost:5001
# {"message": "안녕하세요! Docker 컨테이너에서 실행 중입니다."}
```

macOS 12 이상은 AirPlay 수신기가 5000번 포트를 쓰므로 호스트 쪽을 5001로 매핑합니다. 컨테이너 안의 앱은 그대로 5000번에서 돕니다.

실습을 마쳤으면 컨테이너를 정리합니다(본문은 앞에서 띄운 `my-nginx`도 함께 지웁니다).

```bash
docker rm -f python-server
```
