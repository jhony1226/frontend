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
    MatCardModule,
  ],
})
export class ListCobroComponent implements OnInit {
  displayedColumns: string[] = [
    'cliente',
    'prestamo',
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

  constructor(private router: Router, private responsive: BreakpointObserver) {
    this.cobroData = [];
    this.dataSource = new MatTableDataSource(this.cobroData);
  }

  ngOnInit(): void {
    this.detectMobile();
    this.loadLocalData();
  }

  loadLocalData() {
    const data = [
      {
        _id: '1',
        cliente: 'Juan Pérez',
        prestamo: 'Préstamo Personal #101',
        fecha_cobro: new Date('2025-01-15'),
        monto_cobrado: 500000,
        estado: 'Pagado',
      },
      {
        _id: '2',
        cliente: 'María López',
        prestamo: 'Préstamo Hipotecario #102',
        fecha_cobro: new Date('2025-01-20'),
        monto_cobrado: 750000,
        estado: 'Pendiente',
      },
      {
        _id: '3',
        cliente: 'Carlos Rodríguez',
        prestamo: 'Préstamo Personal #103',
        fecha_cobro: new Date('2025-01-10'),
        monto_cobrado: 300000,
        estado: 'Parcial',
      },
      {
        _id: '4',
        cliente: 'Ana Martínez',
        prestamo: 'Préstamo Vehicular #104',
        fecha_cobro: new Date('2025-01-25'),
        monto_cobrado: 1200000,
        estado: 'Pagado',
      },
      {
        _id: '5',
        cliente: 'Luis García',
        prestamo: 'Préstamo Personal #105',
        fecha_cobro: new Date('2025-01-05'),
        monto_cobrado: 250000,
        estado: 'Anulado',
      },
      {
        _id: '6',
        cliente: 'Sofía Hernández',
        prestamo: 'Préstamo Hipotecario #106',
        fecha_cobro: new Date('2025-01-18'),
        monto_cobrado: 900000,
        estado: 'Pendiente',
      },
      {
        _id: '7',
        cliente: 'Pedro Sánchez',
        prestamo: 'Préstamo Vehicular #107',
        fecha_cobro: new Date('2025-01-22'),
        monto_cobrado: 600000,
        estado: 'Parcial',
      },
    ];

    this.cobroData = data;
    this.dataSource = new MatTableDataSource(this.cobroData);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
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
}

