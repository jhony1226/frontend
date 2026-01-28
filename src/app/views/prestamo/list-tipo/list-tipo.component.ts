import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { TipoPrestamo, TipoPrestamoService } from '../../../services/tipoPrestamo.service';

@Component({
  selector: 'app-list-tipo',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './list-tipo.component.html',
  styleUrls: ['./list-tipo.component.scss']
})
export class ListTipoComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'frecuencia', 'cuotas', 'porcentaje', 'actions'];
  dataSource = new MatTableDataSource<TipoPrestamo>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tipoPrestamoService: TipoPrestamoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
  }

  cargarTipos() {
    this.tipoPrestamoService.getTiposPrestamo().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error cargando tipos de préstamo', err)
    });
  }

  eliminarTipo(id: number) {
    if (confirm('¿Estás seguro de eliminar este tipo de préstamo?')) {
      this.tipoPrestamoService.deleteTipoPrestamo(id).subscribe({
        next: () => {
          this.cargarTipos();
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}
