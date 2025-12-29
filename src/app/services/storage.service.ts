import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, createTask } from '../models/task.model';


@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class StorageService {
  
  private readonly TASKS_KEY = 'todo_tasks';
  private readonly CATEGORIES_KEY = 'todo_categories';
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    try {
      const tasksJson = localStorage.getItem(this.TASKS_KEY);
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        // Convertir las fechas de string a Date
        tasks.forEach((task: Task) => {
          task.createdAt = new Date(task.createdAt);
          task.updatedAt = new Date(task.updatedAt);
        });
        this.tasksSubject.next(tasks);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      this.tasksSubject.next([]);
    }
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(title: string, categoryId?: string): Task {
    const newTask = createTask(title, categoryId);
    const tasks = [...this.getTasks(), newTask];
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks().map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...updates,
          updatedAt: new Date()
        };
      }
      return task;
    });
    this.saveTasks(tasks);
  }

  toggleTaskComplete(taskId: string): void {
    const tasks = this.getTasks().map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          updatedAt: new Date()
        };
      }
      return task;
    });
    this.saveTasks(tasks);
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(task => task.id !== taskId);
    this.saveTasks(tasks);
  }

  getTasksByCategory(categoryId: string | null): Task[] {
    const tasks = this.getTasks();
    if (!categoryId) {
      return tasks;
    }
    return tasks.filter(task => task.categoryId === categoryId);
  }

  countTasksByCategory(categoryId: string): number {
    return this.getTasks().filter(task => task.categoryId === categoryId).length;
  }

  getTaskStats(): { total: number; completed: number; pending: number } {
    const tasks = this.getTasks();
    const completed = tasks.filter(t => t.completed).length;
    return {
      total: tasks.length,
      completed: completed,
      pending: tasks.length - completed
    };
  }
}
