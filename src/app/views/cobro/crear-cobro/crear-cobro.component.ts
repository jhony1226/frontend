import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Cliente, ClienteCobro, ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-crear-cobro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './crear-cobro.component.html',
  styleUrls: ['./crear-cobro.component.scss']
})
export class CrearCobroComponent implements OnInit {
  displayedColumns: string[] = ['nombrecliente', 'direccioncliente', 'telefonocliente', 'acciones'];
  dataSource: MatTableDataSource<ClienteCobro>;
  isMobile = false;
  rutaId: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private responsive: BreakpointObserver
  ) {
    this.dataSource = new MatTableDataSource<ClienteCobro>([]);
  }

 
  ngOnInit(): void {
    this.detectMobile();
    this.cargarClientes();
  }

  detectMobile() {
    this.responsive.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  cargarClientes(): void {
    this.clienteService.getClientesByRuta(this.rutaId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
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

  verDetalles(cliente: ClienteCobro): void {
    // Navegar a la vista de préstamos del cliente
    console.log('Navegando a préstamos del cliente:', cliente.cliente_id);
    this.router.navigateByUrl(`/prestamo/prestamos-cliente/${cliente.cliente_id}`).catch(err => {
      console.error('Error en navegación:', err);
    });
  }
 
  cancelar() {
    this.router.navigate(['/cobro/list-cobro']);
  }
}