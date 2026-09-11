# Setup Guide

## Prerequisites

Ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v1.29+)
- **Node.js** (v18+) with npm
- **Python** (v3.9+) with pip
- **Go** (v1.21+)
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/muminte333-oss/copilot-starter-kit.git
cd copilot-starter-kit
```

### 2. Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Services will be available at:
- API: http://localhost:3000
- Go Service: http://localhost:8080
- Database: localhost:5432

### 3. Local Development Setup

#### Node.js API

```bash
cd services/api
npm install
npm run dev
# Available at http://localhost:3000
```

#### Python CLI

```bash
cd services/python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m click_cli --help
```

#### Go Service

```bash
cd services/go
go mod download
go run main.go
# Available at http://localhost:8080
```

## Environment Configuration

Create `.env` file in root directory:

```env
NODE_ENV=development
PORT=3000
GO_PORT=8080
DATABASE_URL=postgresql://starter:starter123@db:5432/starterdb
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key
```

## Running Tests

```bash
make test
```

## Stopping Services

```bash
docker-compose down
```

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Or kill process using the port
lsof -i :3000
kill -9 <PID>
```

**Database connection issues:**
```bash
# Ensure database container is running
docker-compose ps db
# Check database logs
docker-compose logs db
```
