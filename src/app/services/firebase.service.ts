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

export interface FeatureFlags {
  enable_categories: boolean;
  enable_dark_mode: boolean;
  max_tasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  private app: FirebaseApp | null = null;
  
  private remoteConfig: RemoteConfig | null = null;
  
  private defaultFlags: FeatureFlags = {
    enable_categories: remoteConfigDefaults.enable_categories,
    enable_dark_mode: remoteConfigDefaults.enable_dark_mode,
    max_tasks: remoteConfigDefaults.max_tasks
  };
  
  private flagsSubject = new BehaviorSubject<FeatureFlags>(this.defaultFlags);
  
  public flags$ = this.flagsSubject.asObservable();
  
  private initialized = false;
  
  private readonly FLAGS_KEY = 'firebase_remote_config_cache';

  constructor() {
    this.initializeFirebase();
  }


  private async initializeFirebase(): Promise<void> {
    try {
      if (this.isCredentialsConfigured()) {
        console.log('Inicializando Firebase...');
        
        this.app = initializeApp(firebaseConfig);
        
        this.remoteConfig = getRemoteConfig(this.app);
        
        this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
        
        this.remoteConfig.defaultConfig = {
          enable_categories: String(this.defaultFlags.enable_categories),
          enable_dark_mode: String(this.defaultFlags.enable_dark_mode),
          max_tasks: String(this.defaultFlags.max_tasks)
        };
        
        await this.fetchRemoteConfig();
        
        this.initialized = true;
        console.log('Firebase inicializado correctamente');
      } else {
        console.warn('Credenciales de Firebase no configuradas. Usando modo local.');
        this.loadLocalFlags();
      }
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      this.loadLocalFlags();
    }
  }


  private isCredentialsConfigured(): boolean {
    return firebaseConfig.apiKey !== 'PEGA_AQUI_TU_API_KEY' && 
           firebaseConfig.apiKey !== '' &&
           firebaseConfig.projectId !== 'PEGA_AQUI_TU_PROJECT_ID';
  }


  private async fetchRemoteConfig(): Promise<void> {
    if (!this.remoteConfig) return;
    
    try {
      console.log('Obteniendo configuración remota...');

      const activated = await fetchAndActivate(this.remoteConfig);
      
      if (activated) {
        console.log('Configuración remota activada');
      } else {
        console.log('Usando configuración en caché');
      }

      const flags: FeatureFlags = {
        enable_categories: getBoolean(this.remoteConfig, 'enable_categories'),
        enable_dark_mode: getBoolean(this.remoteConfig, 'enable_dark_mode'),
        max_tasks: getNumber(this.remoteConfig, 'max_tasks') || this.defaultFlags.max_tasks
      };
      
      this.flagsSubject.next(flags);

      this.saveLocalFlags(flags);
      
      console.log('Feature flags cargados:', flags);
      
    } catch (error) {
      console.error('Error al obtener configuración remota:', error);
      this.loadLocalFlags();
    }
  }


  private loadLocalFlags(): void {
    try {
      const cached = localStorage.getItem(this.FLAGS_KEY);
      if (cached) {
        const flags = JSON.parse(cached);
        this.flagsSubject.next({ ...this.defaultFlags, ...flags });
        console.log('Flags cargados desde caché local');
      } else {
        this.flagsSubject.next(this.defaultFlags);
        console.log('Usando flags por defecto');
      }
    } catch (error) {
      this.flagsSubject.next(this.defaultFlags);
    }
  }


  private saveLocalFlags(flags: FeatureFlags): void {
    try {
      localStorage.setItem(this.FLAGS_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error al guardar en caché:', error);
    }
  }


  async refreshConfig(): Promise<void> {
    if (this.remoteConfig) {
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
      await this.fetchRemoteConfig();
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    }
  }

  getFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
    return this.flagsSubject.getValue()[key];
  }


  getAllFlags(): FeatureFlags {
    return this.flagsSubject.getValue();
  }

  setFlag<K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void {
    const currentFlags = this.flagsSubject.getValue();
    const newFlags = { ...currentFlags, [key]: value };
    this.saveLocalFlags(newFlags);
    this.flagsSubject.next(newFlags);
  }


  isCategoriesEnabled(): boolean {
    return this.getFlag('enable_categories');
  }


  isDarkModeEnabled(): boolean {
    return this.getFlag('enable_dark_mode');
  }


  getMaxTasks(): number {
    return this.getFlag('max_tasks');
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
