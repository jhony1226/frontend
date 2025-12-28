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
  selector: 'app-crear-gasto',
  templateUrl: './crear-gasto.component.html',
  styleUrls: ['./crear-gasto.component.scss'],
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
export class CrearGastoComponent {
  cliente_id: string = '';
  ruta_id: string = '';
  concepto: string = '';
  fecha: Date | null = null;
  valor: number | null = null;
  descripcion: string = '';

  // Listas para los selectores (deberían cargarse desde un servicio)
  clientes: any[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María López' },
    { id: 3, nombre: 'Carlos Rodríguez' },
  ];

  rutas: any[] = [
    { id: 1, nombre: 'Ruta Centro' },
    { id: 2, nombre: 'Ruta Norte' },
    { id: 3, nombre: 'Ruta Sur' },
  ];

  constructor(private router: Router) {}

  crear() {
    // Validación mínima
    if (!this.cliente_id || !this.ruta_id || !this.concepto || !this.fecha || !this.valor) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    // Aquí iría la lógica real de creación (API). Por ahora guardamos en localStorage como demo.
    const gasto = {
      cliente_id: this.cliente_id,
      ruta_id: this.ruta_id,
      concepto: this.concepto,
      fecha: this.fecha,
      valor: this.valor,
      descripcion: this.descripcion,
      createdAt: new Date().toISOString(),
    };
    const existentes = JSON.parse(localStorage.getItem('gastos') || '[]');
    existentes.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(existentes));
    // Regresar a la lista de gastos
    this.router.navigate(['/gasto/list-gasto']);
  }

  cancelar() {
    this.router.navigate(['/gasto/list-gasto']);
  }
}

