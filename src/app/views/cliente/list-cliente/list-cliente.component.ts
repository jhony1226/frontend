import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ClienteService, Cliente } from '../../../services/cliente.service';

export interface ClienteConPrestamo {
  nombrecliente: string;
  idprestamo: string;
  direccioncliente: string;
  telefonocliente: string;
  cliente_id: number;
  monto_prestamo: number;
  saldo_pendiente: number;
  estado_prestamo: string;
}

@Component({
  selector: 'app-list-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
})
export class ListClienteComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'identificacion', 'telefono', 'ruta', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Cliente>([]);
  allClientes: Cliente[] = [];
  rutaFilter = new FormControl('');
  rutas: number[] = [];
  mode: string = 'normal'; // 'normal' o 'selectForLoan'

  // Para mostrar clientes con pr\u00e9stamos
  displayedColumnsConPrestamo: string[] = ['nombrecliente', 'idprestamo', 'direccioncliente', 'telefonocliente', 'monto_prestamo', 'saldo_pendiente', 'estado_prestamo'];
  dataSourceConPrestamo = new MatTableDataSource<ClienteConPrestamo>([]);

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private responsive: BreakpointObserver, 
    private router: Router,
    private clienteService: ClienteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar modo desde route data
    this.route.data.subscribe(data => {
      this.mode = data['mode'] || 'normal';
      if (this.mode === 'selectForLoan') {
        this.displayedColumns = ['nombre', 'telefono', 'ruta', 'actions'];
      }
    });
    
    this.detectMobile();
    this.loadClientes(); 
    this.setupRutaFilter();
  }

  detectMobile() {
    this.responsive.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
      // Reasignamos el paginador si cambiamos de vista
      if (!this.isMobile) {
        setTimeout(() => (this.dataSource.paginator = this.paginator));
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setupRutaFilter() {
    this.rutaFilter.valueChanges.subscribe((rutaId) => {
      this.filterByRuta(rutaId);
    });
  }

  filterByRuta(rutaId: string | null) {
    if (!rutaId || rutaId === '') {
      this.dataSource.data = this.allClientes;
    } else {
      this.dataSource.data = this.allClientes.filter(
        (cliente) => cliente.id_ruta === Number(rutaId)
      );
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.allClientes = data;
        this.dataSource.data = data;
        // Extraer rutas únicas
        this.rutas = [...new Set(this.allClientes.map(c => c.id_ruta))].sort((a, b) => a - b);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
      }
    }); 
  }

  

  newCliente() {
    this.router.navigate(['/cliente/crear-cliente']);
  }

  editCliente(row: Cliente) {
    this.router.navigate(['/cliente/edit-cliente'], {
      queryParams: { id: row.cliente_id },
    });
  }

  deleteCliente(row: Cliente) {
    if (confirm(`¿Estás seguro de eliminar a ${row.nombres} ${row.apellidos}?`)) {
      // Implementar llamada al servicio para eliminar
      console.log('Eliminar cliente', row.cliente_id);
    }
  }

  verPrestamosCliente(row: Cliente) {
    // Navegar a list-prestamo pasando el cliente por queryParams
    this.router.navigate(['/prestamo/list-prestamo'], {
      queryParams: { cliente_id: row.cliente_id }
    });
  }
}