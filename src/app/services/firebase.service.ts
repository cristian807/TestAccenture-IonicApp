import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Configuración de Firebase Remote Config
 * 
 * Este servicio simula Firebase Remote Config para demostrar
 * cómo funcionan los feature flags.
 * 
 * En una implementación real, deberías:
 * 1. Instalar: npm install firebase
 * 2. Configurar con tus credenciales de Firebase
 * 3. Usar el SDK real de Remote Config
 */

// Interfaz para los feature flags
export interface FeatureFlags {
  enable_categories: boolean;    // Habilitar/deshabilitar categorías
  enable_dark_mode: boolean;     // Habilitar/deshabilitar modo oscuro
  max_tasks: number;             // Número máximo de tareas permitidas
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  // Valores por defecto de los feature flags
  private defaultFlags: FeatureFlags = {
    enable_categories: true,
    enable_dark_mode: false,
    max_tasks: 100
  };
  
  // BehaviorSubject para notificar cambios en los flags
  private flagsSubject = new BehaviorSubject<FeatureFlags>(this.defaultFlags);
  
  // Observable público
  public flags$ = this.flagsSubject.asObservable();
  
  // Clave para simular Remote Config en localStorage
  private readonly FLAGS_KEY = 'firebase_remote_config';

  constructor() {
    this.loadFlags();
  }

  /**
   * Carga los flags desde localStorage (simulando Remote Config)
   */
  private loadFlags(): void {
    try {
      const flagsJson = localStorage.getItem(this.FLAGS_KEY);
      if (flagsJson) {
        const flags = JSON.parse(flagsJson);
        this.flagsSubject.next({ ...this.defaultFlags, ...flags });
      } else {
        // Guardar valores por defecto
        localStorage.setItem(this.FLAGS_KEY, JSON.stringify(this.defaultFlags));
      }
    } catch (error) {
      console.error('Error al cargar feature flags:', error);
    }
  }

  /**
   * Obtiene el valor de un feature flag
   * @param key - Nombre del flag
   */
  getFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
    return this.flagsSubject.getValue()[key];
  }

  /**
   * Obtiene todos los feature flags
   */
  getAllFlags(): FeatureFlags {
    return this.flagsSubject.getValue();
  }

  /**
   * Actualiza un feature flag (para demostración)
   * En producción, esto se haría desde Firebase Console
   */
  setFlag<K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void {
    const currentFlags = this.flagsSubject.getValue();
    const newFlags = { ...currentFlags, [key]: value };
    localStorage.setItem(this.FLAGS_KEY, JSON.stringify(newFlags));
    this.flagsSubject.next(newFlags);
  }

  /**
   * Verifica si las categorías están habilitadas
   */
  isCategoriesEnabled(): boolean {
    return this.getFlag('enable_categories');
  }

  /**
   * Verifica si el modo oscuro está habilitado
   */
  isDarkModeEnabled(): boolean {
    return this.getFlag('enable_dark_mode');
  }

  /**
   * Obtiene el número máximo de tareas permitidas
   */
  getMaxTasks(): number {
    return this.getFlag('max_tasks');
  }
}

/* 
 * ============================================
 * NOTA: IMPLEMENTACIÓN REAL CON FIREBASE
 * ============================================
 * 
 * Para usar Firebase Remote Config real:
 * 
 * 1. Instalar Firebase:
 *    npm install firebase
 * 
 * 2. Configurar en src/environments/environment.ts:
 *    export const environment = {
 *      production: false,
 *      firebase: {
 *        apiKey: "tu-api-key",
 *        authDomain: "tu-proyecto.firebaseapp.com",
 *        projectId: "tu-proyecto",
 *        storageBucket: "tu-proyecto.appspot.com",
 *        messagingSenderId: "123456789",
 *        appId: "1:123456789:web:abcdef"
 *      }
 *    };
 * 
 * 3. Inicializar Firebase en el servicio:
 *    import { initializeApp } from 'firebase/app';
 *    import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
 *    
 *    const app = initializeApp(environment.firebase);
 *    const remoteConfig = getRemoteConfig(app);
 *    
 *    // Configurar tiempo mínimo de fetch
 *    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
 *    
 *    // Fetch y activar
 *    await fetchAndActivate(remoteConfig);
 *    
 *    // Obtener valores
 *    const enableCategories = getValue(remoteConfig, 'enable_categories').asBoolean();
 */
