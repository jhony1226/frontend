import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SucursalService, Sucursal } from '../../../services/sucursal.service';

@Component({
  selector: 'app-crear-sucursal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './crear-sucursal.component.html',
  styleUrls: ['./crear-sucursal.component.scss'],
})
export class CrearSucursalComponent {
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  estado: string = 'Activo';

  constructor(private router: Router, private sucursalService: SucursalService) {}

  crear() {
    if (!this.nombre || !this.direccion) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    const nuevaSucursal: Sucursal = {
      sucursal_id: 0, // El backend generará el ID
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      estado: this.estado,
      fecha_creacion: new Date().toISOString(),
    };

    this.sucursalService.createSucursal(nuevaSucursal).subscribe({
      next: () => {
        window.alert('¡Sucursal creada exitosamente!');
        this.cancelar();
      },
      error: (error) => {
        console.error('Error al crear sucursal:', error);
        window.alert('Ocurrió un error al crear la sucursal.');
      }
    });
  }

  cancelar() {
    this.nombre = '';
    this.direccion = '';
    this.telefono = '';
    this.estado = 'Activo';
    this.router.navigate(['/sucursal/list-sucursal']);
  }
}
