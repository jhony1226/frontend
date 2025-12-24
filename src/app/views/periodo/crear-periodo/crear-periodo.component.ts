import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-crear-periodo',
  templateUrl: './crear-periodo.component.html',
  styleUrls: ['./crear-periodo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class CrearPeriodoComponent {
  nombre: string = '';
  valor: number | null = null;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  estado: string = 'ACTIVO';

  constructor(private router: Router) {}

  crear() {
    // Validación mínima
    if (!this.nombre || !this.fechaInicio || !this.fechaFin) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Aquí iría la lógica real de creación (API). Por ahora guardamos en localStorage como demo.
    const periodo = {
      nombre: this.nombre,
      valor: this.valor,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      createdAt: new Date().toISOString(),
      estado: this.estado,
    };
    const existentes = JSON.parse(localStorage.getItem('periodos') || '[]');
    existentes.push(periodo);
    localStorage.setItem('periodos', JSON.stringify(existentes));
    // Regresar a la lista de proyectos/periodos
    this.router.navigate(['/periodo/list-periodo']);
  }

  cancelar() {
    this.router.navigate(['/periodo/list-periodo']);
  }
}
