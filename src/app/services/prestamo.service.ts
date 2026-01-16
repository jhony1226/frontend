import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Prestamos{
  id_prestamo: number;
  nombre_cliente: string;
  periodo_id: number;
  monto_prestamo: number;
  fecha_desembolso?: Date;
  estado_prestamo?: string;
  saldo_pendiente?: number;
  valor_intereses: number;
  valor_cuota?: number;
  fecha_fin_prestamo: string | null;
  data: CobroDetalle[];
}

export interface PrestamoCliente {
  prestamo_id: number;
  cliente: string;
  saldo_pendiente: string;
  valor_cuota: string;
  fecha_fin_prestamo: string | null;
}

export interface CobroDetalle {
  fecha_cobro: string;
  monto_cobrado: string;
  estado: string;
}

export interface PrestamoCobros {
  id_prestamo: number;
  nombre_cliente: string;
  saldo_pendiente: string;
  valor_cuota: string;
  fecha_fin_prestamo: string | null;
  data: CobroDetalle[];
}


@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = `${environment.apiUrl}/prestamo`;

  constructor(private http: HttpClient) {}

  getPrestamos(): Observable<Prestamos[]> {
    return this.http.get<Prestamos[]>(`${this.apiUrl}/getPrestamos`);
  }

  getPrestamosByCliente(cliente_id: number): Observable<PrestamoCliente[]> {
    return this.http.get<PrestamoCliente[]>(`${this.apiUrl}/getPrestamosByCliente/${cliente_id}`);
  }

  getPrestamoCobros(prestamo_id: number): Observable<PrestamoCobros> {
    return this.http.get<PrestamoCobros>(`${this.apiUrl}/prestamoCobros/${prestamo_id}`);
  }
}
