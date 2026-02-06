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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatIconModule,
    MatProgressSpinnerModule
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

  // --- GETTERS PARA LOS CONTROLES ---
  get nombres() { return this.usuarioForm.get('nombres'); }
  get apellidos() { return this.usuarioForm.get('apellidos'); }
  get telefono() { return this.usuarioForm.get('telefono'); }
  get email() { return this.usuarioForm.get('email'); }
  get tipo_usuario() { return this.usuarioForm.get('tipo_usuario'); }
  get estado() { return this.usuarioForm.get('estado'); }

  // --- MÉTODOS DE ERROR PARA EL HTML ---
  getNombresError(): string {
    if (this.nombres?.hasError('required')) return 'Los nombres son requeridos';
    if (this.nombres?.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getApellidosError(): string {
    if (this.apellidos?.hasError('required')) return 'Los apellidos son requeridos';
    if (this.apellidos?.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getEmailError(): string {
    if (this.email?.hasError('required')) return 'El email es requerido';
    if (this.email?.hasError('email')) return 'Email inválido';
    return '';
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Simulación de guardado (aquí iría tu usuarioService)
    console.log('Datos a enviar:', this.usuarioForm.value);
    
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/usuario/list']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/usuario/list']);
  }
}