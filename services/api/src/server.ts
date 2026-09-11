import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API version
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({ 
    version: '1.0.0',
    name: 'Copilot Starter Kit API',
    endpoints: [
      'GET /health',
      'GET /api/v1',
      'POST /api/v1/tasks',
      'GET /api/v1/tasks',
      'GET /api/v1/tasks/:id',
      'DELETE /api/v1/tasks/:id'
    ]
  });
});

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const tasks: Map<string, Task> = new Map();

// Create a new task
app.post('/api/v1/tasks', (req: Request, res: Response) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task: Task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tasks.set(task.id, task);
  res.status(201).json(task);
});

// Get all tasks
app.get('/api/v1/tasks', (req: Request, res: Response) => {
  const taskList = Array.from(tasks.values());
  res.json({ tasks: taskList, count: taskList.length });
});

// Get a specific task
app.get('/api/v1/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.get(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// Update a task
app.put('/api/v1/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.get(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (req.body.title) task.title = req.body.title;
  if (req.body.description) task.description = req.body.description;
  if (req.body.status) task.status = req.body.status;
  task.updatedAt = new Date();

  tasks.set(task.id, task);
  res.json(task);
});

// Delete a task
app.delete('/api/v1/tasks/:id', (req: Request, res: Response) => {
  const deleted = tasks.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`);
  console.log(`📚 API Docs available at http://localhost:${PORT}/api/v1`);
});

export default app;
