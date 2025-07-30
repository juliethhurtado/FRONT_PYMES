import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { EmpresaService } from '../core/services/empresa.service';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})
export class RegistroEmpresaComponent {
  empresa = {
    nombreEmpresa: '',
    responsable: '',
    cargo: '',
    correo: '',
    edad: null,
    genero: '',
    ciudad: '',
    departamento: '',
    numeroEmpleados: null,
    añosExperiencia: null
  };

  constructor(private empresaService: EmpresaService, private router: Router) {}

  registrarEmpresa() {
    this.empresaService.registrarEmpresa(this.empresa).subscribe({
      next: () => {
        alert('Empresa registrada con éxito');
        this.router.navigate(['/registro-exitoso']);
      },
      error: err => {
        alert('Error al registrar la empresa');
        console.error(err);
      }
    });
  }
}
