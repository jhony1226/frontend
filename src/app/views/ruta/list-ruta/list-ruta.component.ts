import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Rutas, RutasService } from '../../../services/rutas.service';
import { ActivatedRoute } from '@angular/router';
import { AuthMockService } from '../../../services/AuthMockService';
@Component({
  selector: 'app-list-ruta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './list-ruta.component.html',
  styleUrls: ['./list-ruta.component.scss'],
})
export class ListRutaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [ // Corregido para que coincida con la interfaz Rutas
    'nombre_ruta',
    'cobrador',
    'zona',
    'estado',
    'created_at',
    'acciones',
  ];
  dataSource: MatTableDataSource<Rutas>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  rutas: Rutas[] = [];
  isMobile = false;
  mode: 'admin' | 'cobrador' = 'admin';
  isAdmin = false;
  isCobrador = false;
  searchKey: string = '';
  statusKey: string = 'todos';
 

  constructor(
    private responsive: BreakpointObserver,
    private router: Router,
    private rutaService: RutasService,
    private route: ActivatedRoute,
    private auth: AuthMockService
  ) {
    this.dataSource = new MatTableDataSource(this.rutas);
    
  }

  ngOnInit(): void {

    // Seguridad: si el usuario es cobrador, forzar modo cobrador
   const userRol = this.auth.getRol(); // admin | cobrador
  const routeMode = this.route.snapshot.data['mode'] as 'admin' | 'cobrador' | undefined;

 this.mode = userRol === 'admin'
    ? (routeMode ?? 'admin')
    : 'cobrador';
    
  this.isAdmin = this.mode === 'admin';
  this.isCobrador = this.mode === 'cobrador';
  this.configurarColumnas();
    this.detectMobile();
    this.getRutas();
  }
  configurarColumnas() {
  this.displayedColumns = this.isAdmin
    ? ['nombre_ruta', 'cobrador', 'zona', 'estado', 'created_at', 'acciones']
    : ['nombre_ruta', 'cobrador', 'zona', 'estado'];
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Rutas, filter: string): boolean => {
      const filterParts = JSON.parse(filter);
      const searchTerm = filterParts.search.trim().toLowerCase();
      const statusTerm = filterParts.status.trim().toLowerCase();

      const statusMatch = (statusTerm === 'todos' || data.estado?.toLowerCase() === statusTerm);

      if (!statusMatch) {
        return false;
      }

      return (
        data.nombre_ruta.toLowerCase().includes(searchTerm) ||
        (data.cobrador || '').toLowerCase().includes(searchTerm) ||
        (data.zona || '').toLowerCase().includes(searchTerm)
      );
    };
  }

  detectMobile() {
    this.responsive.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
      if (!this.isMobile) {
        setTimeout(() => (this.dataSource.paginator = this.paginator));
      }
    });
  }

  getRutas() {
    this.rutaService.getRutas().subscribe((data: Rutas[]) => {
      this.rutas = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilters() {
    const filterValue = {
      search: this.searchKey,
      status: this.statusKey
    };
    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clearSearch() {
    this.searchKey = '';
    this.applyFilters();
  }

  delete(ruta: Rutas) {
    if (ruta.ruta_id && confirm('¿Deseas eliminar esta ruta?')) {
      this.rutaService.deleteRutas(ruta.ruta_id).subscribe(() => {
        this.getRutas();
      });
    }
  }
 
  editRuta(ruta: Rutas) {
    this.router.navigate(['/ruta/edit-ruta', ruta.ruta_id]);
  } 

  toggleEstadoRuta(ruta: Rutas) {
    const nuevoEstado = ruta.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = nuevoEstado === 'INACTIVO' ? 'desactivar' : 'activar';

    if (confirm(`¿Seguro que quieres ${accion} esta ruta?`)) {
      if (ruta.ruta_id) {
        const rutaActualizada = { ...ruta, estado: nuevoEstado };

        this.rutaService.editRutas(ruta.ruta_id, rutaActualizada).subscribe({
          next: () => {
            window.alert(`Ruta ${accion}da exitosamente.`);
            this.getRutas();
          },
          error: (err) => {
            console.error(`Error al ${accion} la ruta:`, err);
            window.alert(`No se pudo ${accion} la ruta.`);
          },
        });
      }
    }
  }

  onRowClick(ruta: Rutas) {
    if (this.mode === 'admin') {
      this.router.navigate(['/ruta/edit-ruta', ruta.ruta_id]);
    } else if (this.mode === 'cobrador') {
      this.router.navigate(['/cobro/ruta', ruta.ruta_id, 'cobros']);
    }
  }
}