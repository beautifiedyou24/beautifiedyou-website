build:
	docker compose build

up:
	docker compose up --build -d

down:
	docker compose down

dev: down up log

log:
	docker logs --follow bycs-web

enter:
	docker exec -it bycs-web sh