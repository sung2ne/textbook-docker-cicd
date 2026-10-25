# Makefile
.PHONY: dev prod down clean

dev:
	docker compose up -d --build

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down:
	docker compose down

clean:
	docker compose down -v --remove-orphans
