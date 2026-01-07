import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Rutas {
  ruta_id?: number;
  sucursal_id: number;
  nombre_ruta: string;
  descripcion?: string;
  zona?: string;
  fecha_creacion?: Date;
  estado?: string;
  created_at?: Date; 
}
@Injectable({
  providedIn: 'root'
})
export class RutasService {
 
  private apiUrl = `${environment.apiUrl}/ruta`; // Cambia esto a la URL de tu API backend

  constructor(private http: HttpClient) { }    

  getRutas(): Observable<Rutas[]> {
    return this.http.get<Rutas[]>(`${this.apiUrl}/getRutas`);
  } 
  getRutasById(id: string): Observable<Rutas[]> {
    return this.http.get<Rutas[]>(`${this.apiUrl}/getRutaById/${id}`);
  } 

  findRuta(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findRuta/${id}`);
  }
    
    createRutas(ruta: Rutas): Observable<Rutas> {
    return this.http.post<Rutas>(`${this.apiUrl}/createRuta`, ruta);
  } 
    editRutas(id: number, ruta: Partial<Rutas>): Observable<Rutas> {
    return this.http.put<Rutas>(`${this.apiUrl}/updateRuta/${id}`, ruta);
  }
    deleteRutas(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteRuta/${id}`);
  }


}