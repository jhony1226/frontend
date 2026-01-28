import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { SucursalService, Sucursal } from '../../../services/sucursal.service';
import { MatIconModule } from '@angular/material/icon'; // 1. Importa el módulo
 
@Component({
  selector: 'app-edit-sucursal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './edit-sucursal.component.html',
  styleUrls: ['./edit-sucursal.component.scss'],
})
export class EditSucursalComponent implements OnInit {
  id: number | null = null;
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  estado: string = 'Activo';

  constructor(private router: Router, private route: ActivatedRoute, private sucursalService: SucursalService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.id = parseInt(params['id'], 10);
        this.cargarSucursal(this.id);
      }
    });
  }

  cargarSucursal(id: number) {
    this.sucursalService.getSucursales().subscribe({
      next: (sucursales) => {
        const sucursal = sucursales.find((s) => s.sucursal_id === id);
        if (sucursal) {
          this.nombre = sucursal.nombre;
          this.direccion = sucursal.direccion;
          this.telefono = sucursal.telefono || '';
          
          // Normalizar estado para coincidir con las opciones del select
          const estadoLower = sucursal.estado ? sucursal.estado.toLowerCase() : 'activo';
          if (estadoLower.includes('act')) this.estado = 'Activo';
          else if (estadoLower.includes('ina')) this.estado = 'Inactivo';
          else if (estadoLower.includes('man')) this.estado = 'Mantenimiento';
          else this.estado = sucursal.estado;
        } else {
          window.alert('Sucursal no encontrada');
          this.router.navigate(['/sucursal/list-sucursal']);
        }
      },
      error: (error) => console.error('Error al cargar sucursal:', error),
    });
  }

  guardar() {
    if (!this.nombre || !this.direccion) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    if (!this.id) {
      window.alert('ID de sucursal no válido');
      return;
    }

    const sucursalActualizada: Partial<Sucursal> = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      estado: this.estado,
    };

    this.sucursalService.editSucursal(this.id, sucursalActualizada).subscribe({
      next: () => {
        window.alert('¡Sucursal actualizada exitosamente!');
        this.router.navigate(['/sucursal/list-sucursal']);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        window.alert('Error al actualizar la sucursal');
      },
    });
  }

  cancelar() {
    this.router.navigate(['/sucursal/list-sucursal']);
  }
}
