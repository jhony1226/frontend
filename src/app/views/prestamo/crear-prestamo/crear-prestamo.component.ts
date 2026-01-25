import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ClienteService, Cliente } from '../../../services/cliente.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Prestamos, PrestamoService } from '../../../services/prestamo.service';

@Component({
  selector: 'app-crear-prestamo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.scss'],
})
export class CrearPrestamoComponent implements OnInit, OnDestroy {
  clienteSeleccionado: Cliente | null = null;
  periodoSeleccionado: any;
  valor: number = 0;
  fecha: string = '';
  estado: string = 'ACTIVO';
  saldoPendiente: number = 0;

  clientes: Cliente[] = [];
  periodos: any[] = [];
  isEditing = false;
  editingId: number | null = null;

  public clienteFilterCtrl: FormControl<string | null> = new FormControl<string | null>('');
  public filteredClientes: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private prestamoService: PrestamoService // Inyectamos el servicio corregido
  
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.periodos = JSON.parse(localStorage.getItem('periodos') || '[]');

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        // Lógica de edición
        this.isEditing = true;
        this.editingId = Number(params['id']);
        this.loadPrestamoForEdit(this.editingId);
      }
    });

    this.clienteFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClientes();
      });
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes.next(this.clientes.slice());
      },
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  protected filterClientes() {
    if (!this.clientes) {
      return;
    }
    let search = this.clienteFilterCtrl.value;
    if (!search) {
      this.filteredClientes.next(this.clientes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClientes.next(
      this.clientes.filter(cliente => 
        cliente.nombres.toLowerCase().indexOf(search!) > -1 || 
        cliente.apellidos.toLowerCase().indexOf(search!) > -1 ||
        cliente.numero_identificacion.indexOf(search!) > -1
      )
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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
  // 1. Validación inicial
  if (!this.clienteSeleccionado || !this.periodoSeleccionado || !this.valor || !this.fecha) {
    window.alert('Completa todos los campos obligatorios.');
    return;
  }

  // 2. Construir el objeto usando la INTERFAZ, no el servicio
  // Usamos Partial<Prestamos> para que coincida con tu método del servicio
  const datosPrestamo: Partial<Prestamos> = {
    cliente_id: this.clienteSeleccionado.cliente_id,
    periodo_id: this.periodoSeleccionado.periodo_id,
    tipo_prestamo_id: 1, 
    monto_prestamo: Number(this.valor), // Convertimos a número para evitar líos
    saldo_pendiente: Number(this.saldoPendiente || this.valor),
    valor_intereses: 0, 
    valor_cuota: 0,     
    fecha_desembolso: this.fecha,
    fecha_fin_prestamo: null,
    estado_prestamo: this.estado || 'ACTIVO'
  };

  if (this.isEditing && this.editingId) {
    // --- LÓGICA DE ACTUALIZACIÓN ---
    this.prestamoService.updatePrestamo(this.editingId, datosPrestamo).subscribe({
      next: (res) => {
        window.alert('¡Préstamo actualizado exitosamente!');
        this.cancelar();
      },
      error: (err) => {
        console.error('Error en update:', err);
        window.alert('Error al actualizar el préstamo en el servidor.');
      }
    });
  } else {
    // --- LÓGICA DE CREACIÓN ---
    this.prestamoService.createPrestamo(datosPrestamo).subscribe({
      next: (res) => {
        window.alert('¡Préstamo creado exitosamente en la base de datos!');
        this.cancelar();
      },
      error: (err) => {
        console.error('Error en create:', err);
        window.alert('Error al guardar el préstamo. Verifica la conexión.');
      }
    });
  }
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