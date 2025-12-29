import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category, createCategory, CATEGORY_COLORS } from '../models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  private readonly CATEGORIES_KEY = 'todo_categories';
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategories();
  }


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

  private createDefaultCategories(): void {
    const defaultCategories: Category[] = [
      { id: 'cat1', name: 'Personal', color: CATEGORY_COLORS[0], icon: 'person-outline' },
      { id: 'cat2', name: 'Trabajo', color: CATEGORY_COLORS[1], icon: 'briefcase-outline' },
      { id: 'cat3', name: 'Compras', color: CATEGORY_COLORS[3], icon: 'cart-outline' },
    ];
    this.saveCategories(defaultCategories);
  }


  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Error al guardar categorías:', error);
    }
  }


  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getCategoryById(id: string): Category | undefined {
    return this.getCategories().find(cat => cat.id === id);
  }

  addCategory(name: string, color?: string): Category {
    const newCategory = createCategory(name, color);
    const categories = [...this.getCategories(), newCategory];
    this.saveCategories(categories);
    return newCategory;
  }

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

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter(cat => cat.id !== categoryId);
    this.saveCategories(categories);
  }
}
