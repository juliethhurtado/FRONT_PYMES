import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // ¡esto es lo importante!
})
export class EmpresaService {
  private baseUrl = 'http://localhost:8080/api/empresa';

  constructor(private http: HttpClient) {}

  registrarEmpresa(datos: any): Observable<string> {
    return this.http.post(this.baseUrl, datos, { responseType: 'text' });
  }

}
