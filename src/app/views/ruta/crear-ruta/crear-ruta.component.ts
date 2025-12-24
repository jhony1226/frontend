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
  selector: 'app-crear-ruta',
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
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.scss'],
})
export class CrearRutaComponent {
  nombre: string = '';
  direccion: string = '';
  zona: string = '';
  estado: string = 'ACTIVO';

  constructor(private router: Router) {}

  crear() {
    // Validación mínima
    if (!this.nombre || !this.direccion || !this.zona) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Guardar en localStorage como demo
    const nuevaRuta = {
      id: Date.now(),
      nombre: this.nombre,
      direccion: this.direccion,
      zona: this.zona,
      estado: this.estado,
      createdAt: new Date().toLocaleDateString(),
    };
    // Guardar en localStorage
    const rutasGuardadas = JSON.parse(
      localStorage.getItem('rutas') || '[]'
    );
    rutasGuardadas.push(nuevaRuta);
    localStorage.setItem('rutas', JSON.stringify(rutasGuardadas));

    window.alert('¡Ruta creada exitosamente!');
    this.cancelar();
  }

  cancelar() {
    this.nombre = '';
    this.direccion = '';
    this.zona = '';
    this.estado = 'ACTIVO';
    this.router.navigate(['/ruta']);
  }
}
