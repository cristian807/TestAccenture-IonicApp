import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getRemoteConfig, 
  RemoteConfig,
  fetchAndActivate, 
  getBoolean,
  getNumber
} from 'firebase/remote-config';
import { firebaseConfig, remoteConfigDefaults } from '../config/firebase.credentials';

/**
 * ============================================
 * 🔥 SERVICIO DE FIREBASE REMOTE CONFIG
 * ============================================
 * 
 * Este servicio conecta con Firebase Remote Config real
 * para manejar feature flags desde la consola de Firebase.
 * 
 * CONFIGURACIÓN:
 * 1. Agrega tus credenciales en: src/app/config/firebase.credentials.ts
 * 2. En Firebase Console, ve a Remote Config
 * 3. Crea los parámetros: enable_categories, enable_dark_mode, max_tasks
 */

// Interfaz para los feature flags
export interface FeatureFlags {
  enable_categories: boolean;
  enable_dark_mode: boolean;
  max_tasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  // Instancia de Firebase App
  private app: FirebaseApp | null = null;
  
  // Instancia de Remote Config
  private remoteConfig: RemoteConfig | null = null;
  
  // Valores por defecto de los feature flags
  private defaultFlags: FeatureFlags = {
    enable_categories: remoteConfigDefaults.enable_categories,
    enable_dark_mode: remoteConfigDefaults.enable_dark_mode,
    max_tasks: remoteConfigDefaults.max_tasks
  };
  
  // BehaviorSubject para notificar cambios en los flags
  private flagsSubject = new BehaviorSubject<FeatureFlags>(this.defaultFlags);
  
  // Observable público para suscribirse a los cambios
  public flags$ = this.flagsSubject.asObservable();
  
  // Estado de inicialización
  private initialized = false;
  
  // Clave para cache local
  private readonly FLAGS_KEY = 'firebase_remote_config_cache';

  constructor() {
    this.initializeFirebase();
  }

  /**
   * Inicializa Firebase y Remote Config
   */
  private async initializeFirebase(): Promise<void> {
    try {
      // Verificar si las credenciales están configuradas
      if (this.isCredentialsConfigured()) {
        console.log('🔥 Inicializando Firebase...');
        
        // Inicializar Firebase App
        this.app = initializeApp(firebaseConfig);
        
        // Inicializar Remote Config
        this.remoteConfig = getRemoteConfig(this.app);
        
        // Configurar tiempo mínimo de fetch (1 hora en producción, 0 en desarrollo)
        this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
        
        // Establecer valores por defecto
        this.remoteConfig.defaultConfig = {
          enable_categories: String(this.defaultFlags.enable_categories),
          enable_dark_mode: String(this.defaultFlags.enable_dark_mode),
          max_tasks: String(this.defaultFlags.max_tasks)
        };
        
        // Fetch y activar configuración remota
        await this.fetchRemoteConfig();
        
        this.initialized = true;
        console.log('✅ Firebase inicializado correctamente');
      } else {
        console.warn('⚠️ Credenciales de Firebase no configuradas. Usando modo local.');
        this.loadLocalFlags();
      }
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error);
      this.loadLocalFlags();
    }
  }

  /**
   * Verifica si las credenciales están configuradas
   */
  private isCredentialsConfigured(): boolean {
    return firebaseConfig.apiKey !== 'PEGA_AQUI_TU_API_KEY' && 
           firebaseConfig.apiKey !== '' &&
           firebaseConfig.projectId !== 'PEGA_AQUI_TU_PROJECT_ID';
  }

  /**
   * Fetch y activa la configuración remota de Firebase
   */
  private async fetchRemoteConfig(): Promise<void> {
    if (!this.remoteConfig) return;
    
    try {
      console.log('📡 Obteniendo configuración remota...');
      
      // Fetch y activar
      const activated = await fetchAndActivate(this.remoteConfig);
      
      if (activated) {
        console.log('✅ Configuración remota activada');
      } else {
        console.log('ℹ️ Usando configuración en caché');
      }
      
      // Obtener valores
      const flags: FeatureFlags = {
        enable_categories: getBoolean(this.remoteConfig, 'enable_categories'),
        enable_dark_mode: getBoolean(this.remoteConfig, 'enable_dark_mode'),
        max_tasks: getNumber(this.remoteConfig, 'max_tasks') || this.defaultFlags.max_tasks
      };
      
      // Actualizar el BehaviorSubject
      this.flagsSubject.next(flags);
      
      // Guardar en cache local
      this.saveLocalFlags(flags);
      
      console.log('🎯 Feature flags cargados:', flags);
      
    } catch (error) {
      console.error('❌ Error al obtener configuración remota:', error);
      this.loadLocalFlags();
    }
  }

  /**
   * Carga los flags desde cache local (fallback)
   */
  private loadLocalFlags(): void {
    try {
      const cached = localStorage.getItem(this.FLAGS_KEY);
      if (cached) {
        const flags = JSON.parse(cached);
        this.flagsSubject.next({ ...this.defaultFlags, ...flags });
        console.log('📦 Flags cargados desde caché local');
      } else {
        this.flagsSubject.next(this.defaultFlags);
        console.log('📦 Usando flags por defecto');
      }
    } catch (error) {
      this.flagsSubject.next(this.defaultFlags);
    }
  }

  /**
   * Guarda los flags en cache local
   */
  private saveLocalFlags(flags: FeatureFlags): void {
    try {
      localStorage.setItem(this.FLAGS_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error al guardar en caché:', error);
    }
  }

  /**
   * Fuerza una actualización de la configuración remota
   */
  async refreshConfig(): Promise<void> {
    if (this.remoteConfig) {
      // Temporalmente reducir el intervalo para forzar fetch
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
      await this.fetchRemoteConfig();
      // Restaurar intervalo
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    }
  }

  /**
   * Obtiene el valor de un feature flag
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
   * Actualiza un feature flag localmente
   * (Para pruebas - en producción se hace desde Firebase Console)
   */
  setFlag<K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void {
    const currentFlags = this.flagsSubject.getValue();
    const newFlags = { ...currentFlags, [key]: value };
    this.saveLocalFlags(newFlags);
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

  /**
   * Verifica si Firebase está inicializado
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}
