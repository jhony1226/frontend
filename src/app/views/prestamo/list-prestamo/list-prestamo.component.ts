import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';

export interface Prestamo {
  id: number;
  cliente: any;
  periodo: any;
  valor: number;
  fecha: string;
  estado: string;
  saldoPendiente: number;
}

@Component({
  selector: 'app-list-prestamo',
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
    RouterModule,
  ],
  templateUrl: './list-prestamo.component.html',
  styleUrls: ['./list-prestamo.component.scss'],
})
export class ListPrestamoComponent implements OnInit {
  displayedColumns: string[] = ['cliente', 'periodo', 'valor', 'fecha', 'estado', 'saldoPendiente', 'actions'];
  dataSource = new MatTableDataSource<Prestamo>([]);

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private responsive: BreakpointObserver, private router: Router) {}

  ngOnInit(): void {
    this.detectMobile();
    this.loadPrestamos();
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

  loadPrestamos() {
    const prestamos: Prestamo[] = [
      {
        id: 1,
        cliente: { nombre: 'Juan', apellido: 'Pérez' },
        periodo: { nombre: 'Enero 2025' },
        valor: 1000000,
        fecha: '2025-01-01',
        estado: 'ACTIVO',
        saldoPendiente: 500000,
      },
      {
        id: 2,
        cliente: { nombre: 'María', apellido: 'Gómez' },
        periodo: { nombre: 'Febrero 2025' },
        valor: 1500000,
        fecha: '2025-02-01',
        estado: 'INACTIVO',
        saldoPendiente: 750000,
      },
      {
        id: 3,
        cliente: { nombre: 'Carlos', apellido: 'Rodríguez' },
        periodo: { nombre: 'Marzo 2025' },
        valor: 2000000,
        fecha: '2025-03-01',
        estado: 'PAGADO',
        saldoPendiente: 0,
      },
    ];

    // Si hay prestamos en localStorage, las priorizamos
    const guardados = JSON.parse(localStorage.getItem('prestamos') || 'null');
    if (Array.isArray(guardados) && guardados.length > 0) {
      this.dataSource.data = guardados;
    } else {
      this.dataSource.data = prestamos;
    }
  }

  newPrestamo() {
    this.router.navigate(['/prestamo/crear-prestamo']);
  }

  editPrestamo(row: Prestamo) {
    this.router.navigate(['/prestamo/crear-prestamo'], {
      queryParams: { id: row.id },
    });
  }

  deletePrestamo(row: Prestamo) {
    if (confirm(`¿Estás seguro de eliminar el préstamo de ${row.cliente.nombre} ${row.cliente.apellido}?`)) {
      const current = this.dataSource.data.filter((p) => p.id !== row.id);
      localStorage.setItem('prestamos', JSON.stringify(current));
      this.dataSource.data = current;
    }
  }
}