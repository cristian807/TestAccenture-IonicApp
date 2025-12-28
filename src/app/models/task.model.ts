/**
 * Modelo de Tarea (Task)
 * Representa una tarea en la lista de tareas
 */
export interface Task {
  // Identificador único de la tarea
  id: string;
  
  // Título o nombre de la tarea
  title: string;
  
  // Descripción opcional de la tarea
  description?: string;
  
  // Indica si la tarea está completada
  completed: boolean;
  
  // ID de la categoría asignada (opcional)
  categoryId?: string;
  
  // Fecha de creación
  createdAt: Date;
  
  // Fecha de última actualización
  updatedAt: Date;
}

/**
 * Crea una nueva tarea con valores por defecto
 */
export function createTask(title: string, categoryId?: string): Task {
  const now = new Date();
  return {
    id: generateId(),
    title: title,
    description: '',
    completed: false,
    categoryId: categoryId,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Genera un ID único simple
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
