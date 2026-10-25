#!/bin/bash
# /opt/scripts/healthcheck.sh

APP_URL="http://localhost:8080/actuator/health"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

response=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL)

if [ "$response" != "200" ]; then
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    message="[ALERT] $timestamp - 앱 헬스체크 실패 (HTTP $response)"

    # Slack 알림 전송
    curl -s -X POST $SLACK_WEBHOOK \
        -H 'Content-type: application/json' \
        -d "{\"text\": \"$message\"}"

    # 자동 재시작 시도
    cd /opt/myapp || exit 1
    docker compose restart app

    echo "$message - 재시작 시도" >> "$HOME/healthcheck.log"
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - OK" >> "$HOME/healthcheck.log"
fi
