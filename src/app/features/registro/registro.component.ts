import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../core/services/empresa.service';
import { EmpresaRequest } from '../../core/models/empresa-request.model';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  mostrarManual: boolean = true;
  pasoActual: number = 0;

  empresaForm: FormGroup;
  cuestionarioForm: FormGroup;

  enviado = false;
  mensajeFinal = '';
  mostrarResultado = false;

  porcentajeObtenido = 0;
  puntajeTotal: number = 0;
  nivelMensaje = '';
  nivelMensajeDetalle = '';
  nivelNombre = '';
  correoGuardado = '';

  bloqueActual: number = 0;

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
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return this.preguntas[index];
          },
          label: (tooltipItem) => `Respuesta: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          callback: function (val: any) {
            return Number(val) + 1;
          }
        },
        title: {
          display: true,
          text: 'Pregunta'
        }
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: {
          display: true,
          text: 'Valor (1 a 5)'
        }
      }
    }
  };

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

  get nivelMadurez(): number {
    return Math.ceil(this.porcentajeObtenido / 20);
  }

  iniciarRegistro(): void {
    this.mostrarManual = false;
    this.pasoActual = 1;
  }

  continuarCuestionario(): void {
    if (this.empresaForm.valid) {
      this.pasoActual = 2;
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  get totalBloques(): number {
    return Math.ceil(this.preguntas.length / 4);
  }

  preguntasPorBloque(): number[] {
    const inicio = this.bloqueActual * 4;
    const fin = inicio + 4;
    return Array.from({ length: this.preguntas.length }, (_, i) => i).slice(inicio, fin);
  }

  siguienteBloque(): void {
    if (this.validarBloqueActual()) {
      this.bloqueActual++;
    }
  }

  anteriorBloque(): void {
    if (this.bloqueActual > 0) {
      this.bloqueActual--;
    }
  }

  validarBloqueActual(): boolean {
    let valido = true;
    for (let i of this.preguntasPorBloque()) {
      const control = this.getControl(i);
      if (control.invalid) {
        control.markAsTouched();
        valido = false;
      }
    }
    return valido;
  }

  finalizarCuestionario(): void {
    if (!this.validarBloqueActual()) return;

    const formData: EmpresaRequest = {
      ...this.empresaForm.value,
      respuestas: this.respuestas.value
    };

    this.empresaService.registrarEmpresa(formData).subscribe({
      next: () => {
        const suma = this.respuestas.value.reduce((acc: number, val: number) => acc + val, 0);
        this.puntajeTotal = Math.round((suma / (this.preguntas.length * 5)) * 100);
        this.porcentajeObtenido = this.puntajeTotal;
        this.nivelMensaje = this.obtenerMensajePorNivel(this.porcentajeObtenido);
        this.nivelMensajeDetalle = this.obtenerMensajeDetallePorNivel(this.porcentajeObtenido);
        this.nivelNombre = this.obtenerNombrePorNivel(this.porcentajeObtenido);
        this.correoGuardado = this.empresaForm.get('correo')?.value || '';

        this.barChartData.labels = this.preguntas.map((_, i) => `${i + 1}`);
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
        this.pieChartData.datasets[0].backgroundColor = [
  '#f99ca8', // Nivel 1
  '#86c5f4', // Nivel 2
  '#ffe08c', // Nivel 3
  '#6699cc', // Nivel 4 (cambiado de gris a azul)
  '#91e0d9'  // Nivel 5
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

  obtenerNombrePorNivel(puntaje: number): string {
    if (puntaje <= 20) return 'Inicial';
    if (puntaje <= 40) return 'Exploratorio';
    if (puntaje <= 60) return 'En transición';
    if (puntaje <= 80) return 'Integrado';
    return 'Avanzado / Transformador';
  }

  obtenerMensajePorNivel(puntaje: number): string {
    if (puntaje <= 20) return 'Estás en Nivel 1 - Inicial';
    if (puntaje <= 40) return 'Estás en Nivel 2 - Exploratorio';
    if (puntaje <= 60) return 'Estás en Nivel 3 - En transición';
    if (puntaje <= 80) return 'Estás en Nivel 4 - Integrado';
    return 'Estás en Nivel 5 - Avanzado / Transformador';
  }

  obtenerMensajeDetallePorNivel(puntaje: number): string {
    if (puntaje <= 20) {
      return `Tu empresa se encuentra en una etapa temprana en la adopción de tecnologías de la Industria 4.0. Actualmente, presenta un bajo nivel de digitalización y ausencia de estrategias claras para la transformación digital.
    Para avanzar al Nivel 2, te recomendamos iniciar procesos de sensibilización, fortalecer la visión estratégica digital y explorar herramientas tecnológicas básicas.`;
    }
    if (puntaje <= 40) {
      return `Tu empresa ha empezado a explorar el uso de tecnologías digitales, pero aún se encuentra en una etapa incipiente. Hay esfuerzos aislados y poco sistemáticos para integrar tecnologías de Industria 4.0.
        Para avanzar al Nivel 3, es clave consolidar una estructura organizacional orientada a la transformación digital, capacitar al talento humano y avanzar en el uso de tecnologías más avanzadas.`;
    }
    if (puntaje <= 60) {
      return `Tu empresa ha avanzado en la adopción de tecnologías, mostrando procesos organizativos más estructurados y conciencia del valor de la transformación digital. Sin embargo, aún puede mejorar en áreas como automatización, integración de datos y fortalecimiento de capacidades del personal.
    Para alcanzar el Nivel 4, te sugerimos continuar con la formación del talento, integrar soluciones de Big Data y consolidar estrategias de liderazgo digital.`;
    }
    if (puntaje <= 80) {
      return `Tu empresa ha logrado implementar de manera sistemática diversas tecnologías y procesos de Industria 4.0. Existe una estrategia consolidada, cultura de innovación y buena coordinación interna.
    Para llegar al Nivel 5, se recomienda profundizar en el uso de tecnologías emergentes, como inteligencia artificial, y generar un ecosistema de innovación que te permita liderar procesos de transformación dentro y fuera de tu sector.`;
    }
    return `Felicidades, tu empresa es referente en adopción tecnológica y transformación digital. Tiene capacidades sólidas en liderazgo, análisis de datos, automatización y gestión del cambio. Además, actúa como agente impulsor en su entorno productivo.
    Te invitamos a seguir promoviendo innovación abierta, alianzas estratégicas y mentoría a otras empresas para contribuir al desarrollo tecnológico del país.`;
  }

  reiniciar(): void {
    this.pasoActual = 1;
    this.bloqueActual = 0;
    this.mostrarManual = false;
    this.mostrarResultado = false;
    this.nivelMensaje = '';
    this.nivelMensajeDetalle = '';
    this.nivelNombre = '';
    this.puntajeTotal = 0;
    this.empresaForm.reset();
    this.cuestionarioForm.reset();
  }
}
