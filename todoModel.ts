import { Todo, FilterType } from './types.js';

export class TodoManager {
  private todos: Todo[] = [];

  public getTodos(filter: FilterType = 'all'): Todo[] {
    switch (filter) {
      case 'active':
        return this.todos.filter((todo) => !todo.completed);
      case 'completed':
        return this.todos.filter((todo) => todo.completed);
      default:
        return this.todos;
    }
  }

  public addTodo(text: string): Todo {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  public toggleTodo(id: string): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      return todo;
    }
    return null;
  }

  public updateTodo(id: string, text: string): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.text = text;
      return todo;
    }
    return null;
  }

  public deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    return this.todos.length < initialLength;
  }

  public clearCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
  }

  public clearAll(): void {
    this.todos = [];
  }

  public getStats() {
    const total = this.todos.length;
    const active = this.todos.filter((t) => !t.completed).length;
    const completed = total - active;
    return { total, active, completed };
  }
}