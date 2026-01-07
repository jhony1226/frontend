import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CobroService {
  private apiUrl = `${environment.apiUrl}/cobro`;

  constructor(private http: HttpClient) { }

  getCobros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCobros`);
  }

  getCobro(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCobro/${id}`);
  }

  editCobro(id: number | string, cobro: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateCobro/${id}`, cobro);
  }
}