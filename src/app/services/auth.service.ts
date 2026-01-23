import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of, delay, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SucursalContextService } from './sucursal-context.service';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipoUsuarioId: number;
  tipoUsuario?: string;
  sucursalId?: number;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  tipoUsuarioId: number;
  sucursalId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Modo local para desarrollo (cambiar a false cuando la API esté lista)
  private USE_LOCAL_AUTH = true;

  // Usuarios de prueba para desarrollo local
  private mockUsers = [
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@test.com',
      password: '123456',
      tipoUsuarioId: 1,
      tipoUsuario: 'Administrador',
      sucursalId: 1
    },
    {
      id: 2,
      nombre: 'Cobrador 1',
      email: 'cobrador@test.com',
      password: '123456',
      tipoUsuarioId: 2,
      tipoUsuario: 'Cobrador',
      sucursalId: 1
    },
    {
      id: 3,
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      password: '123456',
      tipoUsuarioId: 2,
      tipoUsuario: 'Cobrador',
      sucursalId: 2
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private sucursalContextService: SucursalContextService
  ) {}

  // Obtener valor actual del usuario (sin suscribirse)
  getCurrentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Obtener usuario del localStorage
  private getUserFromStorage(): Usuario | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Login Local (Mock)
  private loginLocal(email: string, password: string): Observable<LoginResponse> {
    // Buscar usuario
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return throwError(() => ({ error: { message: 'Credenciales inválidas' } })).pipe(delay(500));
    }

    const { password: _, ...userWithoutPassword } = user;
    const response: LoginResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      usuario: userWithoutPassword
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.usuario));
        this.currentUserSubject.next(res.usuario);
      })
    );
  }

  // Registro Local (Mock)
  private registerLocal(data: RegisterData): Observable<LoginResponse> {
    // Verificar si el email ya existe
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    
    if (existingUser) {
      return throwError(() => ({ error: { message: 'El email ya está registrado' } })).pipe(delay(500));
    }

    const newUser = {
      id: this.mockUsers.length + 1,
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      tipoUsuarioId: data.tipoUsuarioId,
      tipoUsuario: data.tipoUsuarioId === 1 ? 'Administrador' : 'Cobrador',
      sucursalId: data.sucursalId || 1
    };

    this.mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const response: LoginResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      usuario: userWithoutPassword
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.usuario));
        this.currentUserSubject.next(res.usuario);
      })
    );
  }

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    if (this.USE_LOCAL_AUTH) {
      return this.loginLocal(email, password);
    }
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  // Registro
  register(data: RegisterData): Observable<LoginResponse> {
    if (this.USE_LOCAL_AUTH) {
      return this.registerLocal(data);
    }
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.sucursalContextService.clearSucursal(); // Limpiar sucursal al cerrar sesión
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tipoUsuarioId === 1; // Asumiendo que 1 es admin
  }

  // Verificar si es cobrador
  isCobrador(): boolean {
    const user = this.getCurrentUser();
    return user?.tipoUsuarioId === 2; // Asumiendo que 2 es cobrador
  }
}
