import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { TipoPrestamo, TipoPrestamoService } from '../../../services/tipoPrestamo.service';


@Component({
  selector: 'app-tipo-prestamo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule 
  ],
  templateUrl: './tipo-prestamo.component.html',
  styleUrls: ['./tipo-prestamo.component.scss']
})
export class TipoPrestamoComponent implements OnInit {

  cantidadCuotas: number | null = null;
  porcentaje: number | null = null;  
  isEditing = false;
  editingId: number | null = null;
  incluyeDomingos: boolean = false;
  diasGracia: number = 0;
  frecuencia: string = 'DIARIO';
  nombrePlan: string = '';
  constructor(
    private tipoPrestamoService: TipoPrestamoService,
    private router: Router,
    private route: ActivatedRoute // Para obtener el ID si estamos editando
  ) { }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.editingId = +id; // El '+' convierte el string a number
        this.loadTipoPrestamo(this.editingId);
      }
    });
  }

  loadTipoPrestamo(id: number): void {
    this.tipoPrestamoService.getTipoPrestamoById(id).subscribe({
      next: (tipo) => {
        this.cantidadCuotas = tipo.cantidad_cuotas;
        this.porcentaje = tipo.porcentaje;
      },
      error: (err: any) => {
        console.error('Error al cargar tipo de préstamo:', err);
        window.alert('No se pudo cargar la información del tipo de préstamo.');
        this.router.navigate(['/prestamo/list-tipo']); // Redirigir si hay error
      }
    });
  }

  guardar(): void {
    if (this.cantidadCuotas === null || this.porcentaje === null) {
      window.alert('Por favor, completa todos los campos.');
      return;
    }

    const tipoPrestamoData: Partial<TipoPrestamo> = {
      cantidad_cuotas: this.cantidadCuotas,
      porcentaje: this.porcentaje
    };

    if (this.isEditing && this.editingId) {
      this.tipoPrestamoService.updateTipoPrestamo(this.editingId, tipoPrestamoData).subscribe({
        next: (res) => {
          window.alert('¡Tipo de préstamo actualizado exitosamente!');
          this.cancelar();
        },
       error: (err: any) => {
          console.error('Error al actualizar tipo de préstamo:', err);
          window.alert('Error al actualizar el tipo de préstamo.');
        }
      });
    } else {
      this.tipoPrestamoService.createTipoPrestamo(tipoPrestamoData).subscribe({
        next: (res: TipoPrestamo) => {
          window.alert('Configuración guardada exitosamente');
          this.cancelar();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error de servidor:', err.status);
          window.alert('No se pudo crear el tipo de préstamo');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/prestamo/list-tipo']); // Navegar a la lista de tipos de préstamo
  }

  get totalEjemplo() {
  const montoBase = 1000000;
  // Si this.porcentaje es null o undefined, usa 0
  const porcentajeSeguro = this.porcentaje ?? 0;
  const interes = (porcentajeSeguro / 100) * montoBase;
  return montoBase + interes;
}

get valorCuotaEjemplo() {
  // Si cantidadCuotas es nulo, indefinido o 0, el resultado es 0
  if (!this.cantidadCuotas || this.cantidadCuotas === 0) {
    return 0;
  }
  return this.totalEjemplo / this.cantidadCuotas;
}
}