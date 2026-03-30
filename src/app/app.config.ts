import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // provideNativeDateAdapter(),
    provideNativeDateAdapter(),
    provideNativeDatetimeAdapter(),

    provideHttpClient(withInterceptors([authInterceptor])),

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: './i18n/',
          suffix: '.json',
        }),
      }),
    ),

    provideAppInitializer(() => {
      const translate = inject(TranslateService);

      const lang = localStorage.getItem('lang') || 'en';

      translate.setFallbackLang('en');
      translate.use(lang);
    }),
  ],
};
