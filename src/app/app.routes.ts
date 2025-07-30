import { Routes } from '@angular/router';
import { RegistroComponent } from './features/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'registro', loadComponent: () => import('./features/registro/registro.component').then(m => m.RegistroComponent) }
];
