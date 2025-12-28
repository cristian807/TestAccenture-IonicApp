import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Bootstrap de la aplicación Angular/Ionic
bootstrapApplication(AppComponent, {
  providers: [
    // Estrategia de rutas de Ionic (para mantener el estado de las páginas)
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    // Proveedor de Ionic Angular
    provideIonicAngular(),
    
    // Proveedor del router con nuestras rutas
    provideRouter(routes),
  ],
});
