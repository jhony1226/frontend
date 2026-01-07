import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,
     FormBuilder,
     FormGroup,
     Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CobroService } from '../../../services/cobro.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-cobro',
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
  ],
  templateUrl: './edit-cobro.component.html',
  styleUrls: ['./edit-cobro.component.scss']
})
export class EditCobroComponent implements OnInit {
  cobroForm: FormGroup;
  cobroId: string | number | null = null;
  rutaId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private cobroService: CobroService,
    private dialog: MatDialog
  ) {
    this.cobroForm = this.fb.group({
      monto_cobrado: [null, [Validators.required, Validators.min(0.01)]],
      estado: ['Pagado', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cobroId = params['id'] || null;
      this.rutaId = params['rutaId'] || null;
      
      if (this.cobroId) {
        this.loadCobroData();
      }
    });
  }

  loadCobroData() {
    if (this.cobroId) {
      this.cobroService.getCobro(this.cobroId).subscribe({
        next: (data) => {
          this.cobroForm.patchValue(data);
        },
        error: (err) => console.error('Error al cargar el cobro', err)
      });
    }
  }

  onSubmit() {
  if (!this.cobroForm.valid) {
    this.cobroForm.markAllAsTouched();
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    disableClose: true,
    data: {
      title: 'Confirmar actualización',
      message: '¿Está seguro de que desea actualizar este cobro?',
      confirmText: 'Actualizar',
      cancelText: 'Cancelar',
      color: 'primary',
      icon: 'edit',
      type: 'warning'
    }
  });

  dialogRef.afterClosed().subscribe(confirmado => {
    if (confirmado) {
      this.actualizarCobro();
    }
  });
}
private actualizarCobro() {
  if (!this.cobroId) return;

  const cobroData = this.cobroForm.value;

  this.cobroService.editCobro(this.cobroId, cobroData).subscribe({
    next: () => {
      this.dialog.open(ConfirmDialogComponent, {
        width: '380px',
        data: {
          title: 'Actualización exitosa',
          message: 'El cobro fue actualizado correctamente.',
          confirmText: 'Aceptar',
          color: 'primary',
          icon: 'check_circle',
          type: 'success'
        }
      }).afterClosed().subscribe(() => {
        this.cancelar();
      });
    },
    error: (err) => {
      console.error('Error al actualizar el cobro:', err);
      this.dialog.open(ConfirmDialogComponent, {
        width: '380px',
        data: {
          title: 'Error',
          message: 'No se pudo actualizar el cobro.',
          confirmText: 'Aceptar',
          color: 'warn',
          icon: 'error',
          type: 'error'
        }
      });
    }
  });
}

  cancelar() {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Cancelar edición',
      message: '¿Desea salir sin guardar los cambios?',
      confirmText: 'Salir',
      cancelText: 'Continuar editando',
      color: 'warn',
      icon: 'warning',
      type: 'warning'
    }
  });

  dialogRef.afterClosed().subscribe(confirmado => {
    if (confirmado) {
      if (this.rutaId) {
        this.router.navigate(['/list-cobro', this.rutaId]);
      } else {
        this.router.navigate(['/cobro/list-cobro']);
      }
    }
  });
}
}

