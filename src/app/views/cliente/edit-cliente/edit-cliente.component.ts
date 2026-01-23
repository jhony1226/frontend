import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Plugins & Services
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ClienteService, Cliente } from '../../../services/cliente.service';
import { RutasService, Rutas } from '../../../services/rutas.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-cliente',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatIconModule,
    MatTooltipModule, NgxMatSelectSearchModule
  ],
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.scss'],
})
export class EditClienteComponent implements OnInit, OnDestroy {
  // Estado del Formulario
  isEditMode: boolean = false; // <--- SOLUCIÓN AL ERROR
  clienteId: number = 0;

  // Modelos para [(ngModel)]
  nombre: string = '';
  apellido: string = '';
  identificacion: string = '';
  telefono: string = '';
  direccion: string = '';
  estado: string = 'activo'; // Valor por defecto

  // Gestión de Rutas (Reactive)
  rutas: Rutas[] = [];
  public rutaCtrl: FormControl<number | null> = new FormControl<number | null>(null);
  public rutaFilterCtrl: FormControl<string | null> = new FormControl<string | null>('');
  public filteredRutas: ReplaySubject<Rutas[]> = new ReplaySubject<Rutas[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private rutasService: RutasService
  ) {}

  ngOnInit() {
    this.cargarRutas();
    
    // Detectar si estamos editando o creando
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = Number(params['id']);
        this.cargarCliente(this.clienteId);
      } else {
        this.isEditMode = false;
        this.estado = 'activo';
      }
    });

    // Filtro dinámico de rutas
    this.rutaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterRutas());
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // --- LÓGICA DE DATOS ---

  cargarRutas() {
    this.rutasService.getRutas().subscribe({
      next: (data) => {
        this.rutas = data;
        this.filteredRutas.next(this.rutas.slice());
      },
      error: (err) => console.error('Error cargando rutas', err)
    });
  }

  protected filterRutas() {
    if (!this.rutas) return;
    let search = this.rutaFilterCtrl.value;
    if (!search) {
      this.filteredRutas.next(this.rutas.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredRutas.next(
      this.rutas.filter(ruta => ruta.nombre_ruta.toLowerCase().includes(search!))
    );
  }

  cargarCliente(id: number) {
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        if (cliente) {
          this.nombre = cliente.nombres;
          this.apellido = cliente.apellidos;
          this.identificacion = cliente.numero_identificacion;
          this.telefono = cliente.telefono;
          this.direccion = cliente.direccion;
          this.estado = cliente.estado.toLowerCase(); // Normalizar a minúsculas
          this.rutaCtrl.setValue(cliente.id_ruta);
        }
      },
      error: (err) => console.error('Error cargando cliente', err)
    });
  }

  // --- ACCIONES ---

  guardar() {
    const selectedRutaId = this.rutaCtrl.value;

    if (!this.nombre || !this.apellido || !this.identificacion || !selectedRutaId) {
      alert('Por favor, completa los campos obligatorios marcados con *');
      return;
    }

    const clienteData: Partial<Cliente> = {
      nombres: this.nombre,
      apellidos: this.apellido,
      numero_identificacion: this.identificacion,
      telefono: this.telefono,
      direccion: this.direccion,
      estado: this.estado.toUpperCase(), // API suele esperar MAYÚSCULAS
      id_ruta: selectedRutaId,
      sucursal_id: 1 // TODO: Obtener de sesión/usuario
    };

    if (this.isEditMode) {
      this.actualizarCliente(clienteData);
    } else {
      this.crearCliente(clienteData);
    }
  }

  private actualizarCliente(data: Partial<Cliente>) {
    this.clienteService.updateCliente(this.clienteId, data).subscribe({
      next: () => {
        alert('Cliente actualizado exitosamente');
        this.router.navigate(['/cliente/list-cliente']);
      },
      error: (err) => console.error('Error al actualizar', err)
    });
  }

  private crearCliente(data: Partial<Cliente>) {
    // Asumiendo que tienes un método createCliente en tu servicio
    this.clienteService.createCliente(data as Cliente).subscribe({
      next: () => {
        alert('Cliente creado exitosamente');
        this.router.navigate(['/cliente/list-cliente']);
      },
      error: (err) => console.error('Error al crear', err)
    });
  }

  cancelar() {
    this.router.navigate(['/cliente/list-cliente']);
  }
}