import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { RutasService } from '../../../services/rutas.service';
import { AuthMockService } from '../../../services/AuthMockService';
import { CobroService } from '../../../services/cobro.service';
@Component({
  selector: 'app-list-cobro',
  templateUrl: './list-cobro.component.html',
  styleUrls: ['./list-cobro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule
  ],
})
export class ListCobroComponent implements OnInit {
  displayedColumns: string[] = [
    'idprestamo',
    'nombrecliente',
    'cobrador',
    'fecha_cobro',
    'monto_cobrado',
    'estado',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  cobroData: any;
  message: string = '';
  isMobile = false;
  rutaId: string | null = null;
  isCobrosPorRuta = false;
  nombreRuta: string = '';
  canDelete = true; // Controla si se puede eliminar

  constructor(
    private router: Router,
    private responsive: BreakpointObserver,
    private route: ActivatedRoute,
    private rutasService: RutasService,
    private auth: AuthMockService,
    private cobroService: CobroService
  ) {
    this.cobroData = [];
    this.dataSource = new MatTableDataSource(this.cobroData);
  }

  ngOnInit(): void {
    this.detectMobile();

    this.route.paramMap.subscribe(params => {
      this.rutaId = params.get('rutaId');
      this.isCobrosPorRuta = !!this.rutaId;

      // Si es cobrador y viene desde list-ruta, deshabilitar eliminación
      this.canDelete = !(this.isCobrosPorRuta && this.auth.isCobrador());

      if (this.isCobrosPorRuta && this.rutaId) {
        this.obtenerNombreRuta(this.rutaId);
      }
      this.loadCobros();
    });
  }

  loadCobros() {
    this.cobroService.getCobros().subscribe({
      next: (data) => {
        const filteredData = this.isCobrosPorRuta && this.rutaId
          ? data.filter((c) => c.ruta_id == Number(this.rutaId))
          : data;

        this.cobroData = filteredData;
        this.dataSource = new MatTableDataSource(this.cobroData);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar cobros', err);
      }
    });
  }

  obtenerNombreRuta(id: string) {
    this.rutasService.getRutas().subscribe((rutas: any[]) => {
      const rutaEncontrada = rutas.find((r) => r.ruta_id == id);
      if (rutaEncontrada) {
        this.nombreRuta = rutaEncontrada.nombre_ruta;
      }
    });
  }

  detectMobile() {
    this.responsive.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
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

  filterByState(state: string) {
    if (!state) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = state;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCobro = async (cobro: any) => {
    if (await this.deleteCobroSnackBar()) {
      let index = this.cobroData.indexOf(cobro);
      if (index > -1) {
        this.cobroData.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.cobroData);
        this.dataSource.paginator = this.paginator;
        this.message = 'Cobro eliminado exitosamente';
        this.openSnackBarSuccesfull();
      }
    }
  };

  delete = async (item: any) => {
    await this.deleteCobro(item);
  };

  openSnackBarSuccesfull() {
    Swal.fire({
      icon: 'success',
      title: this.message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  openSnackBarError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: this.message,
    });
  }

  deleteCobroSnackBar = async () => {
    let res;
    await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      res = result.isConfirmed;
    });
    return res;
  };

  getEditQueryParams(item: any): any {
    const params: any = { id: item._id };
    if (this.isCobrosPorRuta && this.rutaId) {
      params.rutaId = this.rutaId;
    }
    return params;
  }

  getEditRoute(item: any): string[] {
    // Si viene desde list-ruta y el usuario NO es admin (es cobrador), usar edit-cobro
    if (this.isCobrosPorRuta && !this.auth.isAdmin()) {
      return ['/cobro/edit-cobro'];
    }
    // Si es admin, usar crear-cobro (edición completa)
    return ['/cobro/crear-cobro'];
  }
}
