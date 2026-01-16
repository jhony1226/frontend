import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edir-periodo',
  templateUrl: './edir-periodo.component.html',
  styleUrls: ['./edir-periodo.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EdirPeriodoComponent {
  nombre: string = '';
  valor: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  estado: string = 'ACTIVO';

  constructor(private router: Router) {}

  guardar() {
    if (!this.nombre || !this.fechaInicio || !this.fechaFin) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Lógica demo: actualizar primer periodo encontrado en localStorage o crear uno nuevo.
    const existentes = JSON.parse(localStorage.getItem('periodos') || '[]');
    if (existentes.length > 0) {
      existentes[0] = {
        ...existentes[0],
        nombre: this.nombre,
        valor: this.valor,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        estado: this.estado,
        updatedAt: new Date().toISOString(),
      };
    } else {
      existentes.push({
        nombre: this.nombre,
        valor: this.valor,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        estado: this.estado,
        createdAt: new Date().toISOString(),
      });
    }
    localStorage.setItem('periodos', JSON.stringify(existentes));
    this.router.navigate(['/periodo/list-periodo']);
  }

  cancelar() {
    this.router.navigate(['/periodo/list-periodo']);
  }
}
