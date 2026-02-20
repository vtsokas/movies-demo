import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'cards', pathMatch: 'full' },
    { path: 'cards', loadComponent: () => import('./pages/card-page/card-page').then(m => m.CardPage) },
    { path: 'details/:id', loadComponent: () => import('./pages/details-page/details-page').then(m => m.DetailsPage) },
    { path: 'favourites', loadComponent: () => import('./pages/favourites-page/favourites-page').then(m => m.FavouritesPage) },
    { path: '**', redirectTo: 'cards' },
];
