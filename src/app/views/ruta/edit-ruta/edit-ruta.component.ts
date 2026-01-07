import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Rutas, RutasService } from '../../../services/rutas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-edit-ruta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './edit-ruta.component.html',
  styleUrls: ['./edit-ruta.component.scss'],
})
export class EditRutaComponent implements OnInit {
  ruta: Rutas = {
    sucursal_id: 1, // Asignar un valor por defecto o recuperarlo si es necesario
    nombre_ruta: '',
    descripcion: '',
    zona: '',
    estado: 'ACTIVO',
  };
  id: string | null = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rutaService: RutasService,   
  private dialog: MatDialog,
  private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.cargarRuta(this.id);
    } else {
      console.error('No se proporcionó ID de ruta para editar.');
      this.router.navigate(['/ruta/list-ruta']);
    }
  }

  cargarRuta(id: string): void {
  this.rutaService.getRutasById(id).subscribe({
    next: (data: any) => {

      const rutaData = Array.isArray(data) ? data[0] : data;

      if (rutaData && rutaData.ruta_id) {
        this.ruta = rutaData;
        return;
      }

      // Ruta no encontrada (caso lógico)
      this.snackBar.open(
        'La ruta solicitada no existe o fue eliminada',
        'Cerrar',
        { duration: 3500 }
      );

      this.router.navigate(['/ruta/list-ruta']);
    },

    error: (err) => {
      console.error('Error al cargar la ruta:', err);

      this.snackBar.open(
        'No fue posible cargar los datos de la ruta',
        'Cerrar',
        { duration: 4000 }
      );

      this.router.navigate(['/ruta/list-ruta']);
    }
  });
}


  actualizar(): void {

  if (!this.ruta.nombre_ruta) {
    this.snackBar.open(
      'El nombre de la ruta es obligatorio',
      'Cerrar',
      { duration: 3000 }
    );
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Actualizar ruta',
      message: `
        ¿Desea guardar los cambios realizados en la ruta
        <b>${this.ruta.nombre_ruta}</b>?
      `,
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
      color: 'primary',
      icon: 'save',
      type: 'info'
    }
  });

  dialogRef.afterClosed().subscribe(confirmado => {
    if (confirmado) {
      this.actualizarRutaConfirmada();
    }
  });
}
private actualizarRutaConfirmada(): void {

  if (!this.ruta.ruta_id) {
    return;
  }

  this.rutaService.editRutas(this.ruta.ruta_id, this.ruta).subscribe({
    next: () => {
      this.snackBar.open(
        'Ruta actualizada exitosamente',
        'Cerrar',
        { duration: 3000 }
      );
      this.router.navigate(['/ruta/list-ruta']);
    },
    error: (err) => {
      console.error('Error al actualizar la ruta:', err);
      this.snackBar.open(
        'Ocurrió un error al actualizar la ruta',
        'Cerrar',
        { duration: 4000 }
      );
    }
  });
}

  cancelar() {
    this.router.navigate(['/ruta/list-ruta']);
  }
}