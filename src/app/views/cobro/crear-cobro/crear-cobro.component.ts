import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,
     FormBuilder,
     FormGroup,
     Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-crear-cobro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './crear-cobro.component.html',
  styleUrls: ['./crear-cobro.component.scss']
})
export class CrearCobroComponent implements OnInit {
  cobroForm: FormGroup;
  // Listas para los selectores (deberían cargarse desde un servicio)
  clientes: any[] = []; 
  prestamos: any[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.cobroForm = this.fb.group({
      cliente_id: ['', Validators.required],
      prestamo_id: ['', Validators.required],
      fecha_cobro: [new Date(), Validators.required],
      monto_cobrado: [null, [Validators.required, Validators.min(0.01)]],
      estado: ['Pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // TODO: Reemplazar con llamadas reales a tus servicios de Cliente y Préstamo
    this.clientes = [
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María López' }
    ];
    
    // Idealmente, los préstamos se filtrarían al seleccionar un cliente
    this.prestamos = [
      { id: 101, descripcion: 'Préstamo Personal #101' },
      { id: 102, descripcion: 'Préstamo Hipotecario #102' }
    ];
  }

  onSubmit() {
    if (this.cobroForm.valid) {
      console.log('Datos del cobro:', this.cobroForm.value);
      // Aquí iría la llamada al servicio:
      // const cobroData = this.cobroForm.value;
      // this.cobroService.createCobro(cobroData).subscribe(...)
      window.alert('¡Cobro creado exitosamente!');
      this.cancelar();
    } else {
      this.cobroForm.markAllAsTouched();
    }
  }

  cancelar() {
    this.router.navigate(['/cobro/list-cobro']);
  }
}