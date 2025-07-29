import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../core/services/empresa.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.ts',
})
export class InicioComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empresaService: EmpresaService
  ) {
    this.form = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      responsable: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  continuar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.empresaService.registrarEmpresa(this.form.value).subscribe(() => {
  this.router.navigate(['/cuestionario']);
});
}
}
