import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { RegistroExitosoComponent } from './features/registro-exitoso/registro-exitoso.component';
import { RegistroComponent } from './features/registro/registro.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    RegistroExitosoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

