# Node.js REST API

Express.js REST API starter with TypeScript.

## Quick Start

### Development

```bash
npm install
npm run dev
```

API available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Tasks API

**Create Task**
```bash
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "My Task",
  "description": "Task description"
}
```

**List Tasks**
```bash
GET /api/v1/tasks
```

**Get Task**
```bash
GET /api/v1/tasks/:id
```

**Update Task**
```bash
PUT /api/v1/tasks/:id
Content-Type: application/json

{
  "status": "completed"
}
```

**Delete Task**
```bash
DELETE /api/v1/tasks/:id
```

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── server.ts      # Main application file
├── routes/        # API route handlers
├── models/        # Data models
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **ts-node-dev** - Development server
- **Jest** - Testing framework
