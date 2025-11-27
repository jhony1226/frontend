import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './edit-sucursal.component.html',
  styleUrls: ['./edit-sucursal.component.scss'],
})
export class EditSucursalComponent implements OnInit {
  id: number | null = null;
  nombre: string = '';
  direccion: string = '';
  ciudad: string = '';
  estado: string = 'ACTIVA';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.id = parseInt(params['id'], 10);
        this.cargarSucursal(this.id);
      }
    });
  }

  cargarSucursal(id: number) {
    const sucursalesGuardadas = JSON.parse(
      localStorage.getItem('sucursales') || '[]'
    );
    const sucursal = sucursalesGuardadas.find((s: any) => s.id === id);

    if (sucursal) {
      this.nombre = sucursal.nombre;
      this.direccion = sucursal.direccion;
      this.ciudad = sucursal.ciudad;
      this.estado = sucursal.estado;
    } else {
      window.alert('Sucursal no encontrada');
      this.router.navigate(['/sucursal']);
    }
  }

  guardar() {
    if (!this.nombre || !this.direccion || !this.ciudad) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    if (!this.id) {
      window.alert('ID de sucursal no válido');
      return;
    }

    const sucursalesGuardadas = JSON.parse(
      localStorage.getItem('sucursales') || '[]'
    );
    const index = sucursalesGuardadas.findIndex((s: any) => s.id === this.id);

    if (index !== -1) {
      sucursalesGuardadas[index] = {
        ...sucursalesGuardadas[index],
        nombre: this.nombre,
        direccion: this.direccion,
        ciudad: this.ciudad,
        estado: this.estado,
        updatedAt: new Date().toLocaleDateString(),
      };
      localStorage.setItem('sucursales', JSON.stringify(sucursalesGuardadas));
      window.alert('¡Sucursal actualizada exitosamente!');
      this.router.navigate(['/sucursal/list-sucursal']);
    }
  }

  cancelar() {
    this.router.navigate(['/sucursal/list-sucursal']);
  }
}
