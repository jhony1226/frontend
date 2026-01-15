import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface Cliente{
  cliente_id: number;
  nombrecliente: string;
  direccioncliente: string;
  telefonocliente: string | null;
   
}


@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  private apiUrl = `${environment.apiUrl}/cliente`;

    constructor(private http: HttpClient) { }
    
 
getClientesByRuta(rutaId: number): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(
    `${this.apiUrl}/getClientesbyUser/${rutaId}`
  );
}
     
    
}