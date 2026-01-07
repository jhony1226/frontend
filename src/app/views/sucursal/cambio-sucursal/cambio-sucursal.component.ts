import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SucursalService, Sucursal } from '../../../services/sucursal.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
 

@Component({
  selector: 'app-cambio-sucursal',
  templateUrl: './cambio-sucursal.component.html',
  styleUrls: ['./cambio-sucursal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class CambioSucursalComponent implements OnInit {
  sucursales: Sucursal[] = [];

  selectedId: number | null = null;

  constructor(
    public router: Router,
    private sucursalService: SucursalService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const id = localStorage.getItem('sucursalId');
    this.selectedId = id ? Number(id) : null;
  }

  ngOnInit(): void {
    this.getSucursales();
  }

  getSucursales() {
    this.sucursalService.getSucursales().subscribe((data: Sucursal[]) => {
      this.sucursales = data;
    });
  }

  changeSucursal() {
    if (!this.selectedId) {
      this.snackBar.open(
        'Por favor seleccione una sucursal antes de cambiar',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const selected = this.sucursales.find(
      (s) => s.sucursal_id === this.selectedId
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Cambiar de sucursal',
        message: `
          ¿Desea cambiar a la sucursal
          <b>${selected?.nombre || 'seleccionada'}</b>?
        `,
        confirmText: 'Cambiar',
        cancelText: 'Cancelar',
        color: 'primary',
        icon: 'swap_horiz',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.cambiarSucursalConfirmada(selected);
      }
    });
  }

  private cambiarSucursalConfirmada(selected: Sucursal | undefined): void {
    if (this.selectedId) {
      localStorage.setItem('sucursalId', String(this.selectedId));
      localStorage.setItem('sucursalName', selected ? selected.nombre : '');
      
      this.snackBar.open(
        `Sucursal cambiada a: ${selected?.nombre || 'seleccionada'}`,
        'Cerrar',
        { duration: 3000 }
      );
      
      // navigate to list-rutas
      this.router.navigate(['/ruta/list-ruta']);
    }
  }
}
