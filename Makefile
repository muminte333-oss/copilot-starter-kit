.PHONY: help install dev build test clean up down logs

help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development environment"
	@echo "  make build      - Build all services"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make up         - Start Docker containers"
	@echo "  make down       - Stop Docker containers"
	@echo "  make logs       - View Docker logs"

install:
	cd services/api && npm install
	cd services/python && pip install -r requirements.txt
	cd services/go && go mod download

dev:
	docker-compose up --build

build:
	docker-compose build

test:
	cd services/api && npm test
	cd services/python && pytest
	cd services/go && go test ./...

clean:
	docker-compose down -v
	find . -type d -name node_modules -exec rm -rf {} +
	find . -type d -name __pycache__ -exec rm -rf {} +

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f
