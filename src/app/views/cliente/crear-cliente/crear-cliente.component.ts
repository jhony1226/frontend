import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss'],
})
export class CrearClienteComponent {
  nombre: string = '';
  apellido: string = '';
  identificacion: string = '';
  telefono: string = '';
  direccion: string = '';
  estado: string = 'ACTIVO';
  rutaId: number = 0;

  rutas: any[] = [];

  constructor(private router: Router) {
    this.cargarRutas();
  }

  cargarRutas() {
    this.rutas = JSON.parse(localStorage.getItem('rutas') || '[]');
  }

  crear() {
    // Validación mínima
    if (!this.nombre || !this.apellido || !this.identificacion || !this.telefono || !this.direccion || !this.rutaId) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Guardar en localStorage como demo
    const nuevoCliente = {
      id: Date.now(),
      nombre: this.nombre,
      apellido: this.apellido,
      identificacion: this.identificacion,
      telefono: this.telefono,
      direccion: this.direccion,
      estado: this.estado,
      rutaId: this.rutaId,
      createdAt: new Date().toLocaleDateString(),
    };

    // Guardar en localStorage
    const clientesGuardados = JSON.parse(
      localStorage.getItem('clientes') || '[]'
    );
    clientesGuardados.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientesGuardados));

    window.alert('¡Cliente creado exitosamente!');
    this.cancelar();
  }

  cancelar() {
    this.nombre = '';
    this.apellido = '';
    this.identificacion = '';
    this.telefono = '';
    this.direccion = '';
    this.estado = 'ACTIVO';
    this.rutaId = 0;
    this.router.navigate(['/cliente']);
  }
}