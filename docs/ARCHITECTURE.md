# Architecture Overview

## System Design

The Copilot Starter Kit is a multi-service architecture designed to demonstrate best practices across different technology stacks.

### Service Diagram

```
┌─────────────────────────────────────────────────┐
│         Client Applications                      │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐  ┌─────────┐  ┌──────────┐
   │  API   │  │   CLI   │  │ GitHub   │
   │(Node)  │  │(Python) │  │  App     │
   └────┬───┘  └────┬────┘  └──┬───────┘
        │           │          │
        └───────────┼──────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌─────────────┐      ┌───────────────┐
   │  Go Service │      │   PostgreSQL  │
   │ (Port 8080) │      │   Database    │
   └─────────────┘      └───────────────┘
```

### Components

#### 1. **Node.js REST API** (`services/api/`)
- Express.js framework
- TypeScript for type safety
- RESTful endpoints
- Port: 3000
- Hot reload in development

#### 2. **Python CLI** (`services/python/`)
- Click framework for CLI
- Task scheduling capabilities
- Integration with other services
- Batch processing

#### 3. **Go Microservice** (`services/go/`)
- High-performance backend
- Concurrent request handling
- Port: 8080
- gRPC/HTTP endpoints

#### 4. **GitHub App** (`github-app/`)
- Webhook handling
- Repository automation
- PR/Issue automation
- Integration with main services

#### 5. **Database** 
- PostgreSQL for persistence
- Optional for development
- Port: 5432

## Data Flow

1. **Client Request** → Node.js API
2. **API** processes request and may call:
   - Go Service (for heavy computation)
   - Database (for persistence)
3. **Response** returns to client
4. **Async Tasks** handled by Python CLI or GitHub App

## Deployment Strategy

- Docker Compose for local development
- Kubernetes-ready architecture
- Each service independently scalable
- Environment-based configuration
