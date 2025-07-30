import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private baseUrl = 'http://localhost:8080/api/empresa';

  constructor(private http: HttpClient) {}

  registrarEmpresa(datos: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/registrar`, datos, { responseType: 'text' });
  }

  enviarCorreoResultado(data: { correo: string; puntaje: number; mensaje: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/enviar-correo`, data, { responseType: 'text' });
  }

  // ✅ Implementación real
  enviarResultadosPorCorreo(datos: {
    correo: string;
    nombreParticipante: string;
    nombreEmpresa: string;
    puntaje: number;
    nivel: string;
    respuestas: any;
    mensaje: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviarResultados`, datos);
  }
}
