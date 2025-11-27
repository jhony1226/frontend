import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

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
  ciudad: string = '';
  estado: string = 'ACTIVA';

  constructor(private router: Router) {}

  crear() {
    if (!this.nombre || !this.direccion || !this.ciudad) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    const nuevaSucursal = {
      id: Date.now(),
      nombre: this.nombre,
      direccion: this.direccion,
      ciudad: this.ciudad,
      estado: this.estado,
      createdAt: new Date().toLocaleDateString(),
    };

    // Guardar en localStorage
    const sucursalesGuardadas = JSON.parse(
      localStorage.getItem('sucursales') || '[]'
    );
    sucursalesGuardadas.push(nuevaSucursal);
    localStorage.setItem('sucursales', JSON.stringify(sucursalesGuardadas));

    window.alert('¡Sucursal creada exitosamente!');
    this.cancelar();
  }

  cancelar() {
    this.nombre = '';
    this.direccion = '';
    this.ciudad = '';
    this.estado = 'ACTIVA';
    this.router.navigate(['/sucursal/list-sucursal']);
  }
}
