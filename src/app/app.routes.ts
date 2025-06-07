import { Routes } from '@angular/router';
import { logoutActivateGuard } from './shared/guards/logout-activate.guard';

export const routes: Routes = [
  {
    path: 'restaurants',
    loadChildren: () => import('./restaurants/restaurants.routes').then(r => r.restaurantRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(r => r.restaurantRoutes)
  },
  {
    path: 'profile',
    loadChildren: () => import('./users/users.routes').then(r => r.userRoutes),
    canActivate: [ logoutActivateGuard],
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
