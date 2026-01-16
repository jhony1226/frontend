import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-editar-usuario',
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
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  loading = false;
  usuarioId: number | null = null;

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
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      sucursal_id: [null],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: [''],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      tipo_usuario: [2, [Validators.required]],
      estado: ['activo', [Validators.required]]
    });

    // Obtener ID del usuario de la ruta
    this.route.params.subscribe(params => {
      this.usuarioId = params['id'] ? +params['id'] : null;
      if (this.usuarioId) {
        this.cargarUsuario(this.usuarioId);
      }
    });
  }

  cargarUsuario(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue(usuario);
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    if (!this.usuarioId) {
      console.error('No se ha especificado el ID del usuario');
      return;
    }

    this.loading = true;

    const datosActualizados = this.usuarioForm.value;
    console.log('Enviando datos:', datosActualizados);

    this.usuarioService.updateUsuario(this.usuarioId, datosActualizados)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          setTimeout(() => {
            this.router.navigate(['/usuario/list']);
          }, 0);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar usuario: ' + (error.error?.error || error.message));
        }
      });
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
