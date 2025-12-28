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
  selector: 'app-list-gasto',
  templateUrl: './list-gasto.component.html',
  styleUrls: ['./list-gasto.component.scss'],
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
export class ListGastoComponent implements OnInit {
  displayedColumns: string[] = [
    'cliente',
    'ruta',
    'concepto',
    'fecha',
    'valor',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  gastoData: any;
  message: string = '';
  isMobile = false;

  constructor(private router: Router, private responsive: BreakpointObserver) {
    this.gastoData = [];
    this.dataSource = new MatTableDataSource(this.gastoData);
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
        ruta: 'Ruta Centro',
        concepto: 'Combustible',
        fecha: new Date('2025-01-15'),
        valor: 150000,
        descripcion: 'Combustible para vehículo de reparto',
      },
      {
        _id: '2',
        cliente: 'María López',
        ruta: 'Ruta Norte',
        concepto: 'Peaje',
        fecha: new Date('2025-01-20'),
        valor: 45000,
        descripcion: 'Peajes de la ruta',
      },
      {
        _id: '3',
        cliente: 'Carlos Rodríguez',
        ruta: 'Ruta Sur',
        concepto: 'Alimentación',
        fecha: new Date('2025-01-10'),
        valor: 80000,
        descripcion: 'Almuerzo durante ruta',
      },
      {
        _id: '4',
        cliente: 'Ana Martínez',
        ruta: 'Ruta Centro',
        concepto: 'Mantenimiento',
        fecha: new Date('2025-01-25'),
        valor: 350000,
        descripcion: 'Cambio de aceite y filtros',
      },
      {
        _id: '5',
        cliente: 'Luis García',
        ruta: 'Ruta Norte',
        concepto: 'Combustible',
        fecha: new Date('2025-01-05'),
        valor: 180000,
        descripcion: 'Combustible para ruta larga',
      },
      {
        _id: '6',
        cliente: 'Sofía Hernández',
        ruta: 'Ruta Sur',
        concepto: 'Peaje',
        fecha: new Date('2025-01-18'),
        valor: 60000,
        descripcion: 'Peajes múltiples',
      },
      {
        _id: '7',
        cliente: 'Pedro Sánchez',
        ruta: 'Ruta Centro',
        concepto: 'Alimentación',
        fecha: new Date('2025-01-22'),
        valor: 95000,
        descripcion: 'Comidas del equipo',
      },
    ];

    this.gastoData = data;
    this.dataSource = new MatTableDataSource(this.gastoData);

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

  deleteGasto = async (gasto: any) => {
    if (await this.deleteGastoSnackBar()) {
      let index = this.gastoData.indexOf(gasto);
      if (index > -1) {
        this.gastoData.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.gastoData);
        this.dataSource.paginator = this.paginator;
        this.message = 'Gasto eliminado exitosamente';
        this.openSnackBarSuccesfull();
      }
    }
  };

  delete = async (item: any) => {
    await this.deleteGasto(item);
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

  deleteGastoSnackBar = async () => {
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

