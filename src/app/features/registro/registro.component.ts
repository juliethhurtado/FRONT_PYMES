import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../core/services/empresa.service';
import { EmpresaRequest } from '../../core/models/empresa-request.model';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  pasoActual = 1;
  empresaForm: FormGroup;
  cuestionarioForm: FormGroup;

  enviado = false;
  mensajeFinal = '';
  mostrarResultado = false;

  porcentajeObtenido = 0;
  nivelMensaje = '';
  correoGuardado = '';

  preguntas: string[] = [
    '¿La empresa tiene una estrategia formal de transformación digital?',
    '¿La estrategia digital está alineada con los objetivos generales del negocio?',
    '¿Los líderes promueven activamente la transformación digital?',
    '¿Existen responsables asignados para liderar la transformación digital?',
    '¿La empresa utiliza tecnologías como IoT, Big Data o Inteligencia Artificial?',
    '¿Se ha invertido recientemente en tecnologías digitales?',
    '¿Los procesos están automatizados mediante tecnologías digitales?',
    '¿Existe integración entre las tecnologías utilizadas?',
    '¿Tu personal tiene formación en herramientas digitales?',
    '¿Se capacita al personal en transformación digital?',
    '¿Se promueve la participación del personal en procesos de innovación digital?',
    '¿Se valora la innovación por parte de los trabajadores?',
    '¿La empresa documenta los aprendizajes digitales?',
    '¿Existen espacios para compartir buenas prácticas tecnológicas?',
    '¿El conocimiento digital se transfiere a nuevos empleados?',
    '¿Se registran errores y lecciones aprendidas en proyectos digitales?',
    '¿Existe apertura al cambio y disposición hacia lo digital?',
    '¿La innovación es parte del ADN de la organización?',
    '¿La empresa mide su nivel de transformación digital?',
    '¿La transformación digital está alineada con el modelo de negocio?',
    '¿Diferentes niveles de la empresa participan en la transformación digital?',
    '¿Existen canales formales para sugerencias sobre tecnología?'
  ];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Respuestas' }]
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };

barChartType: ChartType = 'bar';
pieChartType: ChartType = 'pie';

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          callback: function (val: any) {
            const label = this.getLabelForValue(val);
            return label.length > 25 ? label.match(/.{1,25}/g) : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  puntajeTotal: any;

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
      ciudad: ['', Validators.required],
      numEmpleados: [null, [Validators.required, Validators.min(1)]],
      experiencia: [null, [Validators.required, Validators.min(0)]],
      aceptoParticipar: [false, Validators.requiredTrue]
    });

    this.cuestionarioForm = this.fb.group({
      respuestas: this.fb.array(this.preguntas.map(() => this.fb.control(3)))
    });
  }

  get respuestas(): FormArray {
    return this.cuestionarioForm.get('respuestas') as FormArray;
  }

  getControl(i: number): FormControl {
    return this.respuestas.at(i) as FormControl;
  }

  continuarCuestionario() {
    if (this.empresaForm.valid) {
      this.pasoActual = 2;
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  enviarTodo() {
    if (this.cuestionarioForm.invalid) {
      this.cuestionarioForm.markAllAsTouched();
      return;
    }

    const formData: EmpresaRequest = {
      ...this.empresaForm.value,
      respuestas: this.respuestas.value
    };

    this.empresaService.registrarEmpresa(formData).subscribe({
      next: () => {
        const suma = this.respuestas.value.reduce((acc: number, val: number) => acc + val, 0);
        this.porcentajeObtenido = Math.round((suma / (this.preguntas.length * 5)) * 100);
        this.nivelMensaje = this.obtenerMensajePorNivel(this.porcentajeObtenido);
        this.correoGuardado = this.empresaForm.get('correo')?.value || '';

        this.barChartData.labels = this.preguntas;
        this.barChartData.datasets[0].data = this.respuestas.value;

        this.pieChartData.labels = [
          'Nivel 1 (0-20%)',
          'Nivel 2 (21-40%)',
          'Nivel 3 (41-60%)',
          'Nivel 4 (61-80%)',
          'Nivel 5 (81-100%)'
        ];
        this.pieChartData.datasets[0].data = [
          +(this.porcentajeObtenido <= 20),
          +(this.porcentajeObtenido > 20 && this.porcentajeObtenido <= 40),
          +(this.porcentajeObtenido > 40 && this.porcentajeObtenido <= 60),
          +(this.porcentajeObtenido > 60 && this.porcentajeObtenido <= 80),
          +(this.porcentajeObtenido > 80)
        ];

        this.chart?.update();
        this.mostrarResultado = true;
      },
      error: (err) => {
        alert('Error al registrar empresa');
        console.error(err);
      }
    });
  }

  obtenerMensajePorNivel(puntaje: number): string {
    if (puntaje <= 20) return 'Estás en Nivel 1 - Inicial';
    if (puntaje <= 40) return 'Estás en Nivel 2 - Exploratorio';
    if (puntaje <= 60) return 'Estás en Nivel 3 - En transición';
    if (puntaje <= 80) return 'Estás en Nivel 4 - Integrado';
    return 'Estás en Nivel 5 - Avanzado / Transformador';
  }

enviarResultadoPorCorreo(): void {
  const datos = {
    correo: this.empresaForm.get('correo')?.value,
    nombreParticipante: this.empresaForm.get('nombreParticipante')?.value,
    nombreEmpresa: this.empresaForm.get('nombreEmpresa')?.value,
    puntaje: this.puntajeTotal,
    nivel: this.nivelMensaje,
    respuestas: this.cuestionarioForm.value.respuestas,
    mensaje: `Resultados de evaluación para ${this.empresaForm.get('nombreEmpresa')?.value}`
  };

  this.empresaService.enviarResultadosPorCorreo(datos).subscribe(
() => {
      alert('Resultados enviados correctamente al correo.');
    },
    (    error: any) => {
      console.error('Error al enviar resultados:', error);
      alert('Ocurrió un error al enviar el correo.');
    }
  );
}


  reiniciar(): void {
    this.pasoActual = 1;
    this.mostrarResultado = false;
    this.nivelMensaje = '';
    this.empresaForm.reset();
    this.cuestionarioForm.reset();
  }
}
