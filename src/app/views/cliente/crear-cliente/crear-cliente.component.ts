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
import { ClienteService, Cliente } from '../../../services/cliente.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-crear-cliente',
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
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss'],
})
export class CrearClienteComponent implements OnInit {
  nombre: string = '';
  apellido: string = '';
  identificacion: string = '';
  telefono: string = '';
  direccion: string = '';
  estado: string = 'ACTIVO';
  rutaId: number = 0;
  clienteId: number | null = null;
  isEditMode: boolean = false;

  rutas: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.cargarRutas();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.clienteId = Number(params['id']);
        this.isEditMode = true;
        this.cargarCliente(this.clienteId);
      }
    });
  }

  cargarRutas() {
    // Aquí deberías cargar las rutas desde un servicio real si es posible
    // Por ahora mantengo el mock de localStorage si es lo que usas para rutas,
    // o deberíamos llamar a un rutasService?
    // Asumiendo que rutas pueden venir de localStorage o un servicio
    this.rutas = JSON.parse(localStorage.getItem('rutas') || '[]');
  }

  cargarCliente(id: number) {
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        this.nombre = cliente.nombres;
        this.apellido = cliente.apellidos;
        this.identificacion = cliente.numero_identificacion;
        this.telefono = cliente.telefono;
        this.direccion = cliente.direccion;
        this.estado = cliente.estado;
        this.rutaId = cliente.id_ruta;
      },
      error: (err) => console.error('Error cargando cliente', err)
    });
  }

  guardar() {
    if (!this.nombre || !this.apellido || !this.identificacion || !this.telefono || !this.direccion || !this.rutaId) {
      window.alert('Completa todos los campos obligatorios.');
      return;
    }

    const clienteData: Partial<Cliente> = {
      nombres: this.nombre,
      apellidos: this.apellido,
      numero_identificacion: this.identificacion,
      telefono: this.telefono,
      direccion: this.direccion,
      estado: this.estado,
      id_ruta: this.rutaId,
    };

    if (this.isEditMode && this.clienteId) {
      this.clienteService.updateCliente(this.clienteId, clienteData).subscribe({
        next: () => {
          window.alert('¡Cliente actualizado exitosamente!');
          this.cancelar();
        },
        error: (err) => {
          console.error('Error actualizando cliente', err);
          window.alert('Error al actualizar cliente');
        }
      });
    } else {
      this.clienteService.createCliente(clienteData).subscribe({
        next: () => {
          window.alert('¡Cliente creado exitosamente!');
          this.cancelar();
        },
        error: (err) => {
          console.error('Error creando cliente', err);
          window.alert('Error al crear cliente');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/cliente']);
  }
}