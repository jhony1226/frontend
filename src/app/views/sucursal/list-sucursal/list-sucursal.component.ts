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

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  estado: string;
}

@Component({
  selector: 'app-list-sucursal',
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
  templateUrl: './list-sucursal.component.html',
  styleUrls: ['./list-sucursal.component.scss'],
})
export class ListSucursalComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'direccion', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Sucursal>([]);

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private responsive: BreakpointObserver, private router: Router) {}

  ngOnInit(): void {
    this.detectMobile();
    this.loadSucursales();
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

  loadSucursales() {
    const sucursales: Sucursal[] = [
      {
        id: 1,
        nombre: 'Sucursal Centro',
        direccion: 'Cra 10 #20-30',
        estado: 'Activa',
      },
      {
        id: 2,
        nombre: 'Sucursal Norte',
        direccion: 'Av 7 #110-15',
        estado: 'Inactiva',
      },
      {
        id: 3,
        nombre: 'Sucursal Sur',
        direccion: 'Cll 5 #45-10',
        estado: 'Activa',
      },
      {
        id: 4,
        nombre: 'Sucursal Occidente',
        direccion: 'Cra 80 #30-20',
        estado: 'Activa',
      },
      {
        id: 5,
        nombre: 'Sucursal Oriente',
        direccion: 'Av. Las Palmas',
        estado: 'Activa',
      },
      {
        id: 6,
        nombre: 'Sucursal Poblado',
        direccion: 'Cra 43A #1-50',
        estado: 'Activa',
      },
      {
        id: 7,
        nombre: 'Sucursal Envigado',
        direccion: 'Cll 38 Sur #40',
        estado: 'Inactiva',
      },
      {
        id: 8,
        nombre: 'Sucursal Bello',
        direccion: 'Autopista Norte',
        estado: 'Activa',
      },
      {
        id: 9,
        nombre: 'Sucursal Itagüí',
        direccion: 'Cra 50 #50-50',
        estado: 'Inactiva',
      },
      {
        id: 10,
        nombre: 'Sucursal Sabaneta',
        direccion: 'Av. El Poblado',
        estado: 'Activa',
      },
      {
        id: 11,
        nombre: 'Sucursal La Estrella',
        direccion: 'Cll 77 Sur',
        estado: 'Activa',
      },
    ];

    // Si hay sucursales en localStorage, las priorizamos
    const guardadas = JSON.parse(localStorage.getItem('sucursales') || 'null');
    if (Array.isArray(guardadas) && guardadas.length > 0) {
      this.dataSource.data = guardadas;
    } else {
      localStorage.setItem('sucursales', JSON.stringify(sucursales));
      this.dataSource.data = sucursales;
    }
  }

  newSucursal() {
    this.router.navigate(['/sucursal/crear-sucursal']);
  }

  editSucursal(row: Sucursal) {
    this.router.navigate(['/sucursal/edit-sucursal'], {
      queryParams: { id: row.id },
    });
  }

  deleteSucursal(row: Sucursal) {
    if (confirm(`¿Estás seguro de eliminar ${row.nombre}?`)) {
      const current = this.dataSource.data.filter((s) => s.id !== row.id);
      localStorage.setItem('sucursales', JSON.stringify(current));
      this.dataSource.data = current;
    }
  }
}
