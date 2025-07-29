import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../core/services/empresa.service';
import { EmpresaRequest } from '../../core/models/empresa-request.model';
//import { EmpresaService } from 'src/app/core/services/empresa.service';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  empresaForm: FormGroup;
  preguntas: string[] = [
    '¿Tu empresa tiene una estrategia para usar tecnología moderna?',
    '¿Utilizan herramientas digitales para comunicarse internamente?',
    '¿Automatizan procesos como inventario o ventas?',
    '¿Tienen una página web o presencia digital activa?',
    '¿Usan herramientas para analizar datos?',
    '¿Realizan capacitaciones en tecnología?',
    '¿Tienen sistemas para atención al cliente (CRM, chat)?',
    '¿Usan tecnología en su logística o producción?',
    '¿La dirección apoya activamente la transformación digital?',
    '¿Evalúan tecnologías antes de invertir en ellas?',
    '¿Participan en redes o alianzas tecnológicas?',
    '¿Miden el impacto de la tecnología en su negocio?'
  ];

  enviado = false;
  mensajeFinal = '';

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService
  ) {
    this.empresaForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      responsable: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreParticipante: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      genero: ['', Validators.required],
      ubicacion: ['', Validators.required],
      numeroEmpleados: [null, [Validators.required, Validators.min(1)]],
      aniosExperiencia: [null, [Validators.required, Validators.min(0)]],
      consentimiento: [false, Validators.requiredTrue],

    respuestas: this.fb.array(Array(12).fill(3))  // 12 preguntas con valor inicial 3
}); 
  }

  get respuestas() {
    return this.empresaForm.get('respuestas')?.value;
  }

  cambiarRespuesta(index: number, valor: number) {
    this.empresaForm.value.respuestas[index] = valor;
  }

  onSubmit() {
  if (this.empresaForm.invalid) {
    this.empresaForm.markAllAsTouched();
    return;
  }

  const formData: EmpresaRequest = this.empresaForm.value;

  this.empresaService.registrarEmpresa(formData).subscribe({
    next: (mensaje: string) => {
      console.log(mensaje);
      this.enviado = true;
      this.mensajeFinal = mensaje;
    },
    error: (err) => {
      alert('Ocurrió un error al registrar la empresa.');
      console.error(err);
    }
  });
}
}
