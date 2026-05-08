import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { errorInterceptor } from './core/http/error.interceptor';
import { API_BASE_URL } from './core/tokens/api.tokens';
import { provideClientesInfrastructure } from './infrastructure/clientes/clientes.providers';

registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    ...provideClientesInfrastructure(),
  ],
};
