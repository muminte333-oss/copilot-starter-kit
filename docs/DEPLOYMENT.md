# Deployment Guide

## Local Deployment with Docker Compose

### Prerequisites

- Docker 20.10+
- Docker Compose 1.29+
- At least 2GB free RAM
- 1GB free disk space

### Quick Start

```bash
# Clone the repository
git clone https://github.com/muminte333-oss/copilot-starter-kit.git
cd copilot-starter-kit

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Accessing Services

- **Node.js API:** http://localhost:3000
- **Go Service:** http://localhost:8080
- **Database:** postgres://starter:starter123@localhost:5432/starterdb

### Running Commands

```bash
# Stop services
docker-compose down

# Remove all data
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View specific service logs
docker-compose logs api
docker-compose logs go-service
```

## Production Deployment

### Kubernetes

Create deployment manifests in `k8s/` directory:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: copilot-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: copilot-api
  template:
    metadata:
      labels:
        app: copilot-api
    spec:
      containers:
      - name: api
        image: copilot-starter-kit:api-latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

### Docker Registry

Push images to Docker Hub or private registry:

```bash
# Build images
docker-compose build

# Tag images
docker tag copilot-starter-kit:api-latest username/copilot-api:latest

# Push to registry
docker push username/copilot-api:latest
```

### Environment Configuration

Create `.env.production` file:

```env
NODE_ENV=production
PORT=3000
GO_PORT=8080
DATABASE_URL=postgresql://user:password@db-host:5432/dbname
LOG_LEVEL=info
```

## Monitoring

### Docker Stats

```bash
docker-compose stats
```

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check Go service health
curl http://localhost:8080/health
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Out of Memory

```bash
# Limit Docker memory
docker-compose down
docker system prune -a
```

### Database Connection Issues

```bash
# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

## Backup and Recovery

### Database Backup

```bash
docker-compose exec db pg_dump -U starter starterdb > backup.sql
```

### Database Restore

```bash
docker-compose exec -T db psql -U starter starterdb < backup.sql
```

## Scaling

To scale services:

```bash
# Scale Node.js API to 3 instances
docker-compose up -d --scale api=3
```

Note: Use load balancer (nginx, HAProxy) for multiple instances.
