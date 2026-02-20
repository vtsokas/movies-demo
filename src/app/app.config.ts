import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providePrimeNG } from 'primeng/config';

import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import { movieReducer } from './store/movie/movie.reducer';
import { MovieEffects } from './store/movie/movie.effects';
import { GenreEffects } from './store/genre/genre.effects';
import { genreReducer } from './store/genre/genre.reducer';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ movies: movieReducer, genres: genreReducer }),
    provideEffects([MovieEffects, GenreEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true // optional: prime icons ripple effect
    }),
    MessageService
  ]
};
