import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, createTask } from '../models/task.model';

/**
 * Servicio de Almacenamiento de Tareas
 * 
 * Este servicio maneja todas las operaciones con las tareas:
 * - Guardar en localStorage
 * - Cargar tareas
 * - Agregar, editar, eliminar tareas
 */
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class StorageService {
  
  // Clave para guardar en localStorage
  private readonly TASKS_KEY = 'todo_tasks';
  private readonly CATEGORIES_KEY = 'todo_categories';
  
  // BehaviorSubject para notificar cambios en las tareas
  // Esto permite que los componentes se actualicen automáticamente
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  // Observable público para suscribirse a los cambios
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    // Al iniciar, cargar las tareas guardadas
    this.loadTasks();
  }

  /**
   * Carga las tareas desde localStorage
   */
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

  /**
   * Guarda las tareas en localStorage
   */
  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }

  /**
   * Obtiene todas las tareas
   */
  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  /**
   * Agrega una nueva tarea
   * @param title - Título de la tarea
   * @param categoryId - ID de la categoría (opcional)
   */
  addTask(title: string, categoryId?: string): Task {
    const newTask = createTask(title, categoryId);
    const tasks = [...this.getTasks(), newTask];
    this.saveTasks(tasks);
    return newTask;
  }

  /**
   * Actualiza una tarea existente
   * @param taskId - ID de la tarea a actualizar
   * @param updates - Campos a actualizar
   */
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

  /**
   * Cambia el estado de completado de una tarea
   * @param taskId - ID de la tarea
   */
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

  /**
   * Elimina una tarea
   * @param taskId - ID de la tarea a eliminar
   */
  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(task => task.id !== taskId);
    this.saveTasks(tasks);
  }

  /**
   * Obtiene tareas filtradas por categoría
   * @param categoryId - ID de la categoría (null para todas)
   */
  getTasksByCategory(categoryId: string | null): Task[] {
    const tasks = this.getTasks();
    if (!categoryId) {
      return tasks;
    }
    return tasks.filter(task => task.categoryId === categoryId);
  }

  /**
   * Cuenta las tareas por categoría
   * @param categoryId - ID de la categoría
   */
  countTasksByCategory(categoryId: string): number {
    return this.getTasks().filter(task => task.categoryId === categoryId).length;
  }

  /**
   * Obtiene estadísticas de las tareas
   */
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
