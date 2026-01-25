import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoPrestamo { 
  cantidad_cuotas: number;
  porcentaje: number; 
}

// Omitimos el ID para la creación
export type TipoPrestamoRequest = Omit<TipoPrestamo, 'tipo_prestamo_id' | 'created_at'>;

@Injectable({
  providedIn: 'root'
})
export class TipoPrestamoService {
  private apiUrl = `${environment.apiUrl}/tipo-prestamo`; // Ajusta tu endpoint

  constructor(private http: HttpClient) {}

  // Obtener todos los tipos de préstamo
  getTiposPrestamo(): Observable<TipoPrestamo[]> {
    return this.http.get<TipoPrestamo[]>(this.apiUrl);
  }

  // Obtener un tipo de préstamo por ID
  getTipoPrestamoById(id: number): Observable<TipoPrestamo> {
    return this.http.get<TipoPrestamo>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo tipo de préstamo
  createTipoPrestamo(data: Partial<TipoPrestamo>): Observable<TipoPrestamo> {
  return this.http.post<TipoPrestamo>(`${this.apiUrl}/create`, data);
}

  // Actualizar un tipo de préstamo existente
  updateTipoPrestamo(id: number, tipoPrestamo: Partial<TipoPrestamo>): Observable<TipoPrestamo> {
    return this.http.put<TipoPrestamo>(`${this.apiUrl}/${id}`, tipoPrestamo);
  }

  // Eliminar un tipo de préstamo
  deleteTipoPrestamo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}