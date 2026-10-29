import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { TodoManager } from './todoModel.js';
import { FilterType } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const todoManager = new TodoManager();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get all todos
app.get('/api/todos', (req: Request, res: Response) => {
  const filter = (req.query.filter as FilterType) || 'all';
  const todos = todoManager.getTodos(filter);
  const stats = todoManager.getStats();
  res.json({ todos, stats });
});

// Create a new todo
app.post('/api/todos', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Todo text is required.' });
  }
  const newTodo = todoManager.addTodo(text.trim());
  res.status(201).json(newTodo);
});

// Toggle todo status
app.patch('/api/todos/:id/toggle', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = todoManager.toggleTodo(id);
  if (!updated) return res.status(404).json({ error: 'Todo not found.' });
  res.json(updated);
});

// Edit todo text
app.put('/api/todos/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text cannot be empty.' });
  }
  const updated = todoManager.updateTodo(id, text.trim());
  if (!updated) return res.status(404).json({ error: 'Todo not found.' });
  res.json(updated);
});

// Delete single todo
app.delete('/api/todos/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deleted = todoManager.deleteTodo(id);
  if (!deleted) return res.status(404).json({ error: 'Todo not found.' });
  res.json({ success: true });
});

// Clear completed todos
app.delete('/api/todos/actions/clear-completed', (_req: Request, res: Response) => {
  todoManager.clearCompleted();
  res.json({ success: true });
});

// Clear all todos
app.delete('/api/todos/actions/clear-all', (_req: Request, res: Response) => {
  todoManager.clearAll();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});