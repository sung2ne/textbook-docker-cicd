# PART 01 03장 볼륨과 네트워크 — 실습 코드

교재: https://text.ibetter.kr/docker-cicd

이 장은 compose 파일 없이 `docker` 명령으로 실습합니다. 명령은 아래에 절 순서대로 모았습니다.

| 폴더·파일 | 책 | 내용 |
|---|---|---|
| `03-troubleshooting/application.yml` | 03절 "에러 2"의 "올바른 설정" | DB 호스트를 `localhost`가 아닌 컨테이너 이름(`mysql-db`)으로 쓴 설정 |

02절 네트워크 실습은 02장에서 만든 `my-spring-app:optimized` 이미지를 씁니다. 먼저 `part01/chapter-02` 브랜치의 `03-multistage/my-spring-app`에서 `docker build -t my-spring-app:optimized .`로 이미지를 만들어 둡니다.

## 01절 볼륨

```bash
# 볼륨 생성과 확인
docker volume create mysql-data
docker volume ls
docker volume inspect mysql-data

# 볼륨을 연결해 MySQL 실행
docker run -d \
    --name mysql-dev \
    -e MYSQL_ROOT_PASSWORD=rootpass \
    -e MYSQL_DATABASE=devdb \
    -v mysql-data:/var/lib/mysql \
    -p 3306:3306 \
    mysql:8.4

# 첫 실행은 초기화에 10~30초가 걸린다. ready for connections … port: 3306 줄이 보일 때까지 기다린다
until docker logs mysql-dev 2>&1 | grep -q 'port: 3306'; do sleep 2; done

# 데이터 입력
docker exec -it mysql-dev mysql -uroot -prootpass -e \
    "CREATE TABLE devdb.users (id INT, name VARCHAR(50));
     INSERT INTO devdb.users VALUES (1, '김개발');"

# 컨테이너 삭제
docker stop mysql-dev
docker rm mysql-dev

# 같은 볼륨으로 새 컨테이너 생성
docker run -d \
    --name mysql-dev \
    -e MYSQL_ROOT_PASSWORD=rootpass \
    -v mysql-data:/var/lib/mysql \
    -p 3306:3306 \
    mysql:8.4

# 이번에도 ready for connections … port: 3306 줄이 보일 때까지 기다린다
until docker logs mysql-dev 2>&1 | grep -q 'port: 3306'; do sleep 2; done

# 데이터 확인 - 살아있다!
docker exec -it mysql-dev mysql -uroot -prootpass -e \
    "SELECT * FROM devdb.users;"

# 정리: 컨테이너를 먼저 지우고 볼륨을 지운다
docker rm -f mysql-dev
docker volume rm mysql-data
```

본문의 Bind Mount 예시(`node-dev`)는 `package.json`과 `dev` 스크립트가 있는 Node 프로젝트 폴더에서 칩니다. 이 브랜치에는 그 프로젝트가 없습니다.

## 02절 네트워크

```bash
# 사용자 정의 네트워크 생성
docker network create app-network
docker network ls

# Spring Boot와 MySQL을 같은 네트워크에 연결
docker network create spring-net

docker run -d \
    --name mysql-db \
    --network spring-net \
    -e MYSQL_ROOT_PASSWORD=rootpass \
    -e MYSQL_DATABASE=devdb \
    -v mysql-data:/var/lib/mysql \
    mysql:8.4

# MySQL이 준비될 때까지 기다린다(03절 "에러 2"의 확인 명령)
until docker logs mysql-db 2>&1 | grep "ready for connections" | grep -q "port: 3306"; do sleep 2; done

docker run -d \
    --name spring-app \
    --network spring-net \
    -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/devdb \
    -e SPRING_DATASOURCE_USERNAME=root \
    -e SPRING_DATASOURCE_PASSWORD=rootpass \
    -p 8080:8080 \
    my-spring-app:optimized

# 앱이 컨테이너 이름(mysql-db)으로 DB에 붙었는지 확인
curl http://localhost:8080/actuator/health

# 네트워크에 연결된 컨테이너 목록 확인
docker network inspect spring-net

# 같은 네트워크에 진단용 컨테이너를 붙여서 확인
# (본문은 busybox 셸을 열어 nslookup·ping을 친다. 여기서는 한 줄씩 실행)
docker run --rm --network spring-net busybox nslookup mysql-db
docker run --rm --network spring-net busybox ping -c 1 mysql-db

# 정리
docker rm -f spring-app mysql-db
docker network rm spring-net app-network
```

## 03절 트러블슈팅

`application.yml`의 DB 주소에 `localhost`를 쓰면 컨테이너 자기 자신을 가리켜 `Connection refused`가 납니다. `03-troubleshooting/application.yml`처럼 컨테이너 이름을 씁니다. 나머지 진단 명령은 본문을 따라 칩니다.
