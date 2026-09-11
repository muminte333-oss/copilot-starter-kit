# Copilot Starter Kit

A comprehensive starter kit with multiple tech stacks and examples to get started with various development paradigms.

## 📦 What's Included

- **Node.js REST API** - Express.js server with TypeScript
- **Python CLI** - Command-line tool with Click framework
- **Go Microservice** - High-performance backend service
- **GitHub App** - Automation and integration example
- **Docker Support** - Containerization for all services
- **CI/CD** - GitHub Actions workflows

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+
- Go 1.21+

### Running with Docker Compose

```bash
docker-compose up
```

This will start all services:
- API: http://localhost:3000
- Go Service: http://localhost:8080
- Python CLI: Available in services/python/

## 📁 Project Structure

```
.
├── services/
│   ├── api/              # Node.js Express REST API
│   ├── python/           # Python CLI tool
│   └── go/               # Go microservice
├── github-app/           # GitHub App integration
├── docker-compose.yml    # Multi-service orchestration
├── .github/workflows/    # CI/CD pipelines
└── docs/                 # Documentation
```

## 🛠️ Development

See individual service READMEs for detailed setup:
- [API README](services/api/README.md)
- [Python README](services/python/README.md)
- [Go README](services/go/README.md)
- [GitHub App README](github-app/README.md)

## 📖 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 📝 License

MIT License - see LICENSE file for details
