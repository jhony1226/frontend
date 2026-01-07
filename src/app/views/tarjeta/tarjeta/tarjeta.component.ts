import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; // Importante

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatTableModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatIconModule, MatCheckboxModule
  ],
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {
  isMobile: boolean = false;
  montoRecibido: number = 0;
  // Columnas simplificadas según tu requerimiento
  displayedColumns: string[] = ['num', 'fecha', 'abonar', 'seleccion'];

  cliente = {
    nombre: 'Juan Pérez',
    prestamoId: '#12345',
    ruta: 'Centro - Lunes',
    fechaCobro: new Date()
  };

  resumen = {
    cuotaDelDia: 20000,
    pagadoHoy: 0,
    saldoTotalPrestamo: 180000
  };

  // Generación dinámica de 30 días
  planPagos = Array.from({ length: 30 }, (_, i) => ({
    num: i + 1,
    fecha: `0${(i % 9) + 1}/01/2026`, // Fecha simulada
    cuota: 20000,
    abonar: 0, // Este valor se calcula dinámicamente
    completado: false
  }));

  

  ngOnInit() {
    this.checkScreen();
    window.onresize = () => this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  // Lógica opcional para actualizar el resumen al marcar
  actualizarResumen() {
    const pagado = this.planPagos
      .filter(p => p.completado)
      .reduce((acc, curr) => acc + curr.cuota, 0);
    this.resumen.pagadoHoy = pagado;
  }
  // Lógica de distribución dinámica
  actualizarDistribucion() {
    let fondoRestante = this.montoRecibido;
    
    // Resetear abonos de todas las filas
    this.planPagos.forEach(p => p.abonar = 0);

    // Distribuir solo en las filas seleccionadas (máximo 20k por fila)
    this.planPagos.filter(p => p.completado).forEach(p => {
      if (fondoRestante >= 20000) {
        p.abonar = 20000;
        fondoRestante -= 20000;
      } else if (fondoRestante > 0) {
        p.abonar = fondoRestante;
        fondoRestante = 0;
      } else {
        p.abonar = 0;
      }
    });

    // Actualizar el resumen visual
    this.resumen.pagadoHoy = this.planPagos.reduce((acc, curr) => acc + curr.abonar, 0);
  }

}