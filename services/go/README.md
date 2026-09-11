# Go Microservice

High-performance microservice built with Go.

## Quick Start

### Local Development

```bash
go mod download
go run main.go
```

Service available at `http://localhost:8080`

### Building

```bash
go build -o go-service .
./go-service
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Service Info
```bash
GET /api/v1/info
```

### Process Data
```bash
POST /api/v1/process
Content-Type: application/json

{
  "data": "example",
  "value": 123
}
```

### Compute
```bash
GET /api/v1/compute/12345
```

## Testing

```bash
go test ./...
```

## Project Structure

```
services/go/
├── main.go         # Main application
├── go.mod          # Go module definition
├── Dockerfile      # Docker configuration
└── README.md       # This file
```

## Technologies

- **Go 1.21** - Programming language
- **Gorilla Mux** - Router
- **Standard Library** - HTTP server

## Performance

Go provides:
- ✅ Fast startup time
- ✅ Low memory footprint
- ✅ Efficient concurrency
- ✅ Easy deployment (single binary)
