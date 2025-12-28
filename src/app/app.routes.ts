import { Routes } from '@angular/router';

/**
 * Configuración de rutas de la aplicación
 * 
 * Usamos Lazy Loading para cargar las páginas bajo demanda
 * Esto mejora el rendimiento de la carga inicial
 */
export const routes: Routes = [
  // Ruta por defecto - redirige a home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  // Página principal - Lista de tareas
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  
  // Página de categorías
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage)
  },
  
  // Página de configuración (para feature flags demo)
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  }
];
