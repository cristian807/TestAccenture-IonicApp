import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category, createCategory, CATEGORY_COLORS } from '../models/category.model';

/**
 * Servicio de Categorías
 * 
 * Este servicio maneja todas las operaciones con las categorías:
 * - Crear, editar, eliminar categorías
 * - Guardar y cargar desde localStorage
 */
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class CategoryService {
  
  // Clave para guardar en localStorage
  private readonly CATEGORIES_KEY = 'todo_categories';
  
  // BehaviorSubject para notificar cambios en las categorías
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  
  // Observable público para suscribirse a los cambios
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    // Al iniciar, cargar las categorías guardadas
    this.loadCategories();
  }

  /**
   * Carga las categorías desde localStorage
   */
  private loadCategories(): void {
    try {
      const categoriesJson = localStorage.getItem(this.CATEGORIES_KEY);
      if (categoriesJson) {
        const categories = JSON.parse(categoriesJson);
        this.categoriesSubject.next(categories);
      } else {
        // Crear categorías por defecto si no hay ninguna
        this.createDefaultCategories();
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.createDefaultCategories();
    }
  }

  /**
   * Crea categorías por defecto
   */
  private createDefaultCategories(): void {
    const defaultCategories: Category[] = [
      { id: 'cat1', name: 'Personal', color: CATEGORY_COLORS[0], icon: 'person-outline' },
      { id: 'cat2', name: 'Trabajo', color: CATEGORY_COLORS[1], icon: 'briefcase-outline' },
      { id: 'cat3', name: 'Compras', color: CATEGORY_COLORS[3], icon: 'cart-outline' },
    ];
    this.saveCategories(defaultCategories);
  }

  /**
   * Guarda las categorías en localStorage
   */
  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Error al guardar categorías:', error);
    }
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  /**
   * Obtiene una categoría por su ID
   * @param id - ID de la categoría
   */
  getCategoryById(id: string): Category | undefined {
    return this.getCategories().find(cat => cat.id === id);
  }

  /**
   * Agrega una nueva categoría
   * @param name - Nombre de la categoría
   * @param color - Color de la categoría
   */
  addCategory(name: string, color?: string): Category {
    const newCategory = createCategory(name, color);
    const categories = [...this.getCategories(), newCategory];
    this.saveCategories(categories);
    return newCategory;
  }

  /**
   * Actualiza una categoría existente
   * @param categoryId - ID de la categoría a actualizar
   * @param updates - Campos a actualizar
   */
  updateCategory(categoryId: string, updates: Partial<Category>): void {
    const categories = this.getCategories().map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          ...updates
        };
      }
      return category;
    });
    this.saveCategories(categories);
  }

  /**
   * Elimina una categoría
   * @param categoryId - ID de la categoría a eliminar
   */
  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter(cat => cat.id !== categoryId);
    this.saveCategories(categories);
  }
}
