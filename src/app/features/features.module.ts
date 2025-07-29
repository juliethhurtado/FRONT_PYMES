import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,  // 👈 esto soluciona el error
    FormsModule  
  ],
  exports: [
    RegistroComponent // para que lo vea el AppModule si se importa ahí
  ]
})
export class FeaturesModule { }
