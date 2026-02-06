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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatIconModule,
    MatProgressSpinnerModule // Importante para el diseño moderno
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  loading = false;
  usuarioId: number | null = null;
  usuarioNombreActual = 'Cargando...'; // Para el subtítulo del diseño

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
    this.initForm();
    
    // Capturar ID y cargar datos
    this.route.params.subscribe(params => {
      this.usuarioId = params['id'] ? +params['id'] : null;
      if (this.usuarioId) {
        this.cargarUsuario(this.usuarioId);
      }
    });
  }

  private initForm(): void {
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
  }

  cargarUsuario(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue(usuario);
        this.usuarioNombreActual = `${usuario.nombres} ${usuario.apellidos}`;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.usuarioNombreActual = 'Error al cargar';
      }
    });
  }

  // --- MÉTODOS DE ERROR (Requeridos por el diseño moderno) ---
  getNombresError() {
    if (this.nombres?.hasError('required')) return 'Los nombres son requeridos';
    if (this.nombres?.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getApellidosError() {
    if (this.apellidos?.hasError('required')) return 'Los apellidos son requeridos';
    if (this.apellidos?.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getEmailError() {
    if (this.email?.hasError('required')) return 'El email es requerido';
    if (this.email?.hasError('email')) return 'Formato de email inválido';
    return '';
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid || !this.usuarioId) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.usuarioService.updateUsuario(this.usuarioId, this.usuarioForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/usuario/list']),
        error: (error) => alert('Error: ' + (error.error?.error || 'No se pudo actualizar'))
      });
  }

  onCancel(): void {
    this.router.navigate(['/usuario/list']);
  }

  // Getters
  get nombres() { return this.usuarioForm.get('nombres'); }
  get apellidos() { return this.usuarioForm.get('apellidos'); }
  get telefono() { return this.usuarioForm.get('telefono'); }
  get email() { return this.usuarioForm.get('email'); }
  get tipo_usuario() { return this.usuarioForm.get('tipo_usuario'); }
  get estado() { return this.usuarioForm.get('estado'); }
}