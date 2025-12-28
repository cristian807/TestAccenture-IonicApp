import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

/**
 * Componente principal de la aplicación
 * 
 * Este es el componente raíz que contiene:
 * - IonApp: Contenedor principal de Ionic
 * - IonRouterOutlet: Donde se renderizan las páginas
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet
  ],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  constructor() {
    // Aquí puedes inicializar servicios globales
    console.log('🚀 Todo App iniciada');
  }
}
