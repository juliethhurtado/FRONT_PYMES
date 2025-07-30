import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './features/registro/registro.component';
import { RegistroExitosoComponent } from './features/registro-exitoso/registro-exitoso.component'; // ← importa el nuevo componente

const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'registro', component: RegistroComponent },
  { path: 'registro-exitoso', component: RegistroExitosoComponent } // ← nueva ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

