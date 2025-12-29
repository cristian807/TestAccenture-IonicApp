import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonNote,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  settingsOutline, 
  toggleOutline,
  cloudOutline,
  informationCircleOutline,
  menuOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { FirebaseService, FeatureFlags } from '../../services/firebase.service';

/**
 * Página de Configuración
 * 
 * Esta página demuestra el funcionamiento de Firebase Remote Config
 * permitiendo activar/desactivar feature flags.
 * 
 * En producción, estos valores se cambiarían desde Firebase Console,
 * pero aquí se pueden modificar para demostración.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonNote,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {
  
  // Feature flags actuales
  flags: FeatureFlags = {
    enable_categories: true,
    enable_dark_mode: false,
    max_tasks: 100
  };
  
  // Suscripción
  private subscription?: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {
    addIcons({ 
      settingsOutline, 
      toggleOutline,
      cloudOutline,
      informationCircleOutline,
      menuOutline
    });
  }

  ngOnInit(): void {
    // Cargar los flags actuales
    this.subscription = this.firebaseService.flags$.subscribe(flags => {
      this.flags = { ...flags };
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Cambia el flag de categorías
   */
  async toggleCategories(): Promise<void> {
    this.firebaseService.setFlag('enable_categories', this.flags.enable_categories);
    await this.showToast(
      this.flags.enable_categories 
        ? 'Categorías habilitadas' 
        : 'Categorías deshabilitadas'
    );
  }

  /**
   * Cambia el flag de modo oscuro
   */
  async toggleDarkMode(): Promise<void> {
    this.firebaseService.setFlag('enable_dark_mode', this.flags.enable_dark_mode);
    
    // Aplicar el modo oscuro
    document.body.classList.toggle('dark', this.flags.enable_dark_mode);
    
    await this.showToast(
      this.flags.enable_dark_mode 
        ? 'Modo oscuro activado' 
        : 'Modo oscuro desactivado'
    );
  }

  /**
   * Actualiza el máximo de tareas
   */
  async updateMaxTasks(): Promise<void> {
    if (this.flags.max_tasks < 1) {
      this.flags.max_tasks = 1;
    }
    if (this.flags.max_tasks > 1000) {
      this.flags.max_tasks = 1000;
    }
    
    this.firebaseService.setFlag('max_tasks', this.flags.max_tasks);
    await this.showToast(`Máximo de tareas: ${this.flags.max_tasks}`);
  }

  /**
   * Muestra un toast
   */
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
