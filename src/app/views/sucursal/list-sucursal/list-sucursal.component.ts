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
import { SucursalService, Sucursal } from '../../../services/sucursal.service';

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
  displayedColumns: string[] = ['nombre', 'direccion', 'telefono', 'fecha_creacion', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Sucursal>([]);

  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  message: string = '';
  constructor(private responsive: BreakpointObserver, private router: Router, private sucursalService: SucursalService) {}

  ngOnInit(): void {
    this.detectMobile();
    this.loadSucursales();

    // Configuración personalizada del buscador (filterPredicate)
    this.dataSource.filterPredicate = (data: Sucursal, filter: string) => {
      // Concatenamos solo los campos que queremos que sean buscables
      const dataStr = (
        data.nombre +
        data.direccion +
        (data.telefono || '') + // Manejo seguro de nulos
        data.estado
      ).toLowerCase();
      
      return dataStr.indexOf(filter) !== -1;
    };
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
    this.sucursalService.getSucursales().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
      }
    });
  }

  newSucursal() {
    this.router.navigate(['/sucursal/crear-sucursal']);
  }
 
  editSucursal(row: Sucursal) {
    this.router.navigate(['/sucursal/edit-sucursal'], {
      queryParams: { id: row.sucursal_id },
    });
  }

  deleteSucursal(row: Sucursal) {
    if (!row.sucursal_id) {
      window.alert('Error: La sucursal no tiene un ID válido para eliminar.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar ${row.nombre}?`)) {
      this.sucursalService.deleteSucursal(row.sucursal_id).subscribe({
        next: () => {
          window.alert('Sucursal eliminada exitosamente');
          this.loadSucursales(); // Recargamos la lista desde la API
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          // Extraemos el mensaje exacto que envía el backend (si existe)
          const msg = error.error?.error || error.error?.message || (typeof error.error === 'string' ? error.error : 'No se pudo eliminar la sucursal. Verifique que no tenga datos asociados.');
          window.alert(`Error: ${msg}`);
        },
      });
    }
  }
}
