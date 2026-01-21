import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';



export interface RutaCobro{
    ruta_id: number; 
    usuario_id: number; 
}

@Injectable({
  providedIn: 'root'
})
export class AsignarRutaService {  
     private apiUrl = `${environment.apiUrl}/asignacionRuta`; 
constructor(private http: HttpClient) { }

asignaCobrador(rutaCobro: RutaCobro): Promise<any> {
  // Creamos el objeto "payload" con los nombres exactos que espera el backend
  const payload = {
    ruta_id: rutaCobro.ruta_id,   // Asegúrate de que estos nombres
    usuario_id: rutaCobro.usuario_id // coincidan con tu API
  };

  return this.http.post<any>(`${this.apiUrl}/createAsignacionRuta`, payload).toPromise();
}

    }   