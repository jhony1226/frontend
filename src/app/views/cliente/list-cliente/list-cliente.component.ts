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

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  telefono: string;
  direccion: string;
  estado: string;
  rutaId: number;
  createdAt: string;
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
    RouterModule,
  ],
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
})
export class ListClienteComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'identificacion', 'telefono', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Cliente>([]);

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private responsive: BreakpointObserver, private router: Router) {}

  ngOnInit(): void {
    this.detectMobile();
    this.loadClientes();
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

  loadClientes() {
    const clientes: Cliente[] = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        identificacion: '123456789',
        telefono: '555-1234',
        direccion: 'Cra 10 #20-30',
        estado: 'ACTIVO',
        rutaId: 1,
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'García',
        identificacion: '987654321',
        telefono: '555-5678',
        direccion: 'Av 7 #110-15',
        estado: 'ACTIVO',
        rutaId: 2,
        createdAt: '2024-01-20',
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        identificacion: '456789123',
        telefono: '555-9012',
        direccion: 'Cll 5 #45-10',
        estado: 'INACTIVO',
        rutaId: 1,
        createdAt: '2024-01-25',
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'Martínez',
        identificacion: '789123456',
        telefono: '555-3456',
        direccion: 'Cra 80 #30-20',
        estado: 'ACTIVO',
        rutaId: 3,
        createdAt: '2024-02-01',
      },
      {
        id: 5,
        nombre: 'Luis',
        apellido: 'Hernández',
        identificacion: '321654987',
        telefono: '555-7890',
        direccion: 'Av. Las Palmas',
        estado: 'ACTIVO',
        rutaId: 2,
        createdAt: '2024-02-05',
      },
    ];

    // Si hay clientes en localStorage, las priorizamos
    const guardados = JSON.parse(localStorage.getItem('clientes') || 'null');
    if (Array.isArray(guardados) && guardados.length > 0) {
      this.dataSource.data = guardados;
    } else {
      localStorage.setItem('clientes', JSON.stringify(clientes));
      this.dataSource.data = clientes;
    }
  }

  newCliente() {
    this.router.navigate(['/cliente/crear-cliente']);
  }

  editCliente(row: Cliente) {
    this.router.navigate(['/cliente/edit-cliente'], {
      queryParams: { id: row.id },
    });
  }

  deleteCliente(row: Cliente) {
    if (confirm(`¿Estás seguro de eliminar a ${row.nombre} ${row.apellido}?`)) {
      const current = this.dataSource.data.filter((c) => c.id !== row.id);
      localStorage.setItem('clientes', JSON.stringify(current));
      this.dataSource.data = current;
    }
  }
}