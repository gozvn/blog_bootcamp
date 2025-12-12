import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

import {
  provideTranslateService,
  TranslateLoader,
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([JwtInterceptor])
    ),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),
    provideClientHydration(),

    // ⭐ Cấu hình TranslateService cho standalone Angular 18
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })
  ]
};
