/**
 * Modelo de Categoría (Category)
 * Representa una categoría para agrupar tareas
 */
export interface Category {
  // Identificador único de la categoría
  id: string;
  
  // Nombre de la categoría
  name: string;
  
  // Color de la categoría (en formato hexadecimal)
  color: string;
  
  // Icono de Ionicons (opcional)
  icon?: string;
}

/**
 * Colores predefinidos para categorías
 */
export const CATEGORY_COLORS = [
  '#3880ff', // Azul
  '#2dd36f', // Verde
  '#ffc409', // Amarillo
  '#eb445a', // Rojo
  '#5260ff', // Púrpura
  '#3dc2ff', // Cyan
  '#ff7f50', // Coral
  '#92949c', // Gris
];

/**
 * Iconos predefinidos para categorías
 */
export const CATEGORY_ICONS = [
  'folder-outline',
  'briefcase-outline',
  'home-outline',
  'cart-outline',
  'fitness-outline',
  'school-outline',
  'airplane-outline',
  'heart-outline',
  'star-outline',
  'flag-outline',
];

/**
 * Crea una nueva categoría con valores por defecto
 */
export function createCategory(name: string, color?: string): Category {
  return {
    id: generateId(),
    name: name,
    color: color || CATEGORY_COLORS[0],
    icon: 'folder-outline'
  };
}

/**
 * Genera un ID único simple
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
