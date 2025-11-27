import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})


export class CrearComponent implements OnInit {
  sucursalForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sucursalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      fechaCreacion: [new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.sucursalForm.valid) {
      const nuevaSucursal = this.sucursalForm.value;
      console.log('Sucursal creada:', nuevaSucursal);
      // Aquí puedes llamar al servicio para guardar la sucursal
    } else {
      this.sucursalForm.markAllAsTouched();
    }
  }
}


