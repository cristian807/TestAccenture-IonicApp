import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
  IonApp, 
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonSplitPane
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  folderOutline, 
  settingsOutline,
  menuOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    IonApp, 
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonSplitPane
  ],
  template: `
    <ion-app>
      <ion-menu contentId="main-content" type="overlay">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menú</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-menu-toggle auto-hide="false">
              <ion-item routerLink="/home" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
                <ion-icon name="home-outline" slot="start"></ion-icon>
                <ion-label>Inicio</ion-label>
              </ion-item>
            </ion-menu-toggle>
            
            <ion-menu-toggle auto-hide="false">
              <ion-item routerLink="/categories" routerLinkActive="active-link">
                <ion-icon name="folder-outline" slot="start"></ion-icon>
                <ion-label>Categorías</ion-label>
              </ion-item>
            </ion-menu-toggle>
            
            <ion-menu-toggle auto-hide="false">
              <ion-item routerLink="/settings" routerLinkActive="active-link">
                <ion-icon name="settings-outline" slot="start"></ion-icon>
                <ion-label>Configuración</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  styles: [`
    ion-menu ion-item {
      --padding-start: 16px;
      cursor: pointer;
    }
    
    ion-menu ion-item:hover {
      --background: var(--ion-color-light);
    }
    
    .active-link {
      --background: var(--ion-color-primary-tint);
      --color: var(--ion-color-primary);
      font-weight: 600;
    }
    
    .active-link ion-icon {
      color: var(--ion-color-primary);
    }
  `]
})
export class AppComponent {
  constructor() {
    addIcons({ homeOutline, folderOutline, settingsOutline, menuOutline });
    console.log('App iniciada');
  }
}
