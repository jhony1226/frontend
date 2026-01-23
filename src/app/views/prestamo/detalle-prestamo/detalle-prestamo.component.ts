import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PrestamoService, Prestamos, CobroDetalle } from '../../../services/prestamo.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <--- AGREGAR ESTO
 

@Component({
  selector: 'app-detalle-prestamo',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './detalle-prestamo.component.html',
  styleUrls: ['./detalle-prestamo.component.scss']
})
export class DetallePrestamoComponent implements OnInit {
  prestamo: Prestamos | null = null;
  prestamoId: number | null = null;
  displayedColumns: string[] = ['fecha_cobro', 'monto_cobrado', 'estado'];

  constructor(
    private route: ActivatedRoute,
    private prestamoService: PrestamoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.prestamoId = +id;
        this.loadPrestamo(this.prestamoId);
      }
    });
  }

  loadPrestamo(id: number) {
    this.prestamoService.getPrestamoInfoById(id).subscribe({
      next: (data) => {
        this.prestamo = data;
        if (this.prestamo) {
          // Convertir strings numéricos a números para inputs type="number"
          this.prestamo.monto_prestamo = Number(this.prestamo.monto_prestamo);
          this.prestamo.saldo_pendiente = Number(this.prestamo.saldo_pendiente);
          this.prestamo.valor_intereses = Number(this.prestamo.valor_intereses);
          this.prestamo.valor_cuota = Number(this.prestamo.valor_cuota);

          // Convertir fechas
          if (this.prestamo.fecha_desembolso) {
            this.prestamo.fecha_desembolso = new Date(this.prestamo.fecha_desembolso);
          }
          if (this.prestamo.fecha_fin_prestamo) {
            this.prestamo.fecha_fin_prestamo = new Date(this.prestamo.fecha_fin_prestamo);
          }
        }
      },
      error: (err) => {
        console.error('Error cargando préstamo', err);
      }
    });
  }

  guardar() {
    if (this.prestamo && this.prestamoId) {
      this.prestamoService.updatePrestamo(this.prestamoId, this.prestamo).subscribe({
        next: () => {
          alert('Préstamo actualizado correctamente');
          this.goBack();
        },
        error: (err) => {
          console.error('Error actualizando préstamo', err);
          alert('Error al actualizar el préstamo');
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}

