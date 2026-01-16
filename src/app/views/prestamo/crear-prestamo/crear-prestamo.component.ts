import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-crear-prestamo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.scss'],
})
export class CrearPrestamoComponent implements OnInit {
  clienteSeleccionado: any;
  periodoSeleccionado: any;
  valor: number = 0;
  fecha: string = '';
  estado: string = 'ACTIVO';
  saldoPendiente: number = 0;

  clientes: any[] = [];
  periodos: any[] = [];
  isEditing = false;
  editingId: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    this.periodos = JSON.parse(localStorage.getItem('periodos') || '[]');

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = +params['id'];
        this.loadPrestamoForEdit(this.editingId);
      }
    });
  }

  loadPrestamoForEdit(id: number) {
    const prestamos = JSON.parse(localStorage.getItem('prestamos') || '[]');
    const prestamo = prestamos.find((p: any) => p.id === id);
    if (prestamo) {
      this.clienteSeleccionado = prestamo.cliente;
      this.periodoSeleccionado = prestamo.periodo;
      this.valor = prestamo.valor;
      this.fecha = prestamo.fecha;
      this.estado = prestamo.estado;
      this.saldoPendiente = prestamo.saldoPendiente;
    }
  }

  crear() {
    if (!this.clienteSeleccionado || !this.periodoSeleccionado || !this.valor || !this.fecha) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    const prestamo = {
      id: this.isEditing && this.editingId ? this.editingId : Date.now(),
      cliente: this.clienteSeleccionado,
      periodo: this.periodoSeleccionado,
      valor: this.valor,
      fecha: this.fecha,
      estado: this.estado,
      saldoPendiente: this.saldoPendiente,
      createdAt: new Date().toLocaleDateString(),
    };

    let prestamosGuardados = JSON.parse(localStorage.getItem('prestamos') || '[]');

    if (this.isEditing) {
      prestamosGuardados = prestamosGuardados.map((p: any) => p.id === this.editingId ? prestamo : p);
    } else {
      prestamosGuardados.push(prestamo);
    }

    localStorage.setItem('prestamos', JSON.stringify(prestamosGuardados));

    window.alert(`¡Préstamo ${this.isEditing ? 'actualizado' : 'creado'} exitosamente!`);
    this.cancelar();
  }

  cancelar() {
    this.clienteSeleccionado = null;
    this.periodoSeleccionado = null;
    this.valor = 0;
    this.fecha = '';
    this.estado = 'ACTIVO';
    this.saldoPendiente = 0;
    this.isEditing = false;
    this.editingId = null;
    this.router.navigate(['/prestamo']);
  }
}