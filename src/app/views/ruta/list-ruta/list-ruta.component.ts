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

@Component({
  selector: 'app-list-ruta',
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
  templateUrl: './list-ruta.component.html',
  styleUrls: ['./list-ruta.component.scss'],
})
export class ListRutaComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'direccion',
    'zona',
    'estado',
    'createdAt',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  rutas: any[] = [];
  isMobile = false;

  constructor(private responsive: BreakpointObserver, private router: Router) {
    this.dataSource = new MatTableDataSource(this.rutas);
  }

  ngOnInit(): void {
    this.detectMobile();
    this.loadLocalData();
  }

  detectMobile() {
    this.responsive.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
      if (!this.isMobile) {
        setTimeout(() => (this.dataSource.paginator = this.paginator));
      }
    });
  }

  loadLocalData() {
    const rutasGuardadas = localStorage.getItem('rutas');
    this.rutas = rutasGuardadas ? JSON.parse(rutasGuardadas) : this.getDefaultRutas();
    this.dataSource = new MatTableDataSource(this.rutas);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  getDefaultRutas() {
    return [
      {
        id: 1,
        nombre: 'Ruta Centro',
        direccion: 'Calle 10 #20-30',
        zona: 'Centro',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      },
      {
        id: 2,
        nombre: 'Ruta Norte',
        direccion: 'Av 7 #110-15',
        zona: 'Norte',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      },
      {
        id: 3,
        nombre: 'Ruta Sur',
        direccion: 'Cll 5 #45-10',
        zona: 'Sur',
        estado: 'INACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      },
      {
        id: 4,
        nombre: 'Ruta Occidente',
        direccion: 'Cra 80 #30-20',
        zona: 'Occidente',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      },
      {
        id: 5,
        nombre: 'Ruta Oriente',
        direccion: 'Av. Las Palmas #50-60',
        zona: 'Oriente',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      },
    ];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(ruta: any) {
    if (confirm('¿Deseas eliminar esta ruta?')) {
      this.rutas = this.rutas.filter((r) => r.id !== ruta.id);
      localStorage.setItem('rutas', JSON.stringify(this.rutas));
      this.loadLocalData();
    }
  }

  editRuta(ruta: any) {
    this.router.navigate(['/ruta/edit-ruta', ruta.id]);
  }
}
