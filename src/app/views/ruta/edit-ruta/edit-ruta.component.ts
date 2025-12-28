import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-ruta',
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
  templateUrl: './edit-ruta.component.html',
  styleUrls: ['./edit-ruta.component.scss'],
})
export class EditRutaComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  direccion: string = '';
  zona: string = '';
  estado: string = 'ACTIVO';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarRuta();
  }

  cargarRuta() {
    const rutasGuardadas = JSON.parse(localStorage.getItem('rutas') || '[]');
    const ruta = rutasGuardadas.find((r: any) => r.id === this.id);
    if (ruta) {
      this.nombre = ruta.nombre;
      this.direccion = ruta.direccion;
      this.zona = ruta.zona;
      this.estado = ruta.estado;
    } else {
      window.alert('Ruta no encontrada');
      this.router.navigate(['/ruta']);
    }
  }

  actualizar() {
    // Validación mínima
    if (!this.nombre || !this.direccion || !this.zona) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Actualizar en localStorage
    const rutasGuardadas = JSON.parse(localStorage.getItem('rutas') || '[]');
    const index = rutasGuardadas.findIndex((r: any) => r.id === this.id);
    if (index !== -1) {
      rutasGuardadas[index] = {
        ...rutasGuardadas[index],
        nombre: this.nombre,
        direccion: this.direccion,
        zona: this.zona,
        estado: this.estado,
      };
      localStorage.setItem('rutas', JSON.stringify(rutasGuardadas));
      window.alert('¡Ruta actualizada exitosamente!');
      this.router.navigate(['/ruta']);
    }
  }

  cancelar() {
    this.router.navigate(['/ruta']);
  }
}