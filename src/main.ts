import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';

// 👇 Toastr
import { provideToastr } from 'ngx-toastr';

// 👇 Importa y registra el locale de México
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMX, 'es-MX');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

    // 👇 Forzamos el locale para toda la app
    { provide: LOCALE_ID, useValue: 'es-MX' },

    // 👇 Toastr global config
    provideToastr({
      positionClass: 'toast-top-right', 
      timeOut: 2500,
      closeButton: true,
      progressBar: true,
    }),
  ],
}).catch((err) => console.error(err));
