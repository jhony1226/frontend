import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface para crear cobro (enviar al backend)
export interface CreateCobroDto {
  prestamo_id: number;
  usuario_id: number;
  monto_cobrado: number;
}

// Interface para recibir datos completos del cobro
export interface Cobro {
  cobro_id?: number;
  prestamo_id: number;
  usuario_id: number;
  fecha_cobro: string;
  monto_cobrado: number;
  estado: string;
  nombrecliente?: string;
  idprestamo?: number;
  direccioncliente?: string;
  telefonocliente?: string;
  ruta_id?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CobroService {
  private apiUrl = `${environment.apiUrl}/cobro`;

  constructor(private http: HttpClient) { }

  getCobros(): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${environment.apiUrl}/cliente/getClientesByRuta/1`);
  }

  getCobro(id: number | string): Observable<Cobro> {
    return this.http.get<Cobro>(`${this.apiUrl}/getCobro/${id}`);
  }

  editCobro(id: number | string, cobro: Partial<Cobro>): Observable<Cobro> {
    return this.http.put<Cobro>(`${this.apiUrl}/updateCobro/${id}`, cobro);
  }
  
  getClientesByuser(userId: number | string): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${this.apiUrl}/getClientesByRuta/1`);
  }

  createCobro(cobro: CreateCobroDto): Observable<Cobro> {
    const url = `${this.apiUrl}/createCobro`;
    console.log('CobroService - URL completa:', url);
    console.log('CobroService - Datos a enviar:', cobro);
    return this.http.post<Cobro>(url, cobro);
  }
}