import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-usuario',
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
    MatIconModule
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  loading = false;

  tiposUsuario = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Cobrador' }
  ];

  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      tipo_usuario: [2, [Validators.required]],
      estado: ['activo', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // TODO: Implementar llamada al servicio
    // this.usuarioService.createUsuario(this.usuarioForm.value).subscribe({
    //   next: (response) => {
    //     console.log('Usuario creado:', response);
    //     this.router.navigate(['/usuario/list']);
    //   },
    //   error: (error) => {
    //     console.error('Error al crear usuario:', error);
    //     this.loading = false;
    //   }
    // });

    // Simulación
    console.log('Crear usuario:', this.usuarioForm.value);
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/usuario/list']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/usuario/list']);
  }

  get nombres() { return this.usuarioForm.get('nombres'); }
  get apellidos() { return this.usuarioForm.get('apellidos'); }
  get telefono() { return this.usuarioForm.get('telefono'); }
  get email() { return this.usuarioForm.get('email'); }
  get tipo_usuario() { return this.usuarioForm.get('tipo_usuario'); }
  get estado() { return this.usuarioForm.get('estado'); }
}
